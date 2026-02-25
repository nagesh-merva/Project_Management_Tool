import random
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import HTTPException, UploadFile, File, Form
from pydantic import EmailStr
from motor.motor_asyncio import AsyncIOMotorDatabase

from models.clients import Client, ClientMetrics, ClientDocuments, ContactPerson, ClientEngagement, UpdateClientInput, ClientNote
from .utils import upload_file_to_firebase

db: AsyncIOMotorDatabase = None

def set_db(database: AsyncIOMotorDatabase):
    """Initialize database from main app"""
    global db
    db = database


# ============= Get all Clients briefs =================
async def get_all_client_briefs():
    """Get brief details of all clients"""
    clients = await db.Clients.find().to_list(1000)
    brief_list = [{
        "client_id": c["client_id"],
        "name": c["name"],
        "logo_url": c.get("logo_url"),
        "domain": c.get("industry"),
        "type": c.get("type")
    } for c in clients]

    return brief_list


# ============= Get all Clients details =================
async def get_all_clients():
    """Get all clients with full details"""
    clients = await db.Clients.find().to_list(1000)
    return clients


# ============= Get particular Clients details =================
async def get_all_details_client(client_id: str) -> Client:
    """Get full details of a single client"""
    if not client_id:
        raise HTTPException(status_code=400, detail="Client ID is required.")
    
    client = await db.Clients.find_one({"client_id": client_id}, {"_id": 0})
    if not client:
        raise HTTPException(status_code=404, detail="Client not found.")
    
    return client


# ============= Add new client =================
async def add_new_client(
    name: str = Form(...),
    brand_name: str = Form(...),
    type: str = Form(...),
    industry: str = Form(...),
    location: str = Form(...),
    website: Optional[str] = Form(None),
    gst_id: str = Form(...),
    source: str = Form(...),
    contact_name: str = Form(...),
    contact_email: EmailStr = Form(...),
    contact_phone: str = Form(...),
    contact_designation: str = Form(...),  
    file: UploadFile = File(...)
):
    """Add new client"""
    while True:
        random_id = f"CLT{random.randint(1000, 9999)}"
        existing = await db.Clients.find_one({"client_id": random_id})
        if not existing:
            break
        
    existing_clients = await db.Clients.find({}).to_list(1000)    
    for client in existing_clients:
        if client.get("brand_name") == brand_name or client.get("gst_id") == gst_id:
            raise HTTPException(
                status_code=409,
                detail=f"Client already exists.",
                headers={"X-Frontend-Message": f"Client already exists."}
            )  

    logo_url = await upload_file_to_firebase(file, folder=f"PMT/clients/{brand_name}")
    
    client_data = Client(
        client_id=random_id,
        name=name,
        brand_name=brand_name,
        logo_url=logo_url,
        type=type,
        industry=industry,
        location=location,
        website=website,
        gst_id=gst_id,
        primary_contact=ContactPerson(
            name=contact_name,
            email=contact_email,
            phone=contact_phone,
            designation=contact_designation  
        ),
        engagement=ClientEngagement(
            joined_date=datetime.utcnow(),
            source=source,
            onboarding_notes=None,
            tags=[industry, type]
        ),
        documents=[],  
        metrics=ClientMetrics()
    )

    await db.Clients.insert_one(client_data.dict())

    return {"message": "Client added successfully", "client_id": random_id}


# ============= Update existing client =================
async def update_client(data: UpdateClientInput):
    """Update client details"""
    if not data.client_id:
        raise HTTPException(status_code=400, detail="Client ID is required.")
    
    client = db.Clients.find_one({"client_id": data.client_id})
    if not client:  
        raise HTTPException(status_code=404, detail="Client not found.")

    update_data = {
        "name": data.name if data.name else None,
        "brand_name": data.brand_name if data.brand_name else None,
        "logo_url": data.logo_url if data.logo_url else None,
        "location": data.location if data.location else None,
        "website": data.website if data.website else None,
        "gst_id": data.gst_id if data.gst_id else None,
        "contact_name": data.contact_name if data.contact_name else None,
        "contact_email": data.contact_email if data.contact_email else None,
        "contact_phone": data.contact_phone if data.contact_phone else None,
    }
    
    update_fields = {key: value for key, value in update_data.items() if value is not None}
    result = await db.Clients.update_one(
        {"client_id": data.client_id},
        {"$set": update_fields}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Client not updated.")
    return {"message": "Client updated successfully."}


# ============= Add new client documents =================
async def add_client_documents(
    doc_name: str = Form(...),
    doc_type: str = Form(...),
    client_id: str = Form(...),
    file: UploadFile = File(...)
):
    """Add documents to client"""
    if not client_id:
        raise HTTPException(status_code=400, detail="Client ID is required.")
    
    client = await db.Clients.find_one({"client_id": client_id})
    if not client:
        raise HTTPException(status_code=404, detail="Client not found.")
    
    if not doc_name or not doc_type:
        raise HTTPException(status_code=400, detail="Document name and type are required.")
    
    for c in client.get("documents", []):
        if c.get("doc_name").lower() == doc_name.lower():
            raise HTTPException(
                status_code=409,
                detail=f"Document '{doc_name}' of type '{doc_type}' already exists for this client.",
                headers={"X-Frontend-Message": f"Document '{doc_name}' already exists."}
            )

    existing_documents = client.get("documents", [])
    if not existing_documents:
        random_id = f"CDOC{random.randint(1000, 9999)}"
    else:
        existing_ids = [doc["id"] for doc in existing_documents if "id" in doc]
        while True:
            random_id = f"CDOC{random.randint(1000, 9999)}"
            if random_id not in existing_ids:
                break

    try:
        doc_link = await upload_file_to_firebase(file, folder=f"PMT/clients/{client['brand_name']}/documents")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

    document = ClientDocuments(
        id=random_id,
        doc_name=doc_name,
        doc_type=doc_type,
        doc_url=doc_link,
        uploaded_at=datetime.now(timezone.utc)
    ).dict()
    
    result = await db.Clients.update_one(
        {"client_id": client_id},
        {"$addToSet": {"documents": document}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Document not added to the client.")

    return {"message": f"Document '{doc_name}' added to client {client_id}."}


# ============= Add client notes =================
async def add_client_note(data: dict):
    """Add note to client"""
    if not data.get("client_id"):
        raise HTTPException(status_code=400, detail="Client ID is required.")
    
    if not data.get("note"):
        raise HTTPException(status_code=400, detail="Note content is required.")

    client = await db.Clients.find_one({"client_id": data.get("client_id")})
    if not client:
        raise HTTPException(status_code=404, detail="Client not found.")

    note_entry = ClientNote(
        note=data.get("note"),
        created_at=datetime.utcnow()
    ).dict()

    result = await db.Clients.update_one(
        {"client_id": data.get("client_id")},
        {"$addToSet": {"notes": note_entry}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=500, detail="Note not added to the client.")

    return {"message": f"Note added to client {data.get('client_id')}."}
