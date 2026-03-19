# 🎯 VenueAI

> An AI-powered platform to plan corporate events using natural language. Describe your event, get a structured venue proposal instantly — powered by Google Gemini and LangGraph.

**Live Demo:** [ai-event-concierge-gamma.vercel.app](https://ai-event-concierge-gamma.vercel.app)

---

## ✨ Features

- **Natural Language Input** — Describe your event in plain English
- **AI Venue Proposals** — Get structured suggestions with venue name, location, cost, capacity, and amenities
- **LangGraph Pipeline** — 3-node AI reasoning: Parse → Suggest → Format
- **Thinking UI** — Real-time multi-step progress indicator showing the AI's reasoning
- **Search History** — All proposals saved to database and accessible via side panel
- **Premium Dark UI** — Glassmorphism design with animated mesh gradient background

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Vite |
| Backend | Python FastAPI |
| AI Orchestration | LangGraph |
| LLM | Google Gemini API (`gemini-2.5-flash`) |
| Database | Supabase (PostgreSQL) |
| Frontend Deploy | Vercel |
| Backend Deploy | Railway |

---

## 📁 Project Structure

```
ai-event-concierge/
├── backend/
│   ├── main.py          # FastAPI app with CORS and endpoints
│   ├── graph.py         # LangGraph 3-node pipeline
│   ├── models.py        # Pydantic request/response models
│   ├── database.py      # Supabase client + queries
│   ├── requirements.txt
│   └── Procfile         # Railway deployment config
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── VenueCard.jsx
│   │   │   ├── HistoryPanel.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── api/
│   │   │   └── client.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## 🚀 Local Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- Supabase account
- Google Gemini API key

---

### 1. Clone the repo

```bash
git clone https://github.com/Vaivav2003/ai-event-concierge.git
cd ai-event-concierge
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Mac/Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Fill in your API keys (see Environment Variables below)

# Run the backend
uvicorn main:app --reload --port 8000
```

Backend runs at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env

# Run the frontend
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔑 Environment Variables

### `backend/.env`

```env
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
FRONTEND_URL=http://localhost:5173
```

### `frontend/.env`

```env
VITE_API_URL=http://localhost:8000
```

---

## 🗄 Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE event_plans (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_query         TEXT NOT NULL,
  venue_name         TEXT,
  location           TEXT,
  estimated_cost_usd NUMERIC,
  capacity           INTEGER,
  why_it_fits        TEXT,
  amenities          JSONB DEFAULT '[]',
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE event_plans DISABLE ROW LEVEL SECURITY;
GRANT ALL ON event_plans TO anon;
GRANT ALL ON event_plans TO authenticated;
```

---

## 🧠 LangGraph Pipeline

```
User Query
    │
    ▼
┌─────────────────────┐
│  Node 1: Parse      │  Extract: people, budget, duration, location
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│  Node 2: Suggest    │  Call Gemini API → raw JSON response
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│  Node 3: Format     │  Validate + structure the proposal
└─────────────────────┘
    │
    ▼
Venue Proposal JSON
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Health check |
| `POST` | `/api/plan` | Generate venue proposal |
| `GET` | `/api/history` | Get all past proposals |

### Example Request

```bash
curl -X POST http://localhost:8000/api/plan \
  -H "Content-Type: application/json" \
  -d '{"query": "A 10-person leadership retreat in the mountains for 3 days with a $4000 budget"}'
```

### Example Response

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_query": "A 10-person leadership retreat...",
    "venue_name": "The Mountain Lodge & Retreat",
    "location": "Shimla, Himachal Pradesh, India",
    "estimated_cost_usd": 3800,
    "capacity": 12,
    "why_it_fits": "This venue perfectly suits a leadership retreat...",
    "amenities": ["Conference Room", "WiFi", "Catering", "Outdoor Activities", "Spa"],
    "created_at": "2026-03-19T10:00:00Z"
  }
}
```

---

## 🌐 Deployment

### Backend → Railway

```bash
cd backend
railway login
railway init
railway up
```

Add environment variables in Railway dashboard → Variables tab.

### Frontend → Vercel

```bash
cd frontend
vercel
vercel env add VITE_API_URL production
vercel --prod
```

---

## 📸 Screenshots

> UI features dark mode glassmorphism design with animated background mesh

- **Hero Input** — Large premium textarea with suggestion chips
- **Thinking UI** — LangGraph step-by-step progress indicator
- **Venue Card** — Structured proposal with gradient header
- **History Panel** — Retractable side drawer with past searches

---

## 🙋 Author

**Vaibhav Kumar**
- GitHub: [@Vaivav2003](https://github.com/Vaivav2003)

---

## 📄 License

MIT License — feel free to use and modify.
