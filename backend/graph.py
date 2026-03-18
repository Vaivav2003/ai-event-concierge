from langgraph.graph import StateGraph, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from typing import TypedDict, Optional
from dotenv import load_dotenv
import json
import os

load_dotenv()

# ---------- State ----------
class EventState(TypedDict):
    user_query: str
    parsed_requirements: Optional[dict]
    raw_llm_response: Optional[str]
    venue_proposal: Optional[dict]
    error: Optional[str]

# ---------- LLM ----------
llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash-lite",
    google_api_key=os.getenv("GEMINI_API_KEY"),
    temperature=0.7,
)

# ---------- Node 1: Parse Requirements ----------
def parse_requirements(state: EventState) -> EventState:
    try:
        messages = [
            SystemMessage(content="""You are an event planning assistant.
Extract event requirements from the user query and return ONLY a JSON object with these keys:
{
  "num_people": number,
  "duration_days": number,
  "budget_usd": number,
  "location_preference": string,
  "event_type": string
}
If any value is not mentioned, make a reasonable assumption.
Return ONLY the JSON. No extra text."""),
            HumanMessage(content=state["user_query"])
        ]
        response = llm.invoke(messages)
        print("GEMINI RAW RESPONSE:", response.content) 
        clean = response.content.strip().replace("```json", "").replace("```", "").strip()
        state["parsed_requirements"] = json.loads(clean)
    except Exception as e:
        state["error"] = f"Parse error: {str(e)}"
        state["parsed_requirements"] = {}
    return state

# ---------- Node 2: Suggest Venue ----------
def suggest_venue(state: EventState) -> EventState:
    try:
        req = state.get("parsed_requirements", {})
        prompt = f"""
Event requirements:
- Number of people: {req.get('num_people', 'unknown')}
- Duration: {req.get('duration_days', 'unknown')} days
- Budget: ${req.get('budget_usd', 'unknown')}
- Location preference: {req.get('location_preference', 'flexible')}
- Event type: {req.get('event_type', 'corporate event')}
Original request: {state['user_query']}
"""
        messages = [
            SystemMessage(content="""You are an expert corporate event venue planner.
Suggest ONE perfect venue based on the requirements.
Respond ONLY with a valid JSON object using these exact keys:
{
  "venue_name": string,
  "location": string,
  "estimated_cost_usd": number,
  "capacity": number,
  "why_it_fits": string (2-3 sentences explaining why this venue suits the event),
  "amenities": array of 4-5 strings
}
Return ONLY the JSON. No markdown, no extra text, no explanation."""),
            HumanMessage(content=prompt)
        ]
        response = llm.invoke(messages)
        state["raw_llm_response"] = response.content
    except Exception as e:
        state["error"] = f"Suggest error: {str(e)}"
        state["raw_llm_response"] = ""
    return state

# ---------- Node 3: Format Output ----------
def format_output(state: EventState) -> EventState:
    try:
        raw = state.get("raw_llm_response", "")
        clean = raw.strip().replace("```json", "").replace("```", "").strip()
        proposal = json.loads(clean)

        # Ensure all required fields exist
        required = ["venue_name", "location", "estimated_cost_usd", "capacity", "why_it_fits", "amenities"]
        for field in required:
            if field not in proposal:
                raise ValueError(f"Missing field: {field}")

        state["venue_proposal"] = proposal
    except Exception as e:
        state["error"] = f"Format error: {str(e)}"
        state["venue_proposal"] = {
            "venue_name": "Unable to generate proposal",
            "location": "N/A",
            "estimated_cost_usd": 0,
            "capacity": 0,
            "why_it_fits": "There was an error processing your request. Please try again.",
            "amenities": []
        }
    return state

# ---------- Build Graph ----------
def build_graph():
    graph = StateGraph(EventState)

    graph.add_node("parse_requirements", parse_requirements)
    graph.add_node("suggest_venue", suggest_venue)
    graph.add_node("format_output", format_output)

    graph.set_entry_point("parse_requirements")
    graph.add_edge("parse_requirements", "suggest_venue")
    graph.add_edge("suggest_venue", "format_output")
    graph.add_edge("format_output", END)

    return graph.compile()

# Compiled graph instance
event_graph = build_graph()