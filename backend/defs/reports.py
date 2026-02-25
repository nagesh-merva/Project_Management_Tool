import uuid
from datetime import datetime
from typing import List
from fastapi import HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase

from models.reports import Report, ReportCreate, ReportType

db: AsyncIOMotorDatabase = None

def set_db(database: AsyncIOMotorDatabase):
    """Initialize database from main app"""
    global db
    db = database


async def add_report(data: ReportCreate) -> Report:
    """Add new report"""
    try:
        report_doc = {
            "report_id": f"RPT_{uuid.uuid4().hex[:8]}",
            "report_name": data.report_name,
            "type": data.type.value,
            "department": data.department,
            "description": data.description,
            "uploaded_by": data.uploaded_by,
            "document_link": str(data.document_link) if data.document_link else None, 
            "is_open": data.is_open,
            "uploaded_on": datetime.utcnow()
        }

        await db.Reports.insert_one(report_doc)
        return Report(**report_doc)

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating report: {str(e)}")


async def get_all_reports() -> List[Report]:
    """Get all reports"""
    try:
        cursor = db.Reports.find()
        reports_raw = await cursor.to_list(length=None)

        reports = [
            Report(
                report_id=doc["report_id"],
                report_name=doc["report_name"],
                type=ReportType(doc["type"]),
                description=doc.get("description"),
                uploaded_by=doc["uploaded_by"],
                department=doc["department"],
                document_link=doc.get("document_link"),
                is_open=doc["is_open"],
                uploaded_on=doc["uploaded_on"]
            )
            for doc in reports_raw
        ]

        return reports

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching reports: {str(e)}")
