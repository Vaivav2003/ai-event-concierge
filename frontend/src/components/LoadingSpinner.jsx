// const LoadingSpinner = () => {
//   return (
//     <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", gap: "16px" }}>
//       <div style={{ position: "relative", width: "56px", height: "56px" }}>
//         <div style={{
//           position: "absolute", inset: 0,
//           borderRadius: "50%",
//           border: "4px solid #dbeafe"
//         }}></div>
//         <div style={{
//           position: "absolute", inset: 0,
//           borderRadius: "50%",
//           border: "4px solid #2563eb",
//           borderTopColor: "transparent",
//           animation: "spin 0.8s linear infinite"
//         }}></div>
//       </div>
//       <div style={{ textAlign: "center" }}>
//         <p style={{ fontSize: "16px", fontWeight: "600", color: "#374151", margin: 0 }}>
//           AI is planning your event...
//         </p>
//         <p style={{ fontSize: "13px", color: "#9ca3af", marginTop: "4px" }}>
//           This may take a few seconds
//         </p>
//       </div>
//       <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//     </div>
//   );
// };

// export default LoadingSpinner;



const THINKING_STEPS = [
  { label: "Analyzing your request...",      icon: "🧠" },
  { label: "Searching premium venues...",    icon: "🔍" },
  { label: "Checking budgets & availability...", icon: "💰" },
  { label: "Drafting your proposal...",      icon: "✨" },
];

const LoadingSpinner = ({ step = 0 }) => {
  return (
    <div className="glass-card fade-up" style={{ padding: "28px" }}>
      <div style={{ marginBottom: "20px" }}>
        <p style={{ fontSize: "11px", letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "6px" }}>
          LangGraph Pipeline
        </p>
        <h3 style={{ fontSize: "16px", fontWeight: 500, color: "rgba(255,255,255,0.9)" }}>
          Processing your event request
        </h3>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {THINKING_STEPS.map((s, i) => {
          const state = i < step ? "done" : i === step ? "active" : "waiting";
          return (
            <div key={i} className={`thinking-step ${state}`}>
              <div style={{
                width: "32px", height: "32px",
                borderRadius: "50%",
                background: state === "done"   ? "rgba(16,185,129,0.15)"
                          : state === "active" ? "rgba(99,179,237,0.15)"
                          : "rgba(255,255,255,0.04)",
                border: `1px solid ${
                  state === "done"   ? "rgba(16,185,129,0.3)"
                : state === "active" ? "rgba(99,179,237,0.3)"
                : "rgba(255,255,255,0.08)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", flexShrink: 0,
                animation: state === "active" ? "pulse 1.5s ease-in-out infinite" : "none",
              }}>
                {state === "done" ? "✓" : s.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontSize: "13px",
                  color: state === "active" ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)",
                  fontWeight: state === "active" ? 500 : 400,
                }}>
                  {s.label}
                </p>
                {state === "active" && (
                  <div style={{ marginTop: "6px", height: "2px", background: "rgba(255,255,255,0.06)", borderRadius: "1px", overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      background: "linear-gradient(90deg, #3b82f6, #6366f1)",
                      borderRadius: "1px",
                      animation: "stepFill 2s ease forwards",
                    }} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LoadingSpinner;