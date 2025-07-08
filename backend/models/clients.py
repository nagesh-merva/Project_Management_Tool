from pydantic import BaseModel, EmailStr, HttpUrl
from typing import Optional, List
from datetime import datetime
from enum import Enum


class ClientType(str, Enum):
    startup = "Startup"
    enterprise = "Enterprise"
    individual = "Individual"
    ngo = "NGO"


class ContactPerson(BaseModel):
    name: str
    designation: Optional[str]
    email: EmailStr
    phone: str
    linkedin: Optional[str]


class ClientEngagement(BaseModel):
    joined_date: datetime
    source: Optional[str]  #  LinkedIn, Referral
    onboarding_notes: Optional[str]
    tags: List[str] = []  #  ["priority", "recurring"]


class ClientDocuments(BaseModel):
    nda_link: Optional[str] = None
    agreement_link: Optional[str] = None
    billing_address: Optional[str] = None
    extra_notes: Optional[str] = None


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
    business_id: Optional[str]

    primary_contact: ContactPerson
    engagement: ClientEngagement
    documents: Optional[ClientDocuments]
    metrics: ClientMetrics

class BasicClientInput(BaseModel):
    name: str
    brand_name: Optional[str]
    logo_url: Optional[str]
    type: str  # Should match the ClientType enum
    industry: Optional[str]
    location: Optional[str]
    website: Optional[str]
    business_id: Optional[str]

    contact_name: str
    contact_email: EmailStr
    contact_phone: str