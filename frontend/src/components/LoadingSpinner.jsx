const LoadingSpinner = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", gap: "16px" }}>
      <div style={{ position: "relative", width: "56px", height: "56px" }}>
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: "50%",
          border: "4px solid #dbeafe"
        }}></div>
        <div style={{
          position: "absolute", inset: 0,
          borderRadius: "50%",
          border: "4px solid #2563eb",
          borderTopColor: "transparent",
          animation: "spin 0.8s linear infinite"
        }}></div>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: "16px", fontWeight: "600", color: "#374151", margin: 0 }}>
          AI is planning your event...
        </p>
        <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "4px" }}>
          This may take a few seconds
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default LoadingSpinner;