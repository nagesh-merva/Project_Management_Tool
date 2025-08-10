from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime, date

class Milestone(BaseModel):
    name: str
    completed: bool = False
    due_date: date
    completion_date: Optional[date] = None

class Risk(BaseModel):
    description: str
    level: Literal["Low", "Medium", "High"]
    mitigation: str

class ProgressEntry(BaseModel):
    date: date
    progress_percentage: float = Field(ge=0, le=100)
    notes: Optional[str] = None
    updated_by: str

class AuditEntry(BaseModel):
    audit_date: date
    auditor: str
    current_progress: float = Field(ge=0, le=100)
    milestones_completed: int
    total_milestones: int
    success_probability: float = Field(ge=0, le=100)
    notes: Optional[str] = None
    recommendations: Optional[str] = None
    risks_identified: List[Risk] = []

class Goal(BaseModel):
    id: str
    name: str
    target_metric: str
    goal_category: Literal["yearly", "6months", "quarterly"]
    current_progress: float = Field(default=0, ge=0, le=100)
    responsible_department: str
    deadline: date
    success_probability: float = Field(default=50, ge=0, le=100)
    audit_period: Literal["weekly", "monthly", "quarterly"]
    milestones: List[Milestone] = []
    risks: List[Risk] = []
    progress_history: List[ProgressEntry] = []
    audit_history: List[AuditEntry] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    created_by: str
    status: Literal["active", "completed", "paused", "cancelled"] = "active"

    class Config:
        allow_population_by_field_name = True

class CreateGoalInput(BaseModel):
    name: str
    target_metric: str
    goal_category: Literal["yearly", "6months", "quarterly"]
    responsible_department: str
    deadline: date
    success_probability: float = Field(default=50, ge=0, le=100)
    audit_period: Literal["weekly", "monthly", "quarterly"]
    milestones: List[Milestone] = []
    risks: List[Risk] = []
    created_by: str

class UpdateGoalInput(BaseModel):
    name: Optional[str] = None
    target_metric: Optional[str] = None
    responsible_department: Optional[str] = None
    deadline: Optional[date] = None
    success_probability: Optional[float] = Field(None, ge=0, le=100)
    audit_period: Optional[Literal["weekly", "monthly", "quarterly"]] = None
    status: Optional[Literal["active", "completed", "paused", "cancelled"]] = None

class AddProgressInput(BaseModel):
    goal_id: str
    progress_percentage: float = Field(ge=0, le=100)
    notes: Optional[str] = None
    updated_by: str

class AddMilestoneInput(BaseModel):
    goal_id: str
    milestone: Milestone

class UpdateMilestoneInput(BaseModel):
    goal_id: str
    milestone_name: str
    completed: bool
    completion_date: Optional[date] = None

class AddAuditInput(BaseModel):
    goal_id: str
    auditor: str
    current_progress: float = Field(ge=0, le=100)
    success_probability: float = Field(ge=0, le=100)
    notes: Optional[str] = None
    recommendations: Optional[str] = None
    risks_identified: List[Risk] = []

class GoalResponse(BaseModel):
    id: str
    name: str
    target_metric: str
    goal_category: str
    current_progress: float
    responsible_department: str
    deadline: date
    success_probability: float
    audit_period: str
    milestones: List[Milestone]
    risks: List[Risk]
    progress_history: List[ProgressEntry]
    audit_history: List[AuditEntry]
    created_at: datetime
    updated_at: datetime
    created_by: str
    status: str

class GoalSummary(BaseModel):
    id: str
    name: str
    goal_category: str
    current_progress: float
    responsible_department: str
    deadline: date
    success_probability: float
    status: str
    milestones_completed: int
    total_milestones: int
