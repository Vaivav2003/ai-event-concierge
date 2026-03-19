

import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import SearchBar from "./components/SearchBar";
import VenueCard from "./components/VenueCard";
import HistoryPanel from "./components/HistoryPanel";
import LoadingSpinner from "./components/LoadingSpinner";
import { planEvent, getHistory } from "./api/client";

function MeshBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", width: "600px", height: "600px",
        top: "-100px", left: "-100px",
        background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
        animation: "meshMove 20s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", width: "500px", height: "500px",
        bottom: "-80px", right: "-80px",
        background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
        animation: "meshMove2 25s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }} />
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "56px 24px",
      background: "rgba(255,255,255,0.015)",
      border: "1px dashed rgba(255,255,255,0.08)",
      borderRadius: "20px",
      animation: "float 4s ease-in-out infinite",
    }}>
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏛️</div>
      <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.3)" }}>
        Your venue proposal will appear here
      </p>
      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.15)", marginTop: "6px" }}>
        Describe your event above to get started
      </p>
    </div>
  );
}

export default function App() {
  const [result, setResult]             = useState(null);
  const [history, setHistory]           = useState([]);
  const [isPlanning, setIsPlanning]     = useState(false);
  const [thinkingStep, setThinkingStep] = useState(0);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [historyOpen, setHistoryOpen]   = useState(false);

  useEffect(() => { fetchHistory(); }, []);

  useEffect(() => {
    if (!isPlanning) { setThinkingStep(0); return; }
    const timers = [0, 1800, 3600, 5200].map((delay, i) =>
      setTimeout(() => setThinkingStep(i), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [isPlanning]);

  const fetchHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const data = await getHistory();
      setHistory(data.data || []);
    } catch { toast.error("Could not load history"); }
    finally { setIsLoadingHistory(false); }
  };

  const handleSearch = async (query) => {
    try {
      setIsPlanning(true);
      setResult(null);
      const data = await planEvent(query);
      setResult(data.data);
      toast.success("Proposal ready!", {
        style: { background: "#1a1f2e", color: "#e8eaf0", border: "1px solid rgba(99,179,237,0.2)" }
      });
      fetchHistory();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Something went wrong", {
        style: { background: "#1a1f2e", color: "#e8eaf0", border: "1px solid rgba(239,68,68,0.3)" }
      });
    } finally { setIsPlanning(false); }
  };

  return (
    <>
      <Toaster position="top-right" />
      <MeshBackground />

      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh" }}>

        {/* Header */}
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 32px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          position: "sticky", top: 0, zIndex: 10,
          background: "rgba(8,11,20,0.8)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "18px" }}></span>
            <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: "30px", color: "#ffffff" }}>
              VenueAI
            </span>
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginLeft: "6px", letterSpacing: "0.05em" }}>
              by Gemini + LangGraph
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <button
              onClick={() => setHistoryOpen(o => !o)}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "7px 14px",
                background: historyOpen ? "rgba(99,179,237,0.1)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${historyOpen ? "rgba(99,179,237,0.3)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: "999px",
                color: "rgba(255,255,255,0.6)",
                fontSize: "13px", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s",
              }}
            >
              🗂️ History
              <span style={{ background: "rgba(99,179,237,0.2)", color: "#63b3ed", fontSize: "11px", fontWeight: 600, padding: "1px 6px", borderRadius: "999px" }}>
                {history.length}
              </span>
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
              <div style={{ position: "relative", width: "8px", height: "8px" }}>
                <div style={{ position: "absolute", inset: 0, background: "#10b981", borderRadius: "50%", animation: "pulse 2s ease-in-out infinite" }} />
                <div style={{ width: "8px", height: "8px", background: "#10b981", borderRadius: "50%" }} />
              </div>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>API Connected</span>
            </div>
          </div>
        </header>

        {/* Main */}
        <main style={{ maxWidth: "760px", margin: "0 auto", padding: "60px 24px 80px" }}>

          {/* Hero */}
          <div className="fade-up-1" style={{ textAlign: "center", marginBottom: "48px" }}>
            <p style={{ fontSize: "11px", letterSpacing: "0.2em", color: "rgba(99,179,237,0.6)", textTransform: "uppercase", marginBottom: "14px" }}>
              ✦ AI-Powered Planning
            </p>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 400, lineHeight: 1.15, color: "#ffffff", marginBottom: "14px" }}>
              Plan your perfect<br />
              <em style={{ color: "#63b3ed" }}>corporate event</em>
            </h1>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.35)", maxWidth: "440px", margin: "0 auto", lineHeight: 1.7 }}>
              Describe your event in plain language — get an AI-crafted venue proposal in seconds.
            </p>
          </div>

          {/* Search */}
          <SearchBar onSearch={handleSearch} isLoading={isPlanning} />

          {/* Result */}
          <div className="fade-up-3" style={{ marginTop: "32px" }}>
            {isPlanning ? (
              <LoadingSpinner step={thinkingStep} />
            ) : result ? (
              <VenueCard data={result} />
            ) : (
              <EmptyState />
            )}
          </div>
        </main>

        {/* History Panel */}
        <div style={{
          position: "fixed", top: 0, right: 0,
          width: "340px", height: "100vh",
          background: "rgba(8,11,20,0.95)",
          backdropFilter: "blur(30px)",
          borderLeft: "1px solid rgba(255,255,255,0.07)",
          transform: historyOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
          zIndex: 50,
          display: "flex", flexDirection: "column",
          padding: "24px", overflowY: "auto",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>Past Searches</h3>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>{history.length} proposals</p>
            </div>
            <button
              onClick={() => setHistoryOpen(false)}
              style={{
                width: "32px", height: "32px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "50%", color: "rgba(255,255,255,0.5)",
                cursor: "pointer", fontSize: "18px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              ×
            </button>
          </div>
          <HistoryPanel
            history={history}
            onSelect={(item) => { setResult(item); setHistoryOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            isLoading={isLoadingHistory}
          />
        </div>

        {/* Overlay */}
        {historyOpen && (
          <div
            onClick={() => setHistoryOpen(false)}
            style={{ position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
          />
        )}
      </div>
    </>
  );
}