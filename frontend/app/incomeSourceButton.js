"use client";

export default function IncomeSourceButton({ onSourceSelect, selectedSources }) {
  const sources = ["Malt", "UpWork", "Direct"];

  function handleClick(source) {
    // Appelle la fonction passée par le parent
    onSourceSelect(source);
  }

  return (
    <div>
      {/* Groupe de boutons */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        {sources.map((source) => (
          <button
            key={source}
            onClick={() => handleClick(source)}
            style={{
              padding: "8px 16px",
              backgroundColor: selectedSources.includes(source)
                ? "#b11414"
                : "#f2f2f2",
              color: selectedSources.includes(source) ? "white" : "black",
              border: "1px solid #b11414",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {source}
          </button>
        ))}
      </div>
    </div>
  );
}
