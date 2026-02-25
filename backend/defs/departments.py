from motor.motor_asyncio import AsyncIOMotorDatabase

db: AsyncIOMotorDatabase = None

def set_db(database: AsyncIOMotorDatabase):
    """Initialize database from main app"""
    global db
    db = database


async def get_all_dept_brief():
    """Get brief details of all departments"""
    departments = db.Departments.find({})
    depts = []
    async for dept in departments:
        depts.append(
            {
                "depy_id": dept["dept_id"],
                "dept_name": dept["dept_name"],
            }
        )
    return depts
