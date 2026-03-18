import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import SearchBar from "./components/SearchBar";
import VenueCard from "./components/VenueCard";
import HistoryPanel from "./components/HistoryPanel";
import LoadingSpinner from "./components/LoadingSpinner";
import { planEvent, getHistory } from "./api/client";

function App() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isPlanning, setIsPlanning] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const data = await getHistory();
      setHistory(data.data || []);
    } catch (err) {
      toast.error("Could not load history");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      setIsPlanning(true);
      setResult(null);
      const data = await planEvent(query);
      setResult(data.data);
      toast.success("Venue proposal ready!");
      fetchHistory();
    } catch (err) {
      toast.error(
        err?.response?.data?.detail || "Something went wrong. Please try again."
      );
    } finally {
      setIsPlanning(false);
    }
  };

  const handleSelectHistory = (item) => {
    setResult(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Toaster position="top-right" />

      {/* Header */}
      <header style={{
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 10,
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", margin: 0 }}>
            🎯 AI Event Concierge
          </h1>
          <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
            Powered by Gemini + LangGraph
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "8px", height: "8px",
            backgroundColor: "#34d399",
            borderRadius: "50%"
          }}></div>
          <span style={{ fontSize: "12px", color: "#6b7280" }}>API Connected</span>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>

          {/* Left Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Hero */}
            <div>
              <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#111827", lineHeight: 1.2, margin: 0 }}>
                Plan your perfect<br />
                <span style={{ color: "#2563eb" }}>corporate event</span>
              </h2>
              <p style={{ color: "#9ca3af", marginTop: "8px", fontSize: "14px" }}>
                Describe your event in plain English and get an AI-generated venue proposal instantly.
              </p>
            </div>

            {/* Search Box */}
            <div style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}>
              <SearchBar onSearch={handleSearch} isLoading={isPlanning} />
            </div>

            {/* Loading */}
            {isPlanning && (
              <div style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
              }}>
                <LoadingSpinner />
              </div>
            )}

            {/* Result */}
            {!isPlanning && result && (
              <VenueCard data={result} />
            )}

            {/* Empty State */}
            {!isPlanning && !result && (
              <div style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                border: "2px dashed #e5e7eb",
                padding: "64px 24px",
                textAlign: "center"
              }}>
                <p style={{ fontSize: "48px", margin: "0 0 12px" }}>🏔️</p>
                <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>
                  Your AI venue proposal will appear here
                </p>
              </div>
            )}
          </div>

          {/* Right Column — History */}
          <div>
            <div style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
              padding: "20px",
              position: "sticky",
              top: "80px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "12px", fontWeight: "700", color: "#374151", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
                  Past Searches
                </h3>
                <span style={{
                  fontSize: "12px",
                  backgroundColor: "#dbeafe",
                  color: "#2563eb",
                  fontWeight: "600",
                  padding: "2px 8px",
                  borderRadius: "999px"
                }}>
                  {history.length}
                </span>
              </div>
              <HistoryPanel
                history={history}
                onSelect={handleSelectHistory}
                isLoading={isLoadingHistory}
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;