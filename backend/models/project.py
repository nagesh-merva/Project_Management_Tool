from pydantic import BaseModel, Field
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
    profile: Optional[str] = None 


class QuickLinks(BaseModel):
    view_pull_project: Optional[str] = None
    code_resource_base: Optional[str] = None
    live_demo: Optional[str] = None


class ClientDetails(BaseModel):
    name: str
    logo: Optional[str] = None
    domain: Optional[str] = None

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
    remark : bool

class Template(BaseModel):
    id: str
    fields : List[TemplateFields]
    template_name: str
    department: str
    phase: str


class CustomLink(BaseModel):
    label: str
    link: Optional[str] = None


# ---------- Restricted Data ----------
class CostBreakdown(BaseModel):
    cost: Optional[float] = 0
    title: Optional[str] = None
    id: Optional[str] = None
    calc_brief: Optional[str] = None
    
class SpenditureAnalysis(BaseModel):
    month: Optional[str] = None
    dept: Optional[str] = None
    cost: Optional[float] = None
    id:Optional[str] = None

class FinancialData(BaseModel):
    total_budget: Optional[float] = 0
    expected_revenue: Optional[float] = 0
    profit_margin: Optional[float] = 0
    cost_breakdown: List[CostBreakdown] = Field(default_factory=list)
    spenditure_analysis: List[SpenditureAnalysis] = Field(default_factory=list)


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
    features: List[Feature] = Field(default_factory=list)
    srs: SRS = Field(default_factory=SRS)
    project_status: List[ProjectPhase] = Field(default_factory=list)
    issues_and_maintenance_reports: List[IssueMaintenanceReport] = Field(default_factory=list)
    hosting_details: List[HostingDetail] = Field(default_factory=list)
    templates: List[Template] = Field(default_factory=list)
    links: List[CustomLink] = Field(default_factory=list)
    quick_links: QuickLinks = Field(default_factory=QuickLinks)
    #financial data
    financial_data: FinancialData = Field(default_factory=FinancialData)
    performance_metrics: PerformanceMetrics = Field(default_factory=PerformanceMetrics)


class AddProjectRequest(BaseModel):
    project_name: str
    descp: str
    start_date: datetime
    deadline: datetime
    team_members: List[str]
    client_details: str
    
class SubPhaseInput(BaseModel):
    subphase: str
    start_date: Optional[str] = None
    closed_date: Optional[str] = None
    remarks: Optional[str] = None

class PhaseInput(BaseModel):
    parent_phase: str
    subphases: List[SubPhaseInput]
    
class ProjectPhaseUpdate(BaseModel):
    project_id: str
    phases: List[PhaseInput]

