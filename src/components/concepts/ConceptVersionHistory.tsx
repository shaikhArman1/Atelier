"use client";

import { useState } from "react";
import type { GeneratedConcept } from "@/types";
import { formatDate } from "@/lib/utils";

interface ConceptVersionHistoryProps {
  concepts: GeneratedConcept[];
  activeConcept: GeneratedConcept | null;
  onSelectConcept: (concept: GeneratedConcept) => void;
  onBranchConcept?: (concept: GeneratedConcept) => void;
}

export default function ConceptVersionHistory({
  concepts,
  activeConcept,
  onSelectConcept,
  onBranchConcept,
}: ConceptVersionHistoryProps) {
  const [compareMode, setCompareMode] = useState(false);
  const [compareConcept, setCompareConcept] = useState<GeneratedConcept | null>(null);

  if (!concepts || concepts.length === 0) return null;

  return (
    <div style={{ background: "white", borderRadius: "16px", border: "1px solid #EDE9E2", padding: "24px", marginBottom: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <div className="atelier-label" style={{ marginBottom: "2px" }}>Iterative Design History</div>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#2C2A28" }}>
            Concept Versions ({concepts.length})
          </h3>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setCompareMode(!compareMode)}
            className="atelier-btn-secondary"
            style={{ fontSize: "12px", padding: "6px 14px" }}
          >
            {compareMode ? "Exit Compare" : "⇄ Compare Versions"}
          </button>
        </div>
      </div>

      {/* Side-by-side Compare View */}
      {compareMode && compareConcept && activeConcept ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#8B7355", textTransform: "uppercase", marginBottom: "8px" }}>
              Active Version (v{activeConcept.profileVersion || 1})
            </div>
            <div style={{ borderRadius: "12px", overflow: "hidden", aspectRatio: "4/3", border: "2px solid #8B7355" }}>
              <img src={activeConcept.imageUrl} alt="Active" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 600, color: "#6B6964", textTransform: "uppercase", marginBottom: "8px" }}>
              Compared Version (v{compareConcept.profileVersion || 1})
            </div>
            <div style={{ borderRadius: "12px", overflow: "hidden", aspectRatio: "4/3", border: "1px solid #EDE9E2" }}>
              <img src={compareConcept.imageUrl} alt="Compared" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
        </div>
      ) : null}

      {/* Version Timeline */}
      <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
        {concepts.map((item, idx) => {
          const isActive = activeConcept?.id === item.id;
          const isCompared = compareConcept?.id === item.id;

          return (
            <div
              key={item.id || idx}
              onClick={() => {
                if (compareMode) {
                  setCompareConcept(item);
                } else {
                  onSelectConcept(item);
                }
              }}
              style={{
                width: "160px",
                flexShrink: 0,
                borderRadius: "12px",
                border: `2px solid ${isActive ? "#2C2A28" : isCompared ? "#8B7355" : "#EDE9E2"}`,
                overflow: "hidden",
                cursor: "pointer",
                background: isActive ? "#F4F0EA" : "white",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ height: "100px", width: "100%", overflow: "hidden", position: "relative" }}>
                <img src={item.imageUrl} alt={`Version ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{
                  position: "absolute", top: "6px", left: "6px",
                  background: "rgba(44,42,40,0.8)", borderRadius: "4px",
                  padding: "2px 6px", fontSize: "10px", color: "white", fontWeight: 600
                }}>
                  v{idx + 1}
                </div>
              </div>
              <div style={{ padding: "10px" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "#2C2A28", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {item.refinementInstruction || "Initial Concept"}
                </div>
                <div style={{ fontSize: "10px", color: "#9B9189" }}>
                  {formatDate(item.createdAt)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
