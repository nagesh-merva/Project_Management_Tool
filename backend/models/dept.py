from typing import List, Optional
from pydantic import BaseModel, EmailStr
from datetime import date


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


# Employee Performance Metrics
class PerformanceMetrics(BaseModel):
    completed_projects: int
    ratings: float  # Average rating out of 5
    remarks: Optional[str] = None


# Employee Model
class Employee(BaseModel):
    emp_id: Optional[str] = None
    emp_name: str
    emp_dept: str  # This can be dept_id for linking
    role: str
    email: EmailStr
    password: str
    address: str
    contact: str
    joined_on: date
    hired_by: str  # Recruiter/Manager Name
    salary_monthly: float
    bonus: Optional[float] = 0.0
    salary_account: List[SalaryRecord] = []
    performance_metrics: PerformanceMetrics
    status: str = "Active"  # Example: Active, Resigned, On Leave
    leaves_taken: int = 0
    current_projects: Optional[List[str]] = []  # Project IDs
    emergency_contact: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_ifsc: Optional[str] = None

class EmployeeResponse(BaseModel):
    emp_id: str
    emp_name: str
    emp_dept: str
    role: str
    email: EmailStr
    address: str
    contact: str
    joined_on: date
    hired_by: str
    salary_monthly: float
    bonus: Optional[float] = 0.0
    salary_account: List[dict] = []
    performance_metrics: dict
    status: str
    leaves_taken: int
    current_projects: Optional[List[str]] = []


# Get Employees by Department
class EmployeeSummary(BaseModel):
    emp_id: str
    emp_name: str
    role: str
    performance_metrics: PerformanceMetrics
    
class EmployeesByDeptResponse(BaseModel):
    employees: List[EmployeeSummary]
    details: Optional[Department]