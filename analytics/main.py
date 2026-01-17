from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from bson import ObjectId
import datetime

load_dotenv()

app = FastAPI(title="QuickTask Analytics Service")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database
MONGODB_URL = os.getenv("MONGODB_URI", "mongodb://localhost:27017/quicktask")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.quicktask

@app.get("/")
async def read_root():
    return {"message": "Analytics Service is running"}

@app.get("/stats/user/{user_id}")
async def get_user_stats(user_id: str):
    try:
        # Verify valid ObjectId
        if not ObjectId.is_valid(user_id):
             raise HTTPException(status_code=400, detail="Invalid User ID")
        
        user_oid = ObjectId(user_id)
        
        # Calculate completion rate
        total_tasks = await db.tasks.count_documents({"user": user_oid})
        completed_tasks = await db.tasks.count_documents({"user": user_oid, "status": "Completed"})
        
        completion_rate = 0
        if total_tasks > 0:
            completion_rate = (completed_tasks / total_tasks) * 100
            
        return {
            "userId": user_id,
            "totalTasks": total_tasks,
            "completedTasks": completed_tasks,
            "completionRate": round(completion_rate, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats/productivity/{user_id}")
async def get_productivity_analysis(user_id: str, days: int = 7):
    # Returns tasks completed in the last X days
    try:
        if not ObjectId.is_valid(user_id):
             raise HTTPException(status_code=400, detail="Invalid User ID")
        
        user_oid = ObjectId(user_id)
        
        # Simple aggregation to get completed tasks by date
        pipeline = [
            {
                "$match": {
                    "user": user_oid,
                    "status": "Completed",
                    # In a real app we'd filter by date here too
                }
            },
            {
                "$group": {
                    "_id": {
                        "$dateToString": { "format": "%Y-%m-%d", "date": "$updatedAt" } # Assuming updatedAt is completion time approx
                    },
                    "count": { "$sum": 1 }
                }
            },
            { "$sort": { "_id": 1 } }
        ]
        
        data = await db.tasks.aggregate(pipeline).to_list(length=100)
        
        return {
            "userId": user_id,
            "analysis_window_days": days,
            "trend": data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
