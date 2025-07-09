from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
from enum import Enum


# ---------- Enums ----------
class ProjectStatus(str, Enum):
    active = "active"
    completed = "completed"
    issued = "issued"


# ---------- Sub-Classes ----------
class TeamMember(BaseModel):
    emp_id: str
    name: str
    role: str
    dept: str


class QuickLinks(BaseModel):
    view_pull_project: Optional[str] = None
    code_resource_base: Optional[str] = None
    live_demo: Optional[str] = None


class ClientDetails(BaseModel):
    name: str
    logo: Optional[str] = None
    domain: Optional[str] = None

class AssignedMember(BaseModel):
    emp_id: str
    status: str

class Feature(BaseModel):
    id: str
    title: str
    descp: str
    status: str
    created_by: str
    tasks : List[str]
    verified: bool


class SRS(BaseModel):
    key_req: List[str]
    srs_doc_link: Optional[str] = None


class SubPhase(BaseModel):
    subphase: str
    status: str
    start_date: datetime
    closed_date: Optional[datetime] = None
    remarks: Optional[str] = None


class ProjectPhase(BaseModel):
    parent_phase: str
    subphases: List[SubPhase]


class IssueMaintenanceReport(BaseModel):
    id: str
    title: str
    descp: str
    issued_date: datetime
    doc_link: Optional[str] = None


class HostingDetail(BaseModel):
    title: str
    link: Optional[str] = None
    descp: Optional[str] = None

class TemplateFields(BaseModel):
    id : str
    title : str
    descp : str
    remark : str

class Template(BaseModel):
    fields : TemplateFields
    template_name: str
    department: str
    phase: str


class CustomLink(BaseModel):
    label: str
    link: Optional[str] = None


# ---------- Restricted Data ----------
class CostBreakdown(BaseModel):
    cost: float
    title: str
    id: str
    calc_brief: str
    


class FinancialData(BaseModel):
    total_budget: float
    expected_revenue: float
    profit_margin: float
    cost_breakdown: List[CostBreakdown]
    spenditure_analysis: List[Dict[str, str]]  # {month, dept, cost}


class PerformanceMetrics(BaseModel):
    schedule_variance: Optional[str] = None
    cost_variance: Optional[str] = None
    quality: Optional[str] = None
    risk: Optional[str] = None
    stakeholder_satisfaction: Optional[str] = None


# ---------- Main Project Model ----------
class Project(BaseModel):
    project_id: Optional[str] = None
    project_name: str
    current_phase: str
    status: ProjectStatus
    descp: str
    start_date: datetime
    deadline: datetime
    progress: int

    team_members: List[TeamMember]
    quick_links: QuickLinks
    client_details: ClientDetails
    features: List[Feature]
    srs: SRS
    project_status: List[ProjectPhase]
    issues_and_maintenance_reports: List[IssueMaintenanceReport]
    hosting_details: List[HostingDetail]
    templates: List[Template]
    links: List[CustomLink]

    # Restricted Data
    financial_data: Optional[FinancialData] = None
    performance_metrics: Optional[PerformanceMetrics] = None


class AddProjectRequest(BaseModel):
    project_name: str
    descp: str
    start_date: datetime
    deadline: datetime
    team_members: List[str]
    client_details: str