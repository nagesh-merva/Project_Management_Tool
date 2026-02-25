from bson import ObjectId
from fastapi import FastAPI, HTTPException, Depends, Body, Response, UploadFile, File, Form
from fastapi.security import OAuth2PasswordRequestForm
from fastapi import BackgroundTasks
from motor.motor_asyncio import AsyncIOMotorClient
from models.reports import Report, ReportCreate, ReportType
from models.dept import (
    Department, EmpPerformanceMetrics, EmployeeInput, EmployeeSummary,
    EmployeeResponse, EmployeesByDeptResponse, EmpDocuments, Employee, PromotionInput
)
from models.updatesAndtask import UpdateTask, AddComment
from models.project import Project, AddProjectRequest, QuickLinks, SRS, FinancialData, PerformanceMetrics, ProjectPhaseUpdate
from models.clients import Client, ClientMetrics, ClientDocuments, ContactPerson, ClientEngagement, BasicClientInput, UpdateClientInput, ClientNote
from models.goals import (
    Goal, CreateGoalInput, UpdateGoalInput, AddProgressInput, AddMilestoneInput,
    UpdateMilestoneInput, AddAuditInput, GoalResponse, GoalSummary, ProgressEntry, AuditEntry, Milestone, Risk
)
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from calendar import monthrange
from pydantic import EmailStr
from jose import JWTError, jwt
from datetime import datetime, timedelta, date, timezone, time
import firebase_admin
from firebase_admin import credentials, storage
import os
import tempfile
from dotenv import load_dotenv
import random
import string
import uuid

# Import all definition modules
from defs import (
    auth, utils, employees, departments, tasks_updates,
    projects, clients, analytics, goals, reports
)

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
client = AsyncIOMotorClient(os.environ.get("MONGODB_URL"))
db = client.ProjectManagementTool

SECRET_KEY = os.environ.get("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 12

FIREBASE_BUCKET_NAME = os.environ.get("FIREBASE_BUCKET_NAME")

# cred = credentials.Certificate("/etc/secrets/firebase-adminsdk.json")
cred = credentials.Certificate("./firebase-adminsdk.json")

firebase_admin.initialize_app(cred, {
    'storageBucket': FIREBASE_BUCKET_NAME
})

bucket = storage.bucket()

# Initialize all defs modules with database and bucket
auth.set_db(db)
utils.set_bucket(bucket)
utils.set_secret_key(SECRET_KEY)
employees.set_db(db)
departments.set_db(db)
tasks_updates.set_db(db)
projects.set_db(db)
clients.set_db(db)
analytics.set_db(db)
goals.set_db(db)
reports.set_db(db)

# ================= Authentication ====================
@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    return await auth.login(form_data)

# ================= Get all Department ====================
@app.get("/all-dept-brief")
async def get_departments():
    return await departments.get_all_dept_brief()


# ================= Get All Employees ====================
@app.get("/all-employees", response_model=List[EmployeeSummary])
async def get_all_employees():
    return await employees.get_all_employees()


# ================= Get all Employees by Department ====================
@app.get("/employees-bydept", response_model=EmployeesByDeptResponse)
async def get_employees_by_department(dept: str):
    return await employees.get_employees_by_department(dept)


# ================= Add Employee to Department ====================
@app.post("/add-employee")
async def add_employee(
    emp_name: str = Form(...),
    emp_dept: str = Form(...),
    role: str = Form(...),
    email: EmailStr = Form(...),
    password: str = Form(...),
    address: str = Form(...),
    contact: str = Form(...),
    joined_on: datetime = Form(...),
    hired_by: str = Form(...),
    salary_monthly: float = Form(...),
    emergency_contact: Optional[str] = Form(None),
    bank_account_number: Optional[str] = Form(None),
    bank_ifsc: Optional[str] = Form(None),
    profile: UploadFile = File(...)
):
    return await employees.add_employee(
        emp_name, emp_dept, role, email, password, address, contact,
        joined_on, hired_by, salary_monthly, emergency_contact,
        bank_account_number, bank_ifsc, profile
    )


# ================= Get Single Employee Details ====================
@app.get("/employee", response_model=EmployeeResponse)
async def get_employee(emp_id: Optional[str] = None):
    return await employees.get_employee(emp_id)


# ================== Update Employee Details =======================
@app.put("/employee/update")
async def update_employee(emp_id: str, data: dict = Body(...)):
    return await employees.update_employee(emp_id, data)


# ================== add Emp Documents =======================
@app.post("/add-emp-documents")
async def add_emp_documents(emp_id: str = Form(...), file: UploadFile = File(...)):
    return await employees.add_emp_documents(emp_id, file)

    return {"message": "Document added successfully.", "doc_url": doc_url}

# ================== Employee Dashboard Metrics =======================
@app.get("/dashboard-metrics")
async def emp_dashboard_metrics(emp_id: str):
    return await employees.get_emp_dashboard_metrics(emp_id)
    
# ================== add Employee promotion =======================
@app.post("/add-emp-promotion")
async def add_emp_promotion(data: PromotionInput):
    return await employees.add_emp_promotion(data)


# ================= Get All Updates ====================
@app.get("/get-updates")
async def get_updates(emp_id: str):
    return await tasks_updates.get_updates(emp_id)

# ================= Add Update ====================
@app.post("/add-update")
async def add_update(update_data: dict):
    return await tasks_updates.add_update(update_data)

# ================= Get Tasks Assigned to Employee ====================
@app.get("/get-tasks")
async def get_tasks(emp_id: str):
    return await tasks_updates.get_tasks(emp_id)


# ================= Add Task ====================
@app.post("/add-task")
async def add_task(task_data: dict):
    return await tasks_updates.add_task(task_data)


# ================= Update Tasks Status ====================
@app.put("/update-task-status")
async def update_task_status(update: UpdateTask):
    return await tasks_updates.update_task_status(update)

# ================= Add Comments to task ====================
@app.put("/add-comment")
async def add_comment(comment:AddComment):
    return await tasks_updates.add_comment(comment)

# ================= get all projects - only for admin role ====================
@app.get("/get-projects")
async def get_projects(role: str):
    return await projects.get_projects(role)

# ================= get projects by emp_id ====================
@app.get("/get-project-empid")
async def get_projects_byid(emp_id:str):
    return await projects.get_projects_byid(emp_id)


# ================= Add new Project ====================
@app.post("/add-project")
async def add_project(project_data: AddProjectRequest):
    return await projects.add_project(project_data)


#================= Get Full single project details ============================
@app.get("/get-project")
async def get_project(project_id: str):
    return await projects.get_project(project_id)

#================= Get active project by emp_id  ============================
@app.get("/get-active-projects")
async def get_active_projects(emp_id: str):
    return await projects.get_active_projects(emp_id)

#================= Edit Project Brief details by project_id  ============================
@app.post("/edit-project-brief")
async def edit_project_brief(data: dict):
    return await projects.edit_project_brief(data)

#================= Add new Team members by project_id  ============================
@app.post("/add-team-member")
async def add_teammember(data: dict):
    return await projects.add_team_member(data)

#================= Add new Feature by project_id  ============================
@app.post("/add-feature")
async def add_feature(data: dict):
    return await projects.add_feature(data)

#================= update verification of Feature  ============================
@app.post("/verify-feature")
async def verify_feature(data: dict):
    return await projects.verify_feature(data)


#================= Add new key_req to srs by project_id  ============================
@app.post("/add-key-req")
async def add_key_req(data: dict):
    return await projects.add_key_req(data)

#================= Add new key_req to srs by project_id  ============================
@app.post("/manage-quick-actions")
async def manage_quick_links(data: dict):
    return await projects.manage_quick_links(data)
    
#================= manage maintenance reports by project_id  ============================
@app.post("/manage-maintenance-reports")
async def manage_maintenance_reports(
    project_id: str = Form(...),
    title: str = Form(...),
    descp: str = Form(...),
    type: str = Form(...),
    file: UploadFile = File(...)
):
    return await projects.manage_maintenance_reports(project_id, title, descp, type, file)

#================= manage hosting details by project_id  ============================
@app.post("/manage-hostings")
async def manage_hosting_links(data: dict):
    return await projects.manage_hosting_links(data)
    
# ================= Get all phases of project development ====================
@app.get("/all-phases")
async def get_phases_project(project_id: str):
    return await projects.get_phases_project(project_id)


#================= Add new template to templates by project_id  ============================
@app.post("/add-new-template")
async def add_template(data: dict):
    return await projects.add_template(data)

#================= fucntion to update subphases status based on templates  ============================
async def update_subphase_status_background(project_id: str):
    try:
        project = await db.Projects.find_one({"project_id": project_id})
        if not project:
            return

        templates = project.get("templates", [])
        project_status = project.get("project_status", [])

        templates_by_phase = {}
        for template in templates:
            phase = template.get("phase")
            if phase:
                if phase not in templates_by_phase:
                    templates_by_phase[phase] = []
                templates_by_phase[phase].append(template)

        for parent_phase in project_status:
            parent_phase_name = parent_phase.get("parent_phase")
            subphases = parent_phase.get("subphases", [])
            
            for subphase in subphases:
                subphase_name = subphase.get("subphase")
                current_status = subphase.get("status")
                
                if current_status == "completed":
                    continue
                
                if subphase_name in templates_by_phase:
                    subphase_templates = templates_by_phase[subphase_name]
                    
                    all_verified = all(template.get("verified", False) for template in subphase_templates)
                    
                    if all_verified and len(subphase_templates) > 0:
                        await db.Projects.update_one(
                            {"project_id": project_id},
                            {
                                "$set": {
                                    f"project_status.$[parent].subphases.$[sub].status": "completed",
                                    f"project_status.$[parent].subphases.$[sub].closed_date": datetime.utcnow()
                                }
                            },
                            array_filters=[
                                {"parent.parent_phase": parent_phase_name},
                                {"sub.subphase": subphase_name}
                            ]
                        )

    except Exception as e:
        print(f"Error updating subphase status: {str(e)}")

#================================ Route to mark the template remarks ==========================
@app.post("/mark-template-remarks")
async def mark_template_remarks(data: dict,background_tasks: BackgroundTasks):
    return await projects.mark_template_remarks(data, background_tasks)

# =============== Manage Financial Data ===================
@app.put("/manage-financial-data")
async def manage_financial_data(data: dict):
    return await projects.manage_financial_data(data)

#=============== Add Initial phase to project development =================
@app.post("/add-initial-phases")
async def add_project_phases(data: ProjectPhaseUpdate):
    return await projects.add_project_phases(data)

#================ update project phase status ============================
@app.post("/update_project_phases")
async def update_project_phases(data: ProjectPhaseUpdate):
    return await projects.update_project_phases(data)

# ============= Get all Clients briefs =================
@app.get("/clients/briefs")
async def get_all_client_briefs():
    return await clients.get_all_client_briefs()

# ============= Get all Clients details =================
@app.get("/clients")
async def get_all_clients():
    return await clients.get_all_clients()


# ============= Get particular Clients details =================
@app.get("/client/alldetails",response_model=Client)
async def get_all_details_client(client_id: str):
    return await clients.get_all_details_client(client_id)

# ============= Add new client =================
@app.post("/clients/add")
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
    return await clients.add_new_client(
        name, brand_name, type, industry, location, website, gst_id, source,
        contact_name, contact_email, contact_phone, contact_designation, file
    )

# ============= Update existing client =================
@app.post("/update-client")
async def update_client(data: UpdateClientInput):
    return await clients.update_client(data)

# ============= Add new client documents =================
@app.post("/add-client-documents")
async def add_client_documents(
    doc_name: str = Form(...),
    doc_type: str = Form(...),
    client_id: str = Form(...),
    file: UploadFile = File(...)
):
    return await clients.add_client_documents(doc_name, doc_type, client_id, file)


# ============= Add client notes =================
@app.post("/add-client-notes")
async def add_client_note(data: dict):
    return await clients.add_client_note(data)

#============================================ ANALYTICS =====================================================================================
#=============== Get OverviewData ===============================
@app.get("/overview-analytics-data")
async def overviewData():
    return await analytics.overview_analytics_data()

#=============== Get Department Performance data ===============================
@app.get("/dept-performance-analytics")
async def dept_performance_analytics():
    return await analytics.dept_performance_analytics()

#=============== Get Employees data ===============================
@app.get("/employee-analytics")
async def get_employee_analytics():
    return await analytics.get_employee_analytics()

#=============== Get Sales data ===============================
@app.get("/analytics-sales-finance")
async def generate_sales_finance_metrics():
    return await analytics.generate_sales_finance_metrics()

@app.get("/analytics-projects-data")
async def get_project_metrics():
    return await analytics.get_project_metrics()


#============================= GOALS ================================
#=================== Create a new goal==============================
@app.post("/goals/", response_model=GoalResponse)
async def create_goal(goal_input: CreateGoalInput):
    return await goals.create_goal(goal_input)


#==========================Get all goals with optional filters==========================
@app.get("/goals/", response_model=List[GoalResponse])
async def get_goals(
    category: Optional[str] = None,
    department: Optional[str] = None,
    status: Optional[str] = None,
    limit: int = 50,
    skip: int = 0
):
    return await goals.get_goals(category, department, status, limit, skip)

#=========================Get dashboard analytics for goals===========================
@app.get("/goals/analytics/dashboard")
async def get_goals_dashboard():
    return await goals.get_goals_dashboard()


#======================Get a specific goal by ID===========================
@app.get("/goals/{goal_id}", response_model=GoalResponse)
async def get_goal_by_id(goal_id: str):
    return await goals.get_goal_by_id(goal_id)

#=======================Update a goal============================
@app.put("/goals/{goal_id}", response_model=GoalResponse)
async def update_goal(goal_id: str, update_input: UpdateGoalInput):
    return await goals.update_goal(goal_id, update_input)

#======================Add progress entry to a goal==============================
@app.post("/goals/progress/")
async def add_progress(progress_input: AddProgressInput):
    return await goals.add_progress(progress_input)

#=======================Add milestone to a goal============================
@app.post("/goals/milestones/")
async def add_milestone(milestone_input: AddMilestoneInput):
    return await goals.add_milestone(milestone_input)

#======================== Update milestone status =============================
@app.put("/goals/milestones/")
async def update_milestone(milestone_update: UpdateMilestoneInput):
    return await goals.update_milestone(milestone_update)


#=====================Add audit entry to a goal==========================
@app.post("/goals/audit/")
async def add_audit_entry(audit_input: AddAuditInput):
    return await goals.add_audit_entry(audit_input)

#====================Delete a goal==============================
@app.delete("/goals/{goal_id}")
async def delete_goal(goal_id: str):
    return await goals.delete_goal(goal_id)

@app.post("/add-report", response_model=Report)
async def add_report(data: ReportCreate):
    return await reports.add_report(data)

@app.get("/all-reports", response_model=List[Report])
async def get_all_reports():
    return await reports.get_all_reports()


@app.head("/health")
async def head_health_status():
    headers = {
        "X-App-Version": "1.0.0",
        "X-Server-Time": datetime.utcnow().isoformat() + "Z"
    }
    return Response(status_code=200, headers=headers)