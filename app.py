from flask import Flask, redirect, url_for, session, request, render_template
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
import os, base64
from email.mime.text import MIMEText
from google.oauth2.credentials import Credentials
from datetime import datetime
from schema.models import save_user, get_user, save_event

# Allow HTTP for development (REMOVE in production!)
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

app = Flask(__name__)
app.secret_key = "supersecret"  # change in production

# Google OAuth2 config - Added Chat API scopes
SCOPES = [
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/chat.messages',
    'https://www.googleapis.com/auth/chat.spaces.readonly',
    'https://www.googleapis.com/auth/chat.memberships.readonly',
    'openid',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
]

CLIENT_SECRET_FILE = "client_secret_455672992695-0n009b08acc3nu49s04321b9u6opmgf6.apps.googleusercontent.com.json"
REDIRECT_URI = "http://localhost:5000/oauth2callback"

# --- Helper functions ---
def creds_to_dict(creds):
    return {
        "token": creds.token,
        "refresh_token": creds.refresh_token,
        "token_uri": creds.token_uri,
        "client_id": creds.client_id,
        "client_secret": creds.client_secret,
        "scopes": creds.scopes
    }

def dict_to_creds(d):
    return Credentials(
        token=d["token"],
        refresh_token=d.get("refresh_token"),
        token_uri=d["token_uri"],
        client_id=d["client_id"],
        client_secret=d["client_secret"],
        scopes=list(d["scopes"])  # ensure it's a list, not a set
    )

def get_chat_spaces(chat_service, current_user_email=None):
    """
    Fetch spaces and display names.
    - Group spaces: fetch members from API
    - 1-on-1 DMs: fetch displayName from MongoDB or latest message
    """
    try:
        spaces_result = chat_service.spaces().list().execute()
        spaces = spaces_result.get('spaces', [])
        formatted_spaces = []

        from schema.models import users_col, save_dm_space

        for space in spaces:
            space_info = {
                'id': space.get('name', ''),  # full space_id
                'display_name': space.get('displayName', ''),  
                'type': space.get('spaceType', 'UNKNOWN'),
                'members': []
            }

            if space_info['type'] != "DIRECT_MESSAGE":
                # Group spaces: fetch members
                try:
                    memberships_result = chat_service.spaces().members().list(
                        parent=space['name']
                    ).execute()
                    memberships = memberships_result.get('memberships', [])
                    for membership in memberships:
                        member = membership.get('member', {})
                        if member.get('type') == 'HUMAN':
                            member_name = member.get('displayName', 'Unknown User')
                            member_email = (
                                member.get('name', '').replace('users/', '')
                                if 'users/' in member.get('name', '') else ''
                            )
                            if member_email != current_user_email:
                                space_info['members'].append({
                                    'name': member_name,
                                    'email': member_email
                                })
                except Exception as e:
                    print(f"Could not get members for space {space.get('name')}: {e}")

            else:  # DIRECT_MESSAGE
                display_name = None

                # 1. Check MongoDB if displayName exists
                other_users = users_col.find({f"dm_spaces.{space_info['id']}": {"$exists": True}})
                for other_user in other_users:
                    if other_user["_id"] != current_user_email:
                        dm_info = other_user["dm_spaces"][space_info['id']]
                        display_name = dm_info.get("display_name") or dm_info.get("recipient_email")
                        break

                # 2. If not found, fetch latest message sender's displayName
                if not display_name:
                    try:
                        latest_msg = chat_service.spaces().messages().list(
                            parent=space_info['id'], pageSize=1, orderBy="createTime desc"
                        ).execute()
                        messages = latest_msg.get("messages", [])
                        if messages:
                            sender = messages[0].get("sender", {})
                            display_name = sender.get("displayName", "Direct Message")
                            # Save in MongoDB for future
                            save_dm_space(space_info['id'], sender.get("email", "unknown"), display_name)
                        else:
                            display_name = "Direct Message"
                    except Exception as e:
                        print(f"Failed to fetch latest message for displayName in {space_info['id']}: {e}")
                        display_name = "Direct Message"

                space_info['display_name'] = display_name
                space_info['members'] = []  # still cannot fetch members from API

            formatted_spaces.append(space_info)
        return formatted_spaces

    except Exception as e:
        print(f"Error getting chat spaces: {e}")
        return []


def send_chat_message(chat_service, space_id, message_text, sender_email):
    """Send a message to a specific chat space"""
    message_body = {
        "text": f"📧 From: {sender_email}\n\n{message_text}\n\n---\nSent via AnimoAssign"
    }
    result = chat_service.spaces().messages().create(
        parent=space_id,
        body=message_body
    ).execute()
    return result

def send_gmail_message(gmail_service, to_email, subject, message_text, from_email):
    """Send an email (used as fallback)"""
    msg = MIMEText(message_text)
    msg["to"] = to_email
    msg["from"] = from_email
    msg["subject"] = subject
    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    result = gmail_service.users().messages().send(userId="me", body={"raw": raw}).execute()
    return result

from schema.models import users_col  # assuming you imported MongoClient in models.py

def save_user_dm_space(user_email, recipient_email, space_id):
    """Store DM space_id for 1-on-1 messaging"""
    users_col.update_one(
        {"_id": user_email},
        {"$set": {f"dm_spaces.{recipient_email}": space_id}},
        upsert=True
    )

def get_dm_space_id(sender_email, recipient_email):
    """Retrieve DM space_id if it exists"""
    user = users_col.find_one({"_id": sender_email})
    return user.get("dm_spaces", {}).get(recipient_email)


# --- Routes ---
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/login")
def login():
    flow = Flow.from_client_secrets_file(
        CLIENT_SECRET_FILE,
        scopes=SCOPES,
        redirect_uri=url_for("callback", _external=True)
    )
    auth_url, state = flow.authorization_url(prompt="consent")
    session["state"] = state
    return redirect(auth_url)

@app.route("/callback")
def callback():
    state = session["state"]
    flow = Flow.from_client_secrets_file(
        CLIENT_SECRET_FILE,
        scopes=SCOPES,
        redirect_uri=url_for("callback", _external=True)
    )
    flow.fetch_token(authorization_response=request.url)
    creds = flow.credentials
    oauth2_service = build("oauth2", "v2", credentials=creds)
    user_info = oauth2_service.userinfo().get().execute()
    email = user_info.get("email")
    if not email.endswith("@dlsu.edu.ph"):
        return "❌ Only @dlsu.edu.ph accounts allowed."
    save_user(email, creds_to_dict(creds))
    session["email"] = email
    session["credentials"] = creds_to_dict(creds)
    return redirect(url_for("compose"))

@app.route("/compose", methods=["GET", "POST"])
def compose():
    if "credentials" not in session:
        return redirect(url_for("index"))
    creds = dict_to_creds(session["credentials"])
    service = build("gmail", "v1", credentials=creds)
    if request.method == "POST":
        recipient = request.form["to"]
        subject = request.form["subject"]
        body = request.form["body"]
        msg = MIMEText(body)
        msg["to"] = recipient
        msg["from"] = session["email"]
        msg["subject"] = subject
        raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
        service.users().messages().send(userId="me", body={"raw": raw}).execute()
        return f"✅ Email sent to {recipient} with subject: {subject}"
    return render_template("compose.html")

@app.route("/hybrid-message", methods=["GET", "POST"])
def hybrid_message():
    if "credentials" not in session:
        return redirect(url_for("index"))

    if request.method == "POST":
        recipient_email = request.form.get("recipient_email", "").strip()
        subject = request.form.get("subject", "").strip()
        message_text = request.form.get("message", "").strip()

        if not recipient_email or not subject or not message_text:
            return render_template("hybrid_message.html", error="Please fill in all fields")

        if not recipient_email.endswith("@dlsu.edu.ph"):
            return render_template("hybrid_message.html", error="Can only message @dlsu.edu.ph emails")

        creds = dict_to_creds(session["credentials"])
        gmail_service = build("gmail", "v1", credentials=creds)
        chat_service = build("chat", "v1", credentials=creds)
        result_message = ""

        try:
            # Check MongoDB for existing DM space
            dm_space_id = get_dm_space_id(session["email"], recipient_email)
            if dm_space_id:
                try:
                    send_chat_message(chat_service, dm_space_id, message_text, session["email"])
                    result_message = f"✅ Chat message sent to {recipient_email}"
                except Exception:
                    # fallback to email
                    send_gmail_message(gmail_service, recipient_email, subject, message_text, session["email"])
                    result_message = f"⚠️ Chat failed, but ✅ Email sent to {recipient_email}"
            else:
                # No DM exists, fallback to Gmail
                send_gmail_message(gmail_service, recipient_email, subject, message_text, session["email"])
                result_message = f"⚠️ No DM found, but ✅ Email sent to {recipient_email}"
        except Exception as e:
            return render_template("hybrid_message.html", error=f"Message failed: {str(e)}")

        return render_template("hybrid_message.html", success=result_message)

    return render_template("hybrid_message.html")

@app.route("/chat", methods=["GET", "POST"])
def chat_page():
    if "credentials" not in session:
        return redirect(url_for("index"))

    creds = dict_to_creds(session["credentials"])
    chat_service = build("chat", "v1", credentials=creds)
    gmail_service = build("gmail", "v1", credentials=creds)

    error = None
    success = None

    # Fetch spaces from API
    api_spaces = get_chat_spaces(chat_service, current_user_email=session["email"])
    
    # Fetch saved spaces from MongoDB
    from schema.models import get_user_spaces, get_dm_display_name, save_dm_space, save_dm_mapping
    saved_spaces = get_user_spaces(session["email"])
    
    # Merge saved display names for DMs and fetch displayName if missing
    for space in api_spaces:
        for saved in saved_spaces:
            if space["id"] == saved.get("id"):
                space["display_name"] = saved.get("display_name", space["display_name"])
        if space["type"] == "DM":
            display_name = get_dm_display_name(space["id"], session["email"])
            if not display_name:
                try:
                    latest_msg = chat_service.spaces().messages().list(
                        parent=space["id"], pageSize=1, orderBy="createTime desc"
                    ).execute()
                    messages = latest_msg.get("messages", [])
                    if messages:
                        sender = messages[0]["sender"]
                        display_name = sender.get("displayName", "Direct Message")
                    else:
                        display_name = "Direct Message"
                except Exception as e:
                    print("Failed to fetch latest message for displayName:", e)
                    display_name = "Direct Message"
                # Save DM space immediately
                save_dm_space(space["id"], session["email"], display_name)
            space["display_name"] = display_name

    spaces = api_spaces  # Use merged spaces for rendering

    if request.method == "POST":
        space_id = request.form.get("space_id")
        recipient_email = request.form.get("recipient_email", "").strip()
        message = request.form.get("message", "").strip()

        if not message:
            error = "Message cannot be empty"
        else:
            try:
                if space_id:  # Send to selected space
                    send_chat_message(chat_service, space_id, message, session["email"])
                    save_dm_space(space_id, session["email"], recipient_email or "Direct Message")
                    success = f"✅ Message sent to {recipient_email or 'Direct Message'}"

                elif recipient_email:  # Send DM by email
                    existing_dm = None
                    for space in spaces:
                        if space['type'] == 'DM':
                            for member in space['members']:
                                if member['email'] == recipient_email:
                                    existing_dm = space['id']
                                    break
                            if existing_dm:
                                break

                    if existing_dm:
                        # Fetch displayName from DB or latest message
                        display_name = get_dm_display_name(existing_dm, recipient_email)
                        if not display_name:
                            try:
                                latest_msg = chat_service.spaces().messages().list(
                                    parent=existing_dm, pageSize=1, orderBy="createTime desc"
                                ).execute()
                                messages = latest_msg.get("messages", [])
                                if messages:
                                    sender = messages[0]["sender"]
                                    display_name = sender.get("displayName", recipient_email)
                                else:
                                    display_name = recipient_email
                            except Exception as e:
                                print("Failed to fetch latest message for displayName:", e)
                                display_name = recipient_email
                            # Save DM space immediately
                            save_dm_space(existing_dm, session["email"], display_name)

                        send_chat_message(chat_service, existing_dm, message, session["email"])
                        success = f"✅ Chat message sent to {display_name}"

                        # Save DM mapping
                        save_dm_mapping(session["email"], recipient_email, existing_dm, display_name=display_name)

                    else:
                        # No DM exists, fallback to Gmail
                        send_gmail_message(gmail_service, recipient_email, "Message via WebApp", message, session["email"])
                        success = f"⚠️ No DM found, but ✅ Email sent to {recipient_email}"
                else:
                    error = "Please select a space or enter an email."
            except Exception as e:
                error = f"Message failed: {str(e)}"

    return render_template("chat.html", spaces=spaces, error=error, success=success)




# NEW: direct send_chat endpoint (for testing only)
@app.route("/send_chat", methods=["POST"])
def send_chat_route():
    if "credentials" not in session:
        return redirect(url_for("index"))
    creds = dict_to_creds(session["credentials"])
    chat_service = build("chat", "v1", credentials=creds)
    space_id = request.form["space_id"]  # must be an existing space ID
    text = request.form["text"]
    send_chat_message(chat_service, space_id, text, session["email"])
    return f"✅ Chat message sent to {space_id}"

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("index"))

if __name__ == "__main__":
    app.run("localhost", 5000, debug=True)
