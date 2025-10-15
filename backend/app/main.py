from typing import Any, Dict, List
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AnimoAssign Backend")

# Allow Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- In-memory stores (replace with DB later) ----------------
ENLISTED: List[Dict[str, Any]] = []   # [{no, career, acadGroup, campus, courseCode, count}]
ENROLL:   List[Dict[str, Any]] = []   # [{program, freshman, sophomore, junior, senior}]
OFFER:    List[Dict[str, Any]] = []   # [{id, courseCode, title, section, faculty, units}]
ROOMS:    List[Dict[str, Any]] = []   # [{code, building, campus, status, capacity, type, schedule:[{day,slot,sectionCode}]}]
MAILS:    List[Dict[str, Any]] = []   # [{id, from, email, subject, preview, body, receivedAt}]

# ---------------- APO: Pre-Enlistment ----------------
@app.get("/api/apo/enlisted-courses")
async def get_enlisted(): return ENLISTED

@app.post("/api/apo/enlisted-courses/import")
async def import_enlisted(file: UploadFile = File(...)):
    # TODO: parse CSV; for now seed a row
    ENLISTED.clear()
    ENLISTED.extend([{"no": 1, "career": "UG", "acadGroup": "CCS", "campus": "Taft", "courseCode": "CCPROG1", "count": 30}])
    return {"imported": len(ENLISTED)}

@app.patch("/api/apo/enlisted-courses/{no}")
async def patch_enlisted(no: int, payload: Dict[str, Any]):
    for row in ENLISTED:
        if row["no"] == no:
            if "count" in payload: row["count"] = int(payload["count"])
            return {"ok": True}
    raise HTTPException(status_code=404, detail="row not found")

@app.get("/api/apo/enrollment-stats")
async def get_stats(): return ENROLL

@app.post("/api/apo/enrollment-stats/import")
async def import_stats(file: UploadFile = File(...)):
    ENROLL.clear()
    ENROLL.extend([{"program": "BSCS", "freshman": 120, "sophomore": 110, "junior": 95, "senior": 80}])
    return {"imported": len(ENROLL)}

@app.patch("/api/apo/enrollment-stats/{program}")
async def patch_stat(program: str, payload: Dict[str, Any]):
    for row in ENROLL:
        if row["program"] == program:
            row.update({k: int(v) if k != "program" else v for k, v in payload.items()})
            return {"ok": True}
    raise HTTPException(status_code=404, detail="program not found")

# ---------------- APO: Course Offerings ----------------
@app.get("/api/apo/course-offerings")
async def list_offers(): return OFFER

@app.post("/api/apo/course-offerings")
async def create_offer(payload: Dict[str, Any]):
    payload = dict(payload)
    payload["id"] = str(len(OFFER) + 1)
    OFFER.append(payload)
    return payload

@app.patch("/api/apo/course-offerings/{oid}")
async def update_offer(oid: str, patch: Dict[str, Any]):
    for o in OFFER:
        if o["id"] == oid:
            o.update(patch); return o
    raise HTTPException(status_code=404, detail="offering not found")

@app.delete("/api/apo/course-offerings/{oid}")
async def delete_offer(oid: str):
    idx = next((i for i, o in enumerate(OFFER) if o["id"] == oid), -1)
    if idx == -1: raise HTTPException(status_code=404, detail="offering not found")
    OFFER.pop(idx); return {"ok": True}

# ---------------- APO: Rooms ----------------
@app.get("/api/apo/rooms")
async def list_rooms(): return ROOMS

@app.post("/api/apo/rooms")
async def add_room(room: Dict[str, Any]):
    ROOMS.append(room); return room

@app.patch("/api/apo/rooms/{code}")
async def patch_room(code: str, patch: Dict[str, Any]):
    for r in ROOMS:
        if r["code"] == code:
            r.update(patch); return r
    raise HTTPException(status_code=404, detail="room not found")

@app.delete("/api/apo/rooms/{code}")
async def delete_room(code: str):
    idx = next((i for i, r in enumerate(ROOMS) if r["code"] == code), -1)
    if idx == -1: raise HTTPException(status_code=404, detail="room not found")
    ROOMS.pop(idx); return {"ok": True}

@app.post("/api/apo/rooms/{code}/allocate")
async def allocate(code: str, payload: Dict[str, Any]):
    for r in ROOMS:
        if r["code"] == code:
            r.setdefault("schedule", []).append(payload); return r
    raise HTTPException(status_code=404, detail="room not found")

@app.delete("/api/apo/rooms/{code}/allocate")
async def deallocate(code: str, payload: Dict[str, Any]):
    for r in ROOMS:
        if r["code"] == code:
            r["schedule"] = [s for s in r.get("schedule", []) if not (s["day"]==payload["day"] and s["slot"]==payload["slot"])]
            return r
    raise HTTPException(status_code=404, detail="room not found")

# ---------------- APO: Inbox ----------------
@app.get("/api/apo/messages")
async def list_mails(): return MAILS

@app.post("/api/apo/messages")
async def send_mail(payload: Dict[str, Any]):
    payload["id"] = str(len(MAILS) + 1)
    MAILS.append(payload); return {"id": payload["id"]}
