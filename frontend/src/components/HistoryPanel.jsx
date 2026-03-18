const HistoryPanel = ({ history, onSelect, isLoading }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency", currency: "USD", maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ height: "72px", backgroundColor: "#f3f4f6", borderRadius: "10px" }} />
        ))}
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 16px" }}>
        <p style={{ fontSize: "36px", margin: "0 0 8px" }}>🗂️</p>
        <p style={{ color: "#9ca3af", fontSize: "13px", margin: "0 0 4px" }}>No searches yet.</p>
        <p style={{ color: "#d1d5db", fontSize: "12px", margin: 0 }}>Your past proposals will appear here.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {history.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item)}
          style={{
            width: "100%",
            textAlign: "left",
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "10px",
            padding: "12px",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "#93c5fd";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(37,99,235,0.08)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "#e5e7eb";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "13px", fontWeight: "600", color: "#1f2937", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.venue_name}
              </p>
              <p style={{ fontSize: "11px", color: "#9ca3af", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                📍 {item.location}
              </p>
              <p style={{ fontSize: "11px", color: "#d1d5db", margin: 0, fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                "{item.user_query}"
              </p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontSize: "13px", fontWeight: "700", color: "#2563eb", margin: "0 0 4px" }}>
                {formatCurrency(item.estimated_cost_usd)}
              </p>
              <p style={{ fontSize: "11px", color: "#d1d5db", margin: 0 }}>
                {formatDate(item.created_at)}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default HistoryPanel;