from pymongo import MongoClient
from datetime import datetime

# Connect to MongoDB
MONGO_URI = "mongodb://localhost:27017"   # change if using Atlas
client = MongoClient(MONGO_URI)
db = client["animoassign"]

# Collections
users_col = db["users"]
events_col = db["events"]
messages_col = db["messages"]

def save_dm_space(space_id, user_email, display_name):
    """Store DM space_id and display name for a user"""
    users_col.update_one(
        {"_id": user_email},
        {"$set": {f"dm_spaces.{space_id}": {"display_name": display_name}}},
        upsert=True
    )

def get_dm_display_name(space_id, user_email):
    """Retrieve stored display name for a DM space"""
    user = users_col.find_one({"_id": user_email})
    dm_info = user.get("dm_spaces", {}).get(space_id) if user else None
    return dm_info.get("display_name") if dm_info else None

def save_dm_mapping(sender_email, recipient_email, space_id, display_name=None):
    """Save 1-on-1 DM mapping keyed by space_id"""
    users_col.update_one(
        {"_id": sender_email},
        {"$set": {f"dm_spaces.{space_id}": {"recipient_email": recipient_email,
                                           "display_name": display_name or recipient_email}}},
        upsert=True
    )
def save_user(email, creds_dict, spaces=None):
    """Save or update user OAuth credentials + spaces"""
    update_data = {
        "email": email,
        "credentials": creds_dict
    }
    if spaces is not None:
        update_data["spaces"] = spaces

    users_col.update_one(
        {"_id": email},
        {"$set": update_data},
        upsert=True
    )

def get_user(email):
    """Get user credentials document"""
    return users_col.find_one({"_id": email})

def get_user_spaces(email):
    """Get saved spaces of a user"""
    user = users_col.find_one({"_id": email})
    return user.get("spaces", []) if user else []

def find_common_space(user_a, user_b):
    """Find a common Google Chat space between two users"""
    spaces_a = {s["name"] for s in get_user_spaces(user_a)}
    spaces_b = {s["name"] for s in get_user_spaces(user_b)}
    common = spaces_a.intersection(spaces_b)
    return list(common)[0] if common else None

def save_event(creator, target, event_data):
    """Log created event into MongoDB"""
    doc = {
        "creator": creator,
        "target": target,
        "event_id": event_data.get("id"),
        "summary": event_data.get("summary"),
        "start": event_data["start"].get("dateTime", event_data["start"].get("date")),
        "end": event_data["end"].get("dateTime", event_data["end"].get("date")),
        "attendees": event_data.get("attendees", []),
        "reminders": event_data.get("reminders", {}),
        "recurrence": event_data.get("recurrence", []),
        "created_at": datetime.utcnow()
    }
    events_col.insert_one(doc)

def save_chat_message(sender, recipient, message_text, status="sent"):
    """Log sent messages into MongoDB"""
    doc = {
        "sender": sender,
        "recipient": recipient,
        "message": message_text,
        "status": status,  # "sent", "failed", "pending", "sent_email"
        "message_type": "hybrid" if status == "sent_email" else "chat",
        "created_at": datetime.utcnow()
    }
    result = messages_col.insert_one(doc)
    return str(result.inserted_id)

def get_user_message_history(user_email, limit=50):
    """Get message history for a user"""
    return list(messages_col.find(
        {"$or": [{"sender": user_email}, {"recipient": user_email}]}
    ).sort("created_at", -1).limit(limit))


