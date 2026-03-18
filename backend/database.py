from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def save_event_plan(user_query: str, proposal: dict) -> dict:
    data = {
        "user_query": user_query,
        "venue_name": proposal.get("venue_name"),
        "location": proposal.get("location"),
        "estimated_cost_usd": proposal.get("estimated_cost_usd"),
        "capacity": proposal.get("capacity"),
        "why_it_fits": proposal.get("why_it_fits"),
        "amenities": proposal.get("amenities", []),
    }
    response = supabase.table("event_plans").insert(data).execute()
    return response.data[0] if response.data else {}

def get_all_plans() -> list:
    response = (
        supabase.table("event_plans")
        .select("*")
        .order("created_at", desc=True)
        .execute()
    )
    return response.data if response.data else []