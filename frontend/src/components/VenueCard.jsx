const VenueCard = ({ data }) => {
  if (!data) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "2px solid #dbeafe", boxShadow: "0 4px 12px rgba(37,99,235,0.08)", overflow: "hidden" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1d4ed8, #2563eb)", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
          <div>
            <p style={{ color: "#bfdbfe", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>
              AI Venue Proposal
            </p>
            <h2 style={{ color: "#ffffff", fontSize: "24px", fontWeight: "800", margin: "0 0 4px", lineHeight: 1.2 }}>
              {data.venue_name}
            </h2>
            <p style={{ color: "#bfdbfe", fontSize: "14px", margin: 0 }}>
              📍 {data.location}
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <p style={{ color: "#bfdbfe", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 2px" }}>
              Estimated Cost
            </p>
            <p style={{ color: "#ffffff", fontSize: "26px", fontWeight: "800", margin: "0 0 2px" }}>
              {formatCurrency(data.estimated_cost_usd)}
            </p>
            <p style={{ color: "#bfdbfe", fontSize: "12px", margin: 0 }}>
              Capacity: {data.capacity} people
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Why it fits */}
        <div>
          <h3 style={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>
            Why It Fits
          </h3>
          <p style={{ fontSize: "14px", color: "#374151", lineHeight: "1.7", backgroundColor: "#eff6ff", borderRadius: "10px", padding: "12px 16px", border: "1px solid #dbeafe", margin: 0 }}>
            {data.why_it_fits}
          </p>
        </div>

        {/* Amenities */}
        {data.amenities && data.amenities.length > 0 && (
          <div>
            <h3 style={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>
              Amenities
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {data.amenities.map((amenity, i) => (
                <span key={i} style={{
                  padding: "6px 12px",
                  backgroundColor: "#f3f4f6",
                  color: "#374151",
                  fontSize: "12px",
                  fontWeight: "500",
                  borderRadius: "999px",
                  border: "1px solid #e5e7eb"
                }}>
                  ✓ {amenity}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Original Query */}
        <div>
          <h3 style={{ fontSize: "11px", fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>
            Your Request
          </h3>
          <p style={{ fontSize: "13px", color: "#9ca3af", fontStyle: "italic", margin: 0 }}>
            "{data.user_query}"
          </p>
        </div>

        {/* Timestamp */}
        {data.created_at && (
          <p style={{ fontSize: "12px", color: "#d1d5db", textAlign: "right", borderTop: "1px solid #f3f4f6", paddingTop: "12px", margin: 0 }}>
            Generated on {formatDate(data.created_at)}
          </p>
        )}
      </div>
    </div>
  );
};

export default VenueCard;