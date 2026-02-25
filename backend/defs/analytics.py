from datetime import datetime, timedelta, timezone
from calendar import monthrange
from motor.motor_asyncio import AsyncIOMotorDatabase

db: AsyncIOMotorDatabase = None

def set_db(database: AsyncIOMotorDatabase):
    """Initialize database from main app"""
    global db
    db = database


def parse_date_from_db(date_value):
    """
    Parse date from MongoDB format to Python datetime.
    Handles: MongoDB $date dict, ISO strings, datetime objects
    """
    if not date_value:
        return None
    
    try:
        # If it's a MongoDB $date object (dict with $date key)
        if isinstance(date_value, dict) and '$date' in date_value:
            return datetime.fromisoformat(date_value['$date'].replace('Z', '+00:00'))
        
        # If it's a string, parse as ISO format
        if isinstance(date_value, str):
            return datetime.fromisoformat(date_value.replace('Z', '+00:00'))
        
        # If it's already a datetime object
        if isinstance(date_value, datetime):
            return date_value
        
        return None
    except Exception as e:
        print(f"Error parsing date: {e}")
        return None


# =============== Get Overview Data ===============================
async def overview_analytics_data():
    """Get overview analytics data"""
    now = datetime.now(timezone.utc)
    current_month = now.month
    current_year = now.year

    prev_month = current_month - 1 if current_month > 1 else 12
    prev_year = current_year if current_month > 1 else current_year - 1

    employees_cursor = db.Employees.find({"status": "Active"}, {"_id": 0})
    employees = await employees_cursor.to_list(length=None)
    total_employees = len(employees)

    Total_performance = sum(emp.get("performance_metrics", {}).get("ratings", 0) for emp in employees)
    Total_performance = round(Total_performance / total_employees, 2)

    active_projects_cursor = db.Projects.find({"status": "active"}, {"_id": 0})
    active_projects = await active_projects_cursor.to_list(length=None)
    count_active_projects = len(active_projects)

    completed_projects_cursor = db.Projects.find({"status": "completed"}, {"_id": 0})
    completed_projects = await completed_projects_cursor.to_list(length=None)

    current_revenue = 0
    previous_revenue = 0

    for project in completed_projects:
        deadline = project.get("deadline")
        if isinstance(deadline, datetime):
            if deadline.month == current_month and deadline.year == current_year:
                current_revenue += project.get("financial_data", {}).get("expected_revenue", 0)
            elif deadline.month == prev_month and deadline.year == prev_year:
                previous_revenue += project.get("financial_data", {}).get("expected_revenue", 0)

    fresh_metrics = {
        "total_employees": total_employees,
        "active_projects": count_active_projects,
        "monthly_completed_project_revenue": current_revenue,
        "total_emp_performance": Total_performance
    }

    previous_metrics = {
        "monthly_completed_project_revenue": previous_revenue
    }

    analytics_doc = await db.Analytics.find_one({"type": "overview_data"})
    updated_data = {}

    for key, new_value in fresh_metrics.items():
        existing = analytics_doc.get("data", {}).get(key) if analytics_doc else None

        if existing:
            curr_calc_date = existing.get("current_calculated")

            month_diff = 0
            if isinstance(curr_calc_date, datetime):
                month_diff = (now.year - curr_calc_date.year) * 12 + (now.month - curr_calc_date.month)

            if month_diff >= 2:
                updated_data[key] = {
                    "previous_value": previous_metrics.get(key, existing.get("current_value")),
                    "previous_calculated": datetime(prev_year, prev_month, monthrange(prev_year, prev_month)[1]),
                    "current_value": new_value,
                    "current_calculated": now
                }
            else:
                updated_data[key] = {
                    "previous_value": existing.get("previous_value"),
                    "previous_calculated": existing.get("previous_calculated"),
                    "current_value": new_value,
                    "current_calculated": now
                }
        else:
            updated_data[key] = {
                "previous_value": previous_metrics.get(key),
                "previous_calculated": datetime(prev_year, prev_month, monthrange(prev_year, prev_month)[1]),
                "current_value": new_value,
                "current_calculated": now
            }

    await db.Analytics.update_one(
        {"type": "overview_data"},
        {"$set": {"data": updated_data}},
        upsert=True
    )

    return updated_data


# =============== Get Department Performance data ===============================
async def dept_performance_analytics():
    """Get department performance analytics"""
    departments_cursor = db.Departments.find({}, {"_id": 0})
    departments = await departments_cursor.to_list(length=None)

    projects_cursor = db.Projects.find({}, {"_id": 0})
    all_projects = await projects_cursor.to_list(length=None)

    tasks_cursor = db.Tasks.find({}, {"_id": 0})
    all_tasks = await tasks_cursor.to_list(length=None)

    result = []

    for dept in departments:
        dept_id = dept["dept_id"]
        dept_name = dept["dept_name"]

        employees_cursor = db.Employees.find({"emp_dept": dept_id, "status": "Active"}, {"_id": 0})
        employees = await employees_cursor.to_list(length=None)
        total_employees = len(employees)
        
        top_performers_raw = []
        total_Salary_Account = 0

        for emp in employees:
            total_Salary_Account += emp.get("salary_monthly", 0)
            top_performers_raw.append({
                "name": emp["emp_name"],
                "rating": emp.get("performance_metrics", {}).get("ratings", 0)
            })

        top_performers = sorted(top_performers_raw, key=lambda x: x["rating"], reverse=True)[:3]

        dept_projects = [
            proj for proj in all_projects
            if any(member.get("dept") == dept_id for member in proj.get("team_members", []))
        ]
        ongoing_projects = sum(1 for p in dept_projects if p.get("status") == "active")

        budget_used = 0
        for proj in all_projects:
            financial_data = proj.get("financial_data") or {}
            spenditure_analysis = financial_data.get("spenditure_analysis", [])
            for s in spenditure_analysis:
                if s.get("dept") == dept_id:
                    budget_used += int(s.get("cost"))
        
        dept_emp_ids = {emp["emp_id"] for emp in employees}
        dept_tasks = [
            t for t in all_tasks
            if any(member.get("emp_id") in dept_emp_ids for member in t.get("members_assigned", []))
        ][:250]

        completed_tasks = sum(1 for t in dept_tasks if t.get("status") == "done")
        total_tasks = len(dept_tasks)
        delivery_rate = round((completed_tasks / total_tasks) * 100, 2) if total_tasks else 0

        pending_requests = []
        for task in dept_tasks:
            if task.get("status") == "assigned" or task.get("status") == "uncomplete":
                pending_requests.append(task)

        ratings = [emp.get("performance_metrics", {}).get("ratings", 0) for emp in employees]
        performance_score = round(sum(ratings) / len(ratings), 1) if ratings else 0

        result.append({
            "id": dept_id,
            "name": dept_name,
            "totalEmployees": total_employees,
            "ongoingProjects": ongoing_projects,
            "performanceScore": performance_score,
            "deliveryRate": delivery_rate,
            "budgetUsage": budget_used,
            "totalSalaryAccount": total_Salary_Account,
            "topPerformers": top_performers,
            "pendingRequests": pending_requests
        })

    return result


# =============== Get Employees data ===============================
async def get_employee_analytics():
    """Get employee analytics"""
    employees_cursor = db.Employees.find({"status": "Active"}, {"_id": 0})
    employees = await employees_cursor.to_list(length=None)
    
    analytics_data = []

    for emp in employees:
        emp_id = emp.get("emp_id")
        emp_name = emp.get("emp_name")
        role = emp.get("role")
        department = emp.get("emp_dept")
        performance = emp.get("performance_metrics", {})
        salary_account = emp.get("salary_account", [])
        emp_documents = emp.get("emp_documents", [])
        
        promotion_history = []

        for record in emp.get("promotion_record", []):
            working_as_from = parse_date_from_db(record.get("working_as_from"))
            if working_as_from:
                promotion_history.append({
                    "date": working_as_from.strftime("%Y-%m-%d"),
                    "role": record["prev_role"]
                })

        promotion_history.sort(key=lambda x: x["date"])

        analytics_data.append({
            "id": emp_id,
            "name": emp_name,
            "role": role,
            "department": department,
            "totalProjects": len(emp.get("current_projects", [])) + performance.get("completed_projects", 0),
            "completedProjects": performance.get("completed_projects", 0),
            "performanceScore": round((performance.get("ratings", 0) or 0), 2), 
            "attendance": 96,  
            "salaryHistory": [entry["salary_paid"] for entry in salary_account],
            "leavesTaken": emp.get("leaves_taken", 0),
            "documents": [doc["doc_name"] for doc in emp_documents],
            "PromotionHistory": promotion_history
        })

    return analytics_data


# =============== Get Sales/Finance data ===============================
async def generate_sales_finance_metrics():
    """Generate sales and finance metrics"""
    clients = await db.Clients.find({}).to_list(length=None)
    projects = await db.Projects.find({}).to_list(length=None)

    total_revenue = 0
    total_projects = 0
    total_costs = 0
    repeat_clients = 0
    new_clients = 0
    now = datetime.utcnow()

    monthly_revenue_trend = {}
    
    for i in range(6):
        month_date = now - timedelta(days=30 * i)
        month_key = month_date.strftime("%Y-%m")
        monthly_revenue_trend[month_key] = 0

    client_stats = []

    for client in clients:
        metrics = client.get("metrics", {})
        revenue = metrics.get("total_billed", 0)
        project_count = metrics.get("total_projects", 0)
        joined_date = client.get("engagement", {}).get("joined_date")

        total_revenue += revenue
        total_projects += project_count

        if joined_date and (now - joined_date).days <= 90:
            new_clients += 1

        if project_count > 1:
            repeat_clients += 1

        client_stats.append({
            "client_name": client["name"],
            "total_billed": revenue,
            "total_projects": project_count
        })

    avg_project_value = total_revenue / total_projects if total_projects > 0 else 0

    project_completion = 0
    delayed_projects = 0
    total_duration = 0
    roi_per_project = []
    profit_margin_total = 0
    this_month_revenue = 0
    current_month_key = now.strftime("%Y-%m")

    for project in projects:
        status = project.get("status")
        fin = project.get("financial_data") or {}
        deadline = parse_date_from_db(project.get("deadline"))
        
        if status == "completed" and deadline:
            expected_revenue = fin.get("expected_revenue", 0) or 0
            project_month_key = deadline.strftime("%Y-%m")
            
            if project_month_key in monthly_revenue_trend:
                monthly_revenue_trend[project_month_key] += expected_revenue
            
            if project_month_key == current_month_key:
                this_month_revenue += expected_revenue

        if status == "completed":
            project_completion += 1

        if deadline and deadline < now and status != "completed":
            delayed_projects += 1

        start_date = parse_date_from_db(project.get("start_date"))
        if start_date and deadline:
            duration = (deadline - start_date).days
            total_duration += duration

        cost = sum(
            float(c.get("cost", 0) or 0)
            for c in fin.get("spenditure_analysis", [])
        )
        total_costs += cost
        expected_revenue = fin.get("expected_revenue", 0)
        margin = fin.get("profit_margin", 0)

        if cost > 0:
            roi = (expected_revenue - cost) / cost
            roi_per_project.append({
                "project_id": project["project_id"],
                "project_name": project["project_name"],
                "client_name": project["client_details"]["name"], 
                "roi": round(roi, 2),
                "cost": cost
            })

        profit_margin_total += margin

    sorted_months = sorted(monthly_revenue_trend.keys(), reverse=True)[:6]
    monthly_trend_list = [monthly_revenue_trend[month] for month in reversed(sorted_months)]

    completion_rate = (project_completion / len(projects)) * 100 if projects else 0
    avg_duration = total_duration / len(projects) if projects else 0
    avg_profit_margin = profit_margin_total / len(projects) if projects else 0

    return {
        "revenue": {
            "total": total_revenue,
            "total_this_month": this_month_revenue,
            "monthlyTrend": monthly_trend_list, 
            "monthlyTrendDict": monthly_revenue_trend,  
            "avgProjectValue": avg_project_value,
        },
        "finance": {
            "totalCost": total_costs,
            "costToRevenueRatio": round(total_costs / total_revenue, 2) if total_revenue else 0,
            "avgProfitMargin": round(avg_profit_margin, 2)
        },
        "clients": {
            "total": len(clients),
            "repeatClients": repeat_clients,
            "newClientsThisQuarter": new_clients,
            "topClientsByRevenue": sorted(client_stats, key=lambda x: x['total_billed'], reverse=True)[:5]
        },
        "projects": {
            "total": len(projects),
            "completionRate": round(completion_rate, 2),
            "delayedProjects": delayed_projects,
            "avgDurationDays": round(avg_duration, 2),
            "roiPerProject": roi_per_project
        }
    }


# =============== Get Project Metrics ===============================
async def get_project_metrics():
    """Get project metrics"""
    projects_cursor = db.Projects.find()
    projects = await projects_cursor.to_list(length=None)

    processed_projects = []

    for project in projects:
        start = project.get("start_date")
        deadline = project.get("deadline")
        progress = project.get("progress", 0)
        financial = project.get("financial_data") or {}
        spend = financial.get("spenditure_analysis", [])
        team_size = len(project.get("team_members", []))
        project_id = project.get("project_id")

        actual_cost = 0
        for entry in spend:
            try:
                actual_cost += int(entry["cost"])
            except:
                pass

        budget = financial.get("total_budget", 0)
        revenue = financial.get("expected_revenue", 0)
        profitability = None
        if budget:
            profitability = round(((revenue - actual_cost) / budget) * 100, 2)

        issues = project.get("issues_and_maintenance_reports", [])
        issue_count = sum(1 for issue in issues if issue.get("type", "") == "Issue") 

        performanceMetrics = project.get("performance_metrics") or {}
        client_satisfaction = performanceMetrics.get("stakeholder_satisfaction") or 2

        roadblocks = project.get("roadblocks", [])

        status = project.get("status", "unknown")

        start_str = start.isoformat() if start else None
        deadline_str = deadline.isoformat() if deadline else None

        project_obj = {
            "id": project_id,
            "name": project.get("project_name"),
            "current_phase": project.get("current_phase", ""),
            "status": status,
            "progress": progress,
            "teamSize": team_size,
            "budget": budget,
            "actualCost": actual_cost,
            "clientSatisfaction": client_satisfaction,
            "profitability": profitability,
            "issues": issue_count,
            "startDate": start_str,
            "dueDate": deadline_str,
            "roadblocks": roadblocks,
        }

        processed_projects.append(project_obj)

    return {"projectsData": processed_projects}
