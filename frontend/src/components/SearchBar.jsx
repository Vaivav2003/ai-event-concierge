// import { useState } from "react";

// const SearchBar = ({ onSearch, isLoading }) => {
//   const [query, setQuery] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (query.trim() && !isLoading) {
//       onSearch(query.trim());
//     }
//   };

//   const examples = [
//     "A 10-person leadership retreat in the mountains for 3 days with a $4000 budget",
//     "Team building offsite for 25 people in Goa for 2 days under $8000",
//     "Executive strategy meeting for 8 people in Delhi for 1 day with $2000 budget",
//   ];

//   return (
//     <div style={{ width: "100%" }}>
//       <form onSubmit={handleSubmit}>
//         <div style={{ position: "relative" }}>
//           <textarea
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Describe your event... (e.g. A 10-person leadership retreat in the mountains for 3 days with a $4k budget)"
//             rows={4}
//             disabled={isLoading}
//             style={{
//               width: "100%",
//               padding: "16px 160px 16px 16px",
//               fontSize: "14px",
//               color: "#1f2937",
//               backgroundColor: "#ffffff",
//               border: "2px solid #e5e7eb",
//               borderRadius: "12px",
//               resize: "none",
//               outline: "none",
//               fontFamily: "inherit",
//               lineHeight: "1.6",
//               boxSizing: "border-box",
//               opacity: isLoading ? 0.6 : 1,
//             }}
//           />
//           <button
//             type="submit"
//             disabled={isLoading || !query.trim()}
//             style={{
//               position: "absolute",
//               bottom: "16px",
//               right: "12px",
//               padding: "10px 18px",
//               backgroundColor: isLoading || !query.trim() ? "#93c5fd" : "#2563eb",
//               color: "#ffffff",
//               fontSize: "13px",
//               fontWeight: "600",
//               border: "none",
//               borderRadius: "10px",
//               cursor: isLoading || !query.trim() ? "not-allowed" : "pointer",
//               fontFamily: "inherit",
//             }}
//           >
//             {isLoading ? "Planning..." : "Plan Event →"}
//           </button>
//         </div>
//       </form>

//       {/* Examples */}
//       <div style={{ marginTop: "16px" }}>
//         <p style={{ fontSize: "11px", color: "#9ca3af", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
//           Try an example:
//         </p>
//         <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
//           {examples.map((example, i) => (
//             <button
//               key={i}
//               onClick={() => setQuery(example)}
//               disabled={isLoading}
//               style={{
//                 textAlign: "left",
//                 fontSize: "12px",
//                 color: "#2563eb",
//                 background: "none",
//                 border: "none",
//                 cursor: "pointer",
//                 padding: 0,
//                 fontFamily: "inherit",
//                 opacity: isLoading ? 0.5 : 1,
//               }}
//             >
//               "{example}"
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SearchBar;


import { useState } from "react";

const CHIPS = [
  { icon: "⛰️", label: "Mountain retreat", query: "A 10-person leadership retreat in the mountains for 3 days with a $4000 budget" },
  { icon: "🏙️", label: "City meeting",     query: "Executive strategy meeting for 8 people in Delhi for 1 day with $2000 budget" },
  { icon: "🏖️", label: "Beach offsite",    query: "Team building offsite for 25 people in Goa for 2 days under $8000" },
  { icon: "🌿", label: "Wellness retreat", query: "Wellness and mindfulness retreat for 15 people in Kerala for 4 days with $6000 budget" },
];

const SearchBar = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = () => {
    if (query.trim() && !isLoading) onSearch(query.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  return (
    <div className="glass-card fade-up-2" style={{ padding: "24px", animation: isLoading ? "glow 3s ease-in-out infinite" : "none" }}>
      <div style={{ position: "relative" }}>
        <textarea
          className="textarea-field"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={4}
          placeholder="e.g. A 10-person leadership retreat in the mountains for 3 days with a $4000 budget..."
        />
        <button
          className="plan-btn"
          onClick={handleSubmit}
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? "Planning..." : "Plan Event ✦"}
        </button>
      </div>

      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "10px", textAlign: "right" }}>
        ⌘ + Enter to submit
      </p>

      <div style={{ marginTop: "16px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {CHIPS.map((c, i) => (
          <button
            key={i}
            className="chip"
            disabled={isLoading}
            onClick={() => setQuery(c.query)}
          >
            <span>{c.icon}</span>
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;