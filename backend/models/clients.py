from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum


class ClientType(str, Enum):
    llc = "LLC"
    pvt_ltd = "PVT-LTD"
    partnership = "Partnership"
    sole_proprietorship = "Sole-Proprietorship"
    startup = "Startup"
    enterprise = "Enterprise"
    individual = "Individual"
    ngo = "NGO"


class ContactPerson(BaseModel):
    name: str
    designation: Optional[str]
    email: EmailStr
    phone: int


class ClientEngagement(BaseModel):
    joined_date :datetime
    source: Optional[str]  #  LinkedIn, Referral
    onboarding_notes: Optional[str]
    tags: List[str] = []  #  ["priority", "recurring"]


class ClientDocuments(BaseModel):
    id: Optional[str] = None
    doc_type: str
    doc_name: str
    doc_url: str
    uploaded_at: Optional[datetime] = None

class ClientNote(BaseModel):
    note: str
    created_at: Optional[datetime] = None

class ClientMetrics(BaseModel):
    total_projects: int = 0
    total_billed: float = 0.0
    last_project_date: Optional[datetime] = None
    payment_status: Optional[str] = "active" 


class ClientBrief(BaseModel):
    client_id: str
    name: str
    logo_url: Optional[str]
    domain: Optional[str]

class Client(BaseModel):
    client_id: Optional[str] = None
    name: str
    brand_name: Optional[str]
    logo_url: Optional[str]
    type: ClientType
    industry: Optional[str]
    location: Optional[str]
    website: Optional[str]
    gst_id: Optional[str]
    primary_contact: ContactPerson
    engagement: ClientEngagement
    documents: Optional[List[ClientDocuments]] = []
    metrics: ClientMetrics
    notes: Optional[List[ClientNote]] = []

class BasicClientInput(BaseModel):
    name: str
    brand_name: Optional[str]
    logo_url: Optional[str]
    type: str  # Should match the ClientType enum
    industry: Optional[str]
    location: Optional[str]
    website: Optional[str] = None
    gst_id: Optional[str]
    contact_name: str
    contact_email: EmailStr
    contact_phone: str
    source :str
    
class UpdateClientInput(BaseModel):
    client_id: str
    name: Optional[str] = None
    brand_name: Optional[str] = None
    logo_url: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    gst_id: Optional[str] = None
    contact_name: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    