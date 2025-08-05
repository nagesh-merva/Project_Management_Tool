from pydantic import BaseModel, Field
from typing import List, Optional, Union
from datetime import date, datetime
from enum import Enum

# Enums for consistent data types
class DepartmentType(str, Enum):
    DEVELOPMENT = "Development"
    DESIGN = "Design"
    SALES = "Sales"
    MAINTENANCE = "Maintenance"
    ADMIN = "Admin"

class ProjectStatus(str, Enum):
    COMPLETED = "Completed"
    IN_PROGRESS = "In Progress"
    DELAYED = "Delayed"
    ON_HOLD = "On Hold"
    CANCELLED = "Cancelled"

class PaymentStatus(str, Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    PENDING = "pending"

class RiskLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

# Employee Analytics Models
class DocumentLink(BaseModel):
    name: str = Field(..., description="Document name")
    url: str = Field(..., description="Firebase/MongoDB document URL")
    type: str = Field(..., description="Document type (Resume, Contract, etc.)")

class EmployeeAnalytics(BaseModel):
    id: str = Field(..., description="Employee ID")
    name: str = Field(..., description="Employee full name")
    role: str = Field(..., description="Current job role")
    department: DepartmentType = Field(..., description="Department")
    total_projects: int = Field(..., ge=0, description="Total projects assigned")
    completed_projects: int = Field(..., ge=0, description="Completed projects count")
    performance_score: float = Field(..., ge=0, le=10, description="Average performance score out of 10")
    attendance: float = Field(..., ge=0, le=100, description="Attendance percentage")
    salary_history: List[float] = Field(..., description="Salary history over time")
    last_promotion: date = Field(..., description="Last promotion date")
    leaves_taken: int = Field(..., ge=0, description="Number of leaves taken")
    documents: List[DocumentLink] = Field(default=[], description="Document access links")

# Department Analytics Models
class TopPerformer(BaseModel):
    name: str = Field(..., description="Employee name")
    rating: float = Field(..., ge=0, le=10, description="Performance rating")

class PendingRequest(BaseModel):
    type: str = Field(..., description="Request type (Approvals, Documents, etc.)")
    count: int = Field(..., ge=0, description="Number of pending requests")

class BudgetUsage(BaseModel):
    allocated: float = Field(..., ge=0, description="Budget allocated")
    used: float = Field(..., ge=0, description="Budget used")
    percentage: float = Field(..., ge=0, le=100, description="Usage percentage")

class DepartmentAnalytics(BaseModel):
    name: DepartmentType = Field(..., description="Department name")
    total_employees: int = Field(..., ge=0, description="Total employees in department")
    ongoing_projects: int = Field(..., ge=0, description="Number of ongoing projects")
    performance_score: float = Field(..., ge=0, le=10, description="Average department performance")
    delivery_rate: float = Field(..., ge=0, le=100, description="Project delivery rate percentage")
    budget_usage: BudgetUsage = Field(..., description="Budget allocation and usage")
    top_performers: List[TopPerformer] = Field(..., description="Top 3 performing employees")
    pending_requests: List[PendingRequest] = Field(..., description="Pending requests by type")

# Project Analytics Models
class ProjectAnalytics(BaseModel):
    id: str = Field(..., description="Project ID")
    name: str = Field(..., description="Project name")
    department: DepartmentType = Field(..., description="Assigned department")
    status: ProjectStatus = Field(..., description="Project status")
    progress: float = Field(..., ge=0, le=100, description="Timeline completion percentage")
    team_size: int = Field(..., ge=1, description="Number of team members")
    budget: float = Field(..., ge=0, description="Project budget")
    actual_cost: float = Field(..., ge=0, description="Actual cost incurred")
    client_satisfaction: float = Field(..., ge=0, le=5, description="Client satisfaction score out of 5")
    profitability: float = Field(..., description="Profitability percentage (can be negative)")
    issues: int = Field(..., ge=0, description="Number of issues logged")
    start_date: date = Field(..., description="Project start date")
    due_date: date = Field(..., description="Project due date")
    roadblocks: List[str] = Field(default=[], description="List of current roadblocks")

# Sales & Finance Analytics Models
class TopClient(BaseModel):
    name: str = Field(..., description="Client name")
    region: str = Field(..., description="Client region")
    revenue: float = Field(..., ge=0, description="Revenue from client")
    projects: int = Field(..., ge=0, description="Number of projects")

class SalesByRegion(BaseModel):
    region: str = Field(..., description="Region name")
    sales: float = Field(..., ge=0, description="Sales amount")

class SalesFinanceAnalytics(BaseModel):
    total_deals: int = Field(..., ge=0, description="Total deals closed")
    monthly_revenue: float = Field(..., ge=0, description="Current monthly revenue")
    quarterly_growth: float = Field(..., description="Quarterly growth percentage")
    cost_per_client: float = Field(..., ge=0, description="Cost acquisition per client")
    revenue_trend: List[float] = Field(..., description="Revenue trend over last 6 months")
    top_clients: List[TopClient] = Field(..., description="Top clients by revenue")
    sales_by_region: List[SalesByRegion] = Field(..., description="Sales breakdown by region")
    pending_invoices: int = Field(..., ge=0, description="Number of pending invoices")
    pending_amount: float = Field(..., ge=0, description="Total pending amount")
    pending_clearances: int = Field(..., ge=0, description="Number of pending clearances")

# Goal Tracking Models
class Milestone(BaseModel):
    name: str = Field(..., description="Milestone name")
    completed: bool = Field(..., description="Whether milestone is completed")
    due_date: date = Field(..., description="Milestone due date")

class Risk(BaseModel):
    description: str = Field(..., description="Risk description")
    level: RiskLevel = Field(..., description="Risk level")
    mitigation: str = Field(..., description="Mitigation strategy")

class GoalTracking(BaseModel):
    name: str = Field(..., description="Goal name")
    target_metric: str = Field(..., description="Target metric description")
    current_progress: float = Field(..., ge=0, le=100, description="Current progress percentage")
    responsible_department: Union[DepartmentType, str] = Field(..., description="Responsible department")
    deadline: date = Field(..., description="Goal deadline")
    success_probability: float = Field(..., ge=0, le=100, description="Success probability percentage")
    milestones: List[Milestone] = Field(..., description="Goal milestones")
    risks: List[Risk] = Field(default=[], description="Identified risks")

# Overview Statistics Models
class OverviewStats(BaseModel):
    total_employees: int = Field(..., ge=0, description="Total number of employees")
    active_projects: int = Field(..., ge=0, description="Number of active projects")
    monthly_revenue: float = Field(..., ge=0, description="Monthly revenue")
    avg_performance: float = Field(..., ge=0, le=10, description="Average performance score")

# Complete Analytics Dashboard Response Model
class AnalyticsDashboard(BaseModel):
    overview_stats: OverviewStats = Field(..., description="Overview statistics")
    employees: List[EmployeeAnalytics] = Field(..., description="Employee analytics data")
    departments: List[DepartmentAnalytics] = Field(..., description="Department analytics data")
    projects: List[ProjectAnalytics] = Field(..., description="Project analytics data")
    sales_finance: SalesFinanceAnalytics = Field(..., description="Sales and finance analytics")
    goals: List[GoalTracking] = Field(..., description="Goal tracking data")
    last_updated: datetime = Field(default_factory=datetime.now, description="Last data update timestamp")

# Individual Response Models for API Endpoints
class EmployeeAnalyticsResponse(BaseModel):
    success: bool = Field(default=True)
    data: List[EmployeeAnalytics]
    total_count: int = Field(..., ge=0)

class DepartmentAnalyticsResponse(BaseModel):
    success: bool = Field(default=True)
    data: List[DepartmentAnalytics]
    total_count: int = Field(..., ge=0)

class ProjectAnalyticsResponse(BaseModel):
    success: bool = Field(default=True)
    data: List[ProjectAnalytics]
    total_count: int = Field(..., ge=0)

class SalesFinanceResponse(BaseModel):
    success: bool = Field(default=True)
    data: SalesFinanceAnalytics

class GoalTrackingResponse(BaseModel):
    success: bool = Field(default=True)
    data: List[GoalTracking]
    total_count: int = Field(..., ge=0)

class CompleteAnalyticsResponse(BaseModel):
    success: bool = Field(default=True)
    data: AnalyticsDashboard

# Filter Models for API Queries
class AnalyticsFilters(BaseModel):
    department: Optional[DepartmentType] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    employee_ids: Optional[List[str]] = None
    project_status: Optional[ProjectStatus] = None
    min_performance: Optional[float] = Field(None, ge=0, le=10)
    max_performance: Optional[float] = Field(None, ge=0, le=10)

# Search and Pagination Models
class SearchQuery(BaseModel):
    query: str = Field(..., min_length=1, description="Search query string")
    filters: Optional[AnalyticsFilters] = None

class PaginationParams(BaseModel):
    page: int = Field(1, ge=1, description="Page number")
    limit: int = Field(10, ge=1, le=100, description="Items per page")
    sort_by: Optional[str] = Field(None, description="Field to sort by")
    sort_order: Optional[str] = Field("asc", regex="^(asc|desc)$", description="Sort order")