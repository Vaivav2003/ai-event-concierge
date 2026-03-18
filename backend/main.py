from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import traceback

from models import EventRequest
from graph import event_graph
from database import save_event_plan, get_all_plans

load_dotenv()

app = FastAPI(title="AI Event Concierge")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all origins for now
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "AI Event Concierge API is running 🚀"}

@app.post("/api/plan")
async def plan_event(request: EventRequest):
    try:
        print(f">>> Received query: {request.query}")

        # Run LangGraph pipeline
        result = event_graph.invoke({
            "user_query": request.query,
            "parsed_requirements": None,
            "raw_llm_response": None,
            "venue_proposal": None,
            "error": None,
        })

        print(f">>> Graph result: {result}")

        error = result.get("error")
        if error:
            print(f">>> Graph error: {error}")

        proposal = result.get("venue_proposal")
        if not proposal or proposal.get("venue_name") == "Unable to generate proposal":
            raise HTTPException(
                status_code=500,
                detail=f"Gemini failed: {error or 'empty response'}"
            )

        # Save to Supabase
        saved = save_event_plan(request.query, proposal)
        print(f">>> Saved to DB: {saved}")

        return {
            "success": True,
            "data": {
                "id": saved.get("id"),
                "user_query": request.query,
                **proposal,
                "created_at": saved.get("created_at"),
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f">>> EXCEPTION: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/history")
def get_history():
    try:
        plans = get_all_plans()
        return {"success": True, "data": plans}
    except Exception as e:
        print(f">>> HISTORY ERROR: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))