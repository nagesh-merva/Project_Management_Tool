from typing import Optional, List, Dict
from pydantic import BaseModel, HttpUrl, Field
from datetime import datetime
from enum import Enum

class ReportType(str, Enum):
    departmental = "departmental"
    project = "project"
    financial = "financial"
    hr = 'hr'
    client = 'client'
    issue = "issue"
    analytics = "analytics"
    compliance ="compliance"

class ReportCreate(BaseModel):
    report_name: str = Field(...)
    type: ReportType = Field(...)
    description: Optional[str] = Field(None)
    uploaded_by: str = Field(...)
    document_link: Optional[HttpUrl] = Field(None)
    is_open: bool = Field(True)

class Report(ReportCreate):
    report_id: str = Field(...)
    uploaded_on: datetime = Field(default_factory=datetime.utcnow)

class ReportMetrics(BaseModel):
    total_reports: int
    reports_this_month: int
    open_reports: int
    closed_reports: int
    reports_by_type: Dict[ReportType, int] 
