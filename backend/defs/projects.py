import random
from datetime import datetime, date
from typing import Optional
from fastapi import HTTPException, UploadFile, File, Form, BackgroundTasks
from motor.motor_asyncio import AsyncIOMotorDatabase

from models.project import Project, AddProjectRequest, QuickLinks, SRS, FinancialData, PerformanceMetrics, ProjectPhaseUpdate
from .utils import upload_file_to_firebase

db: AsyncIOMotorDatabase = None

def set_db(database: AsyncIOMotorDatabase):
    """Initialize database from main app"""
    global db
    db = database


# ================= get all projects ====================
async def get_projects(role: str):
    """Get all projects - only for admin role"""
    projects_cursor = db.Projects.find({})
    projects = []
    if role not in ["Admin", "Manager", "Founder", "Co-Founder"]:
        raise HTTPException(status_code=403, detail="You do not have permission to view all projects.")

    async for project in projects_cursor:
        project["_id"] = str(project["_id"])  

        projects.append({
            "project_id": project["project_id"],
            "project_name": project["project_name"],
            "current_phase": project["current_phase"],
            "progress": project["progress"],
            "status": project["status"],
            "descp": project["descp"],
            "start_date": project["start_date"],
            "deadline": project["deadline"],
            "team_members": project["team_members"],
            "quick_links": project["quick_links"]
        })

    return projects


# ================= get projects by emp_id ====================
async def get_projects_byid(emp_id: str):
    """Get projects by employee ID"""
    if not emp_id:
        raise HTTPException(status_code=400, detail="Employee ID is required.")
    projects_cursor = db.Projects.find({
        "team_members.emp_id": emp_id
    })
    projects = []

    async for project in projects_cursor:
        project["_id"] = str(project["_id"])  
        try:
            if project["deadline"] < datetime.now() and project["status"] == "active":
                project["status"] = "delayed"
        except ValueError:
            print("Invalid deadline format:", project["deadline"])
            project["status"] = "unknown"

        projects.append({
            "project_id": project["project_id"],
            "project_name": project["project_name"],
            "current_phase": project["current_phase"],
            "progress": project["progress"],
            "status": project["status"],
            "descp": project["descp"],
            "start_date": project["start_date"],
            "deadline": project["deadline"],
            "team_members": project["team_members"],
            "quick_links": project["quick_links"]
        })

    return projects


# ================= Add new Project ====================
async def add_project(project_data: AddProjectRequest):
    """Add new project"""
    while True:
        random_id = f"PRJ{random.randint(1000, 9999)}"
        existing_project = await db.Projects.find_one({"project_id": random_id})
        if not existing_project:
            break
        
    client_data = await db.Clients.find_one({"client_id": project_data.client_details})
    
    member_objs = []
    for emp_id in project_data.team_members:
        emp = await db.Employees.find_one({"emp_id": emp_id})
        if emp:
            member_objs.append({
                "emp_id": emp["emp_id"],
                "name": emp["emp_name"],
                "role": emp["role"],
                'dept': emp["emp_dept"],
                'profile': emp.get("profile", "")
            })
    client_details = {"client_id": client_data["client_id"], "name": client_data["name"], "logo": client_data["logo_url"], "domain": client_data["industry"]}

    project = Project(
        project_id=random_id,
        project_name=project_data.project_name,
        current_phase="Initiation",
        status='active',
        descp=project_data.descp,
        start_date=project_data.start_date,
        deadline=project_data.deadline,
        progress=0,
        team_members=member_objs,
        quick_links=QuickLinks(),
        client_details=client_details,
        features=[],
        srs=SRS(key_req=[]),
        project_status=[],
        issues_and_maintenance_reports=[],
        hosting_details=[],
        templates=[],
        links=[],
        financial_data=FinancialData(),
        performance_metrics=PerformanceMetrics()
    )

    await db.Clients.update_one(
        {"client_id": project_data.client_details},
        {
            "$inc": {"metrics.total_projects": 1},
            "$set": {"metrics.last_project_date": datetime.utcnow()}
        }
    )
    await db.Projects.insert_one(project.dict())
    
    for emp_id_val in project_data.team_members:
        await db.Employees.update_one(
            {"emp_id": emp_id_val},
            {"$addToSet": {"current_projects": random_id}}
        )
    
    return {"message": "Project added successfully.", "project_id": random_id}


# ================= Get Full single project details ====================
async def get_project(project_id: str):
    """Get full project details"""
    if project_id is None:
        raise HTTPException(status_code=400, detail="Project ID is required.")

    project = await db.Projects.find_one({"project_id": project_id})

    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")
    
    try:
        if project["deadline"] < datetime.now() and project["status"] == "active":
            project["status"] = "delayed"
    except ValueError:
        print("Invalid deadline format:", project["deadline"])
        project["status"] = "unknown"

    project["_id"] = str(project["_id"])
    return project


# ================= Get active project by emp_id ====================
async def get_active_projects(emp_id: str):
    """Get active projects by employee ID"""
    if not emp_id:
        raise HTTPException(status_code=400, detail="Employee ID is required.")

    projects_cursor = db.Projects.find({
        "status": "active",
        "team_members.emp_id": emp_id
    })

    active_projects = []
    async for project in projects_cursor:
        project["_id"] = str(project["_id"])  

        active_projects.append({
            "project_id": project["project_id"],
            "project_name": project["project_name"],
            "current_phase": project["current_phase"],
            "status": project["status"],
            "descp": project["descp"],
            "start_date": project["start_date"],
            "deadline": project["deadline"],
            "team_members": project["team_members"],
            "quick_links": project["quick_links"],
            "progress": project.get("progress", 0)
        })

    return active_projects


# ================= Edit Project Brief details ====================
async def edit_project_brief(data: dict):
    """Edit project brief details"""
    project_id = data.get("project_id")
    if not project_id:
        raise HTTPException(status_code=400, detail="Project ID is required.")
    
    project = await db.Projects.find_one({"project_id": project_id})
    
    if not project:
        raise HTTPException(status_code=400, detail="Project doesnt exist, error finding project!.")

    update_fields = {}
    
    if "descp" in data and data["descp"]:
        update_fields["descp"] = data["descp"]
    
    if "deadline" in data and data["deadline"]:
        try:
            update_fields["deadline"] = datetime.fromisoformat(data["deadline"].replace("Z", "+00:00"))
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format")

    if "status" in data and data["status"]:
        if data["status"] == "completed":
            for emp in project["team_members"]:
                db.Employees.update_one(
                    {"emp_id": emp["emp_id"]},
                    {"$pull": {"current_projects": project_id}}
                )
        update_fields["status"] = data["status"]

    quick_links_updates = {}
    
    if "code_resource_base" in data:
        if data["code_resource_base"]:
            quick_links_updates["quick_links.code_resource_base"] = data["code_resource_base"]
        else:
            quick_links_updates["quick_links.code_resource_base"] = None
    
    if "live_demo" in data:
        if data["live_demo"]:
            quick_links_updates["quick_links.live_demo"] = data["live_demo"]
        else:
            quick_links_updates["quick_links.live_demo"] = None
    
    if quick_links_updates:
        update_fields.update(quick_links_updates)

    if not update_fields:
        raise HTTPException(status_code=400, detail="No valid fields provided to update.")

    set_fields = {k: v for k, v in update_fields.items() if v is not None}
    unset_fields = {k: "" for k, v in update_fields.items() if v is None}
    
    update_operations = {}
    if set_fields:
        update_operations["$set"] = set_fields
    if unset_fields:
        update_operations["$unset"] = unset_fields

    updated = await db.Projects.update_one(
        {"project_id": project_id},
        update_operations
    )

    if updated.modified_count == 0:
        raise HTTPException(status_code=404, detail="Project not found or no changes made.")

    return {"message": "Project brief updated successfully."}


# ================= Add new Team members ====================
async def add_team_member(data: dict):
    """Add team member to project"""
    project_id = data.get("project_id")
    emp_id = data.get("team_members")

    if not project_id or not emp_id:
        raise HTTPException(status_code=400, detail="Both project_id and emp_id are required.")

    emp = await db.Employees.find_one({"emp_id": emp_id})
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found.")
    
    team_member_data = {
        "emp_id": emp["emp_id"],
        "name": emp["emp_name"],
        "role": emp["role"],
        "dept": emp["emp_dept"],
        "profile": emp.get("profile", "")
    }
    
    project = await db.Projects.find_one({"project_id": project_id})
    for member in project.get("team_members", []):
        if member.get("emp_id") == emp_id:
            raise HTTPException(
                status_code=409,
                detail=f"{emp['emp_name']} is already a team member of project {project_id}.",
                headers={"X-Frontend-Message": f"{emp['emp_name']} is already a team member of this project."}
            )

    updated = await db.Projects.update_one(
        {"project_id": project_id},
        {"$addToSet": {"team_members": team_member_data}}
    )
    
    await db.Employees.update_one(
        {"emp_id": emp_id},
        {"$addToSet": {"current_projects": project_id}}
    )

    if updated.modified_count == 0:
        raise HTTPException(status_code=404, detail="Project not found or employee already on the team.")

    return {"message": f"{team_member_data['name']} added to project {project_id}."}


# ================= Add new Feature ====================
async def add_feature(data: dict):
    """Add feature to project"""
    project_id = data.get("project_id")
    if not project_id:
        raise HTTPException(status_code=400, detail="project_id is required.")

    while True:
        random_id = f"FT{random.randint(1000, 9999)}"
        project = await db.Projects.find_one(
            {"project_id": project_id, "features.id": random_id},
            {"_id": 1}
        )
        if not project:
            break

    feature_data = {
        "id": random_id,
        "title": data.get("title"),
        "descp": data.get("descp"),
        "status": "in progress",
        "created_by": data.get("created_by"),
        "verified": False,
        "tasks": []
    }

    updated = await db.Projects.update_one(
        {"project_id": data["project_id"]},
        {"$addToSet": {"features": feature_data}}
    )

    if updated.modified_count == 0:
        raise HTTPException(status_code=404, detail="Project not found or feature not added.")

    return {"message": f"{data['title']} added to project {data['project_id']}."}


# ================= update verification of Feature ====================
async def verify_feature(data: dict):
    """Verify feature in project"""
    project_id = data.get("project_id")
    feature_id = data.get("feature_id")

    if not project_id or not feature_id:
        raise HTTPException(status_code=400, detail="Both project_id and feature_id are required.")

    project = await db.Projects.find_one({"project_id": project_id})

    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    features = project.get("features", [])

    if not isinstance(features, list):
        raise HTTPException(status_code=500, detail="Invalid structure: features must be a list.")

    feature_index = None
    for i, feature in enumerate(features):
        if isinstance(feature, dict) and feature.get("id") == feature_id:
            feature_index = i
            break

    if feature_index is None:
        raise HTTPException(status_code=404, detail="Feature not found in the project.")

    update_path = f"features.{feature_index}.verified"
    update_result = await db.Projects.update_one(
        {"project_id": project_id},
        {"$set": {update_path: True}}
    )

    if update_result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Feature verification update failed.")

    return {"message": f"Feature {feature_id} marked as verified in project {project_id}."}


# ================= Add new key_req to srs ====================
async def add_key_req(data: dict):
    """Add key requirement to SRS"""
    project_id = data.get("project_id")
    req = data.get("srs_key_req")
    srs_link = data.get("srs_link")

    if not project_id or not req:
        raise HTTPException(status_code=400, detail="Both project_id and requirement are required.")

    query = {"project_id": project_id}
    update_query = {
        "$addToSet": {"srs.key_req": req}
    }

    if srs_link:
        update_query["$set"] = {"srs.srs_doc_link": srs_link}

    updated = await db.Projects.update_one(query, update_query)

    if updated.modified_count == 0:
        raise HTTPException(status_code=404, detail="Project not found or requirement not added.")

    return {"message": f"'{req}' added to project {project_id}."}


# ================= manage quick actions/links ====================
async def manage_quick_links(data: dict):
    """Manage quick links in project"""
    project_id = data.get("project_id")
    link_name = data.get("linkname")
    link_url = data.get("link")

    if not project_id or not link_name or not link_url:
        raise HTTPException(status_code=400, detail="project_id, linkname, and link are required.")
    
    link_exists = await db.Projects.find_one({
        "project_id": project_id,
        "links.label": link_name
    })

    if link_exists:
        updated = await db.Projects.update_one(
            {
                "project_id": project_id,
                "links.label": link_name
            },
            {
                "$set": {"links.$.link": link_url}
            }
        )

        if updated.modified_count == 0:
            raise HTTPException(status_code=400, detail="Link not updated.")
        
        return {"message": f"Link '{link_name}' updated in project {project_id}."}

    else:
        added = await db.Projects.update_one(
            {"project_id": project_id},
            {"$push": {"links": {"label": link_name, "link": link_url}}}
        )

        if added.modified_count == 0:
            raise HTTPException(status_code=404, detail="Project not found or link not added.")

        return {"message": f"New link '{link_name}' added to project {project_id}."}


# ================= manage maintenance reports ====================
async def manage_maintenance_reports(
    project_id: str = Form(...),
    title: str = Form(...),
    descp: str = Form(...),
    type: str = Form(...),
    file: UploadFile = File(...)
):
    """Manage maintenance reports for project"""
    if not project_id or not title or not descp or not type:
        print("hit not included")
        raise HTTPException(status_code=400, detail="project_id, title, and descp are required.")

    if type != "Maintenance" and type != "Issue":
        print("hit type")
        raise HTTPException(status_code=400, detail="Unvalid report type submitted.")
    
    doc_url = await upload_file_to_firebase(file, folder=f"PMT/ProjectReports/{project_id}")

    report_entry = {
        "id": f"MAINT{random.randint(1000, 9999)}",
        "title": title,
        "descp": descp,
        "type": type,
        "issued_date": datetime.utcnow(),
        "doc_link": doc_url 
    }

    updated = await db.Projects.update_one(
        {"project_id": project_id},
        {"$push": {"issues_and_maintenance_reports": report_entry}}
    )

    if updated.modified_count == 0:
        raise HTTPException(status_code=404, detail="Project not found or report not added.")

    return {"message": f"Maintenance report '{title}' added to project {project_id}."}


# ================= manage hosting details ====================
async def manage_hosting_links(data: dict):
    """Manage hosting links for project"""
    project_id = data.get("project_id")
    title = data.get("title")
    link = data.get("link")
    descp = data.get("descp")

    if not project_id or not title or not link or not descp:
        raise HTTPException(status_code=400, detail="project_id, title, descp, and link are required.")
    
    link_exists = await db.Projects.find_one({
        "project_id": project_id,
        "hosting_details.title": title
    })

    if link_exists:
        updated = await db.Projects.update_one(
            {
                "project_id": project_id,
                "hosting_details.title": title
            },
            {
                "$set": {"hosting_details.$.link": link, "hosting_details.$.descp": descp}
            }
        )

        if updated.modified_count == 0:
            raise HTTPException(status_code=400, detail="Link not updated.")
        
        return {"message": f"Quick Action Link '{title}' updated in project {project_id}."}

    else:
        added = await db.Projects.update_one(
            {"project_id": project_id},
            {"$push": {"hosting_details": {"title": title, "link": link, "descp": descp}}}
        )

        if added.modified_count == 0:
            raise HTTPException(status_code=404, detail="Project not found or link not added.")

        return {"message": f"New Quick Action link '{title}' added to project {project_id}."}


# ================= Get all phases ====================
async def get_phases_project(project_id: str):
    """Get all phases of project"""
    if not project_id:
        raise HTTPException(status_code=400, detail="Project ID is required.")
    
    project = await db.Projects.find_one({"project_id": project_id}, {"_id": 0, "project_status": 1})
    
    if not project: 
        raise HTTPException(status_code=404, detail="Project not found.")
    project_phases = project.get("project_status", [])
    
    if not project_phases:
        raise HTTPException(status_code=404, detail="No phases found for this project.")
    
    phases = []
    for Parentphase in project_phases:
        subphases = Parentphase.get("subphases")
        for phase in subphases:
            phases.append(phase.get("subphase") if "subphase" in phase else "")
    return phases


# ================= Add new template ====================
async def add_template(data: dict):
    """Add new template to project"""
    project_id = data.get("project_id")
    template_name = data.get("template_name")
    department = data.get("department")
    phase = data.get("phase")
    fields = data.get("fields")

    print(data)

    if not project_id or not template_name or not department or not phase or not fields:
        raise HTTPException(status_code=400, detail="All fields are required.")

    while True:
        random_id = f"TEMP{random.randint(1000, 9999)}"
        existing_template = await db.Projects.find_one({"project_id": project_id, "templates.id": random_id})
        if not existing_template:
            break

    template_fields = []
    for field in fields:
        while True:
            randomFD_id = f"TEMPFD{random.randint(1000, 9999)}"
            if any(f["id"] == randomFD_id for f in template_fields):
                continue
            existing_field = await db.Projects.find_one({
                "project_id": project_id,
                "templates.fields.id": randomFD_id
            })
            if not existing_field:
                break
        template_fields.append({
            "id": randomFD_id,
            "title": field.get("title"),
            "descp": field.get("descp"),
            "remark": False
        })

    template = {
        "id": random_id,
        "fields": template_fields,
        "template_name": template_name,
        "department": department,
        "phase": phase
    }
    
    await db.Projects.update_one(
        {
            "project_id": project_id,
            "project_status.subphases.subphase": phase
        },
        {
            "$set": {
                "project_status.$[parent].subphases.$[sub].status": "in_progress",
                "project_status.$[parent].subphases.$[sub].start_date": datetime.now()
            }
        },
        array_filters=[
            {"parent.subphases.subphase": phase},
            {"sub.subphase": phase}
        ]
    )

    updated = await db.Projects.update_one(
        {"project_id": project_id},
        {"$push": {"templates": template}}
    )

    if updated.modified_count == 0:
        raise HTTPException(status_code=404, detail="Project not found or template not added.")

    return {"message": f"Template '{template_name}' added to project {project_id}."}


# ================= Update subphase status ====================
async def update_subphase_status_background(project_id: str):
    """Update subphase status based on templates"""
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


# ================= Mark template remarks ====================
async def mark_template_remarks(data: dict, background_tasks: BackgroundTasks):
    """Mark template remarks"""
    project_id = data.get("project_id")
    template_id = data.get("template_id")
    verified_ids = data.get("verified_ids")

    if not project_id or not template_id or not verified_ids:
        raise HTTPException(status_code=400, detail="project_id, template_id, and verified_ids are required.")

    for field_id in verified_ids:
        await db.Projects.update_one(
            {"project_id": project_id, "templates.id": template_id},
            {"$set": {"templates.$[template].fields.$[field].remark": True}},
            array_filters=[
                {"template.id": template_id},
                {"field.id": field_id}
            ]
        )

    project = await db.Projects.find_one({"project_id": project_id})
    template = next((t for t in project.get("templates", []) if t["id"] == template_id), None)
    
    if template and all(field.get("remark") is True for field in template.get("fields", [])):
        await db.Projects.update_one(
            {"project_id": project_id, "templates.id": template_id},
            {"$set": {"templates.$.verified": True}}
        )

    background_tasks.add_task(update_subphase_status_background, project_id)

    return {"message": f"Remark fields updated for template {template_id} in project {project_id}."}


# ================= Manage financial data ====================
async def manage_financial_data(data: dict):
    """Manage financial data for project"""
    project_id = data.get("project_id")
    if not project_id:
        raise HTTPException(status_code=400, detail="project_id is required.")

    project = await db.Projects.find_one({"project_id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    financial_data = project.get("financial_data", {})
    
    print(data)

    total_budget = data.get("total_budget", financial_data.get("total_budget"))
    expected_revenue = data.get("expected_revenue", financial_data.get("expected_revenue"))

    profit_margin = financial_data.get("profit_margin")
    prior_expected_revenue = financial_data.get("expected_revenue", 0)
    if ("total_budget" in data or "expected_revenue" in data) and total_budget and expected_revenue:
        try:
            profit_margin = round(((float(expected_revenue) - float(total_budget)) / float(expected_revenue)) * 100, 2)
        except Exception:
            profit_margin = None

    client_details = project.get("client_details", {})
    client_name = client_details.get("name")
    if client_name:
        client = await db.Clients.find_one({"name": client_name})
        if client:
            metrics = client.get("metrics", {})
            total_billed = metrics.get("total_billed", 0) or 0
            if expected_revenue is not None:
                try:
                    expected_revenue_val = float(expected_revenue)
                    prior_expected_revenue_val = float(prior_expected_revenue) if prior_expected_revenue else 0
                    if not prior_expected_revenue_val or prior_expected_revenue_val == 0:
                        new_total_billed = total_billed + expected_revenue_val
                    elif prior_expected_revenue_val > 100:
                        new_total_billed = total_billed - prior_expected_revenue_val + expected_revenue_val
                    else:
                        new_total_billed = total_billed
                    await db.Clients.update_one(
                        {"_id": client["_id"]},
                        {"$set": {"metrics.total_billed": new_total_billed}}
                    )
                except Exception:
                    pass

    cost_breakdown = financial_data.get("cost_breakdown", [])
    frontend_costs = data.get("cost_breakdown", [])
    updated_cost_breakdown = []
    existing_cost_ids = {c.get("id"): c for c in cost_breakdown if "id" in c}
    for item in frontend_costs:
        if "id" in item and item["id"] in existing_cost_ids:
            updated = existing_cost_ids[item["id"]]
            updated.update(item)
            updated_cost_breakdown.append(updated)
        else:
            if "id" not in item:
                item["id"] = f"COST{random.randint(1000, 9999)}"
            updated_cost_breakdown.append(item)

    spenditure_analysis = financial_data.get("spenditure_analysis", [])
    frontend_spends = data.get("spenditure_analysis", [])
    existing_spend_ids = {s.get("id"): s for s in spenditure_analysis if "id" in s}
    updated_spenditure = []
    for item in frontend_spends:
        found = False
        if "id" in item and item["id"] in existing_spend_ids:
            updated = existing_spend_ids[item["id"]]
            updated.update(item)
            updated_spenditure.append(updated)
            found = True
        else:
            for s in spenditure_analysis:
                if s.get("month") == item.get("month") and s.get("dept") == item.get("dept"):
                    s.update(item)
                    if "id" not in s:
                        s["id"] = f"SPA{random.randint(1000, 9999)}"
                    item["id"] = s["id"]
                    updated_spenditure.append(s)
                    found = True
                    break
        if not found:
            if "id" not in item:
                item["id"] = f"SPA{random.randint(1000, 9999)}"
            updated_spenditure.append(item)

    update_dict = {
        "financial_data.total_budget": float(total_budget) if total_budget is not None else None,
        "financial_data.expected_revenue": float(expected_revenue) if expected_revenue is not None else None,
        "financial_data.profit_margin": float(profit_margin) if profit_margin is not None else None,
        "financial_data.cost_breakdown": updated_cost_breakdown,
        "financial_data.spenditure_analysis": updated_spenditure
    }
    update_dict = {k: v for k, v in update_dict.items() if v is not None}

    result = await db.Projects.update_one(
        {"project_id": project_id},
        {"$set": update_dict}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Financial data not updated.")

    return {"message": "Financial data updated successfully."}


# ================= Add initial phases ====================
async def add_project_phases(data: ProjectPhaseUpdate):
    """Add initial phases to project"""
    project = db.Projects.find_one({"project_id": data.project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    processed_phases = []
    for phase in data.phases:
        processed_subphases = []
        for sub in phase.subphases:
            sub_dict = {
                "subphase": sub.subphase,
                "status": "not_started", 
                "start_date": None,
                "closed_date": None,
                "remarks": sub.remarks or ""
            }
            if sub_dict["start_date"]:
                try:
                    sub_dict["start_date"] = datetime.fromisoformat(sub_dict["start_date"])
                except ValueError:
                    raise HTTPException(status_code=400, detail=f"Invalid date format: {sub_dict['start_date']}")
            processed_subphases.append(sub_dict)

        processed_phases.append({
            "parent_phase": phase.parent_phase,
            "subphases": processed_subphases
        })

    result = await db.Projects.update_one(
        {"project_id": data.project_id},
        {"$set": {"project_status": processed_phases}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Phases data not updated.")
    else:
        return {"message": "Sucessfully added initial phases to project."}


# ================= Infer phase status ====================
def infer_status(start: str, closed: str) -> str:
    """Infer phase status from dates"""
    if start and closed:
        return "completed"
    elif start and not closed:
        return "in_progress"
    else:
        return "not_started"


# ================= Update project phases ====================
async def update_project_phases(data: ProjectPhaseUpdate):
    """Update project phases"""
    project = db.Projects.find_one({"project_id": data.project_id})

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    updated_status = []
    completed = 0
    subphases = 0 
    for phase in data.phases:
        updated_subphases = []
        for sub in phase.subphases:
            subphases += 1
            start_date = datetime.fromisoformat(sub.start_date) if sub.start_date else None
            closed_date = datetime.fromisoformat(sub.closed_date) if sub.closed_date else None

            status = infer_status(start_date, closed_date)
            if status == "completed":
                completed += 1
            elif status == "in_progress":
                completed += 0.5
            updated_subphases.append({
                "subphase": sub.subphase,
                "status": status,
                "start_date": datetime.fromisoformat(sub.start_date) if sub.start_date else None,
                "closed_date": datetime.fromisoformat(sub.closed_date) if sub.closed_date else None,
                "remarks": sub.remarks or ""
            })
        updated_status.append({
            "parent_phase": phase.parent_phase,
            "subphases": updated_subphases
        })
        
    
    progress = ((completed / subphases * 100) if subphases > 0 and completed > 0 else 5)

    result = await db.Projects.update_one(
        {"project_id": data.project_id},
        {"$set": {"project_status": updated_status, "progress": progress}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="No changes were made")

    return {"message": "Project phases updated successfully"}
