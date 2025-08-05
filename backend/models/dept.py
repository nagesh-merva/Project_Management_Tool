from typing import List, Optional
from pydantic import BaseModel, EmailStr
from datetime import date, datetime


# Salary Transaction Record
class SalaryRecord(BaseModel):
    salary_paid: float
    date: date
    reference_id: str
    working_days: int


# Monthly Revenue/Spenditure Record
class MonthlyStat(BaseModel):
    month: str  # Format: "YYYY-MM"
    amount: float


# Department Model
class Department(BaseModel):
    dept_id: str
    dept_name: str
    no_of_employees: int = 0
    revenue_stats: List[MonthlyStat] = []
    spenditure_stats: List[MonthlyStat] = []
    revenue_to_spend_ratio: Optional[float] = None  # Can be calculated dynamically

# emp documents
class EmpDocuments(BaseModel):
    doc_type: str
    doc_name: str
    doc_url: str
    uploaded_at: Optional[datetime] = None

# Employee Performance Metrics
class EmpPerformanceMetrics(BaseModel):
    completed_projects: int
    ratings: float  # Average rating out of 5
    remarks: Optional[str] = None

class EmpPromotionRecord(BaseModel):
    prev_role: str
    prev_salary: float
    working_as_from : date

# Employee Model
class Employee(BaseModel):
    emp_id: Optional[str] = None
    emp_name: str
    emp_dept: str  # This can be dept_id for linking
    role: str
    email: EmailStr
    profile:Optional[str] = None  
    password: str
    address: str
    contact: str
    joined_on: datetime
    hired_by: str  # Recruiter/Manager Name
    salary_monthly: float
    bonus: Optional[float] = 0.0
    salary_account: List[SalaryRecord] = []
    emp_documents: Optional[List[EmpDocuments]] = []
    performance_metrics: EmpPerformanceMetrics
    status: str = "Active"  # Example: Active, Resigned, On Leave
    leaves_taken: int = 0
    current_projects: Optional[List[str]] = []  # Project IDs
    emergency_contact: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_ifsc: Optional[str] = None
    promotion_record : Optional[List[EmpPromotionRecord]] = []

class EmployeeInput(BaseModel):
    emp_name: str
    emp_dept: str
    role: str
    email: EmailStr
    password: str
    address: str
    contact: str
    joined_on: datetime
    hired_by: str
    salary_monthly: float
    emergency_contact: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_ifsc: Optional[str] = None
    
class EmployeeResponse(BaseModel):
    emp_id: str
    emp_name: str
    emp_dept: str
    role: str
    email: EmailStr
    profile:Optional[str] = None
    address: str
    contact: str
    joined_on: date
    hired_by: str
    salary_monthly: float
    bonus: Optional[float] = 0.0
    salary_account: List[dict] = []
    emp_documents:List[EmpDocuments] =[]
    performance_metrics: dict
    status: str
    leaves_taken: int
    current_projects: Optional[List[object]] = []


# Get Employees by Department
class EmployeeSummary(BaseModel):
    emp_id: str
    emp_name: str
    role: str
    profile: str
    performance_metrics: EmpPerformanceMetrics
    
class EmployeesByDeptResponse(BaseModel):
    employees: List[EmployeeSummary]
    details: Optional[Department]
    
class PromotionInput(BaseModel):
    emp_id: str
    role: str
    salary: float
