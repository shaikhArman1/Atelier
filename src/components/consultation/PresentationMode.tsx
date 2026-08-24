"use client";

import { useState } from "react";
import type { GeneratedConcept, ReferenceItem, PreferenceProfile } from "@/types";

interface PresentationModeProps {
  concept: GeneratedConcept | null;
  references: ReferenceItem[];
  profile: PreferenceProfile | null;
  clientName: string;
  projectName: string;
  onClose: () => void;
}

export default function PresentationMode({
  concept,
  references,
  profile,
  clientName,
  projectName,
  onClose,
}: PresentationModeProps) {
  const [activeTab, setActiveTab] = useState<"concept" | "direction" | "moodboard">("concept");
  const [selectedImage, setSelectedImage] = useState<string | null>(concept?.imageUrl || references[0]?.imageUrl || null);

  return (
    <div className="presentation-mode fade-in" style={{ padding: "40px 60px", display: "flex", flexDirection: "column", minHeight: "100vh", background: "#FAF8F5" }}>
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", borderBottom: "1px solid #EDE9E2", paddingBottom: "20px" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#8B7355", fontWeight: 600, marginBottom: "4px" }}>
            Design Presentation
          </div>
          <h1 style={{ fontSize: "28px", fontWeight: 300, letterSpacing: "-0.02em", color: "#2C2A28" }}>
            {projectName || "Luxury Residence"} <span style={{ color: "#9B9189", fontWeight: 300 }}>· {clientName || "Client"}</span>
          </h1>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: "8px", background: "white", padding: "4px", borderRadius: "100px", border: "1px solid #EDE9E2" }}>
          {[
            { id: "concept", label: "Concept Visualization" },
            { id: "direction", label: "Design Direction" },
            { id: "moodboard", label: "Selected Moodboard" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: "8px 20px",
                borderRadius: "100px",
                border: "none",
                background: activeTab === tab.id ? "#2C2A28" : "transparent",
                color: activeTab === tab.id ? "white" : "#6B6964",
                fontSize: "13px",
                fontWeight: activeTab === tab.id ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="atelier-btn-secondary"
          style={{ fontSize: "13px", padding: "8px 16px" }}
        >
          ✕ Exit Presentation
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* TAB 1: CONCEPT VISUALIZATION */}
        {activeTab === "concept" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
            {concept ? (
              <div style={{ width: "100%", maxWidth: "1100px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    borderRadius: "20px",
                    overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(44,42,40,0.14)",
                    border: "1px solid #EDE9E2",
                    maxHeight: "70vh",
                  }}
                >
                  <img
                    src={selectedImage || concept.imageUrl}
                    alt="Interior Concept Presentation"
                    style={{ width: "100%", height: "100%", maxHeight: "70vh", objectFit: "cover", display: "block" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "20px",
                      left: "20px",
                      background: "rgba(44,42,40,0.85)",
                      backdropFilter: "blur(12px)",
                      borderRadius: "10px",
                      padding: "10px 18px",
                      color: "white",
                      fontSize: "12px",
                      letterSpacing: "0.04em",
                    }}
                  >
                    <span style={{ fontWeight: 600, color: "#C9A96E" }}>Atelier Concept</span> · {concept.room.replace(/_/g, " ").toUpperCase()} {concept.element ? `— ${concept.element}` : ""}
                  </div>
                </div>

                <div style={{ marginTop: "24px", textAlign: "center", maxWidth: "650px" }}>
                  <p style={{ fontSize: "15px", color: "#6B6964", fontStyle: "italic", lineHeight: 1.6 }}>
                    "{concept.prompt.slice(0, 180)}..."
                  </p>
                </div>
              </div>
            ) : (
              <div style={{ padding: "80px 0", textAlign: "center", color: "#9B9189" }}>
                No concept visualization generated yet.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DESIGN DIRECTION */}
        {activeTab === "direction" && (
          <div style={{ maxWidth: "900px", margin: "0 auto", width: "100%" }} className="fade-in">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px", marginBottom: "32px" }}>
              <div className="atelier-card" style={{ padding: "28px" }}>
                <div className="atelier-label">Aesthetic Style</div>
                <div style={{ fontSize: "22px", fontWeight: 300, color: "#2C2A28", textTransform: "capitalize", marginTop: "8px" }}>
                  {profile?.overallStyle.join(" · ") || "Minimal Modern Luxury"}
                </div>
              </div>

              <div className="atelier-card" style={{ padding: "28px" }}>
                <div className="atelier-label">Colour Palette</div>
                <div style={{ fontSize: "22px", fontWeight: 300, color: "#2C2A28", textTransform: "capitalize", marginTop: "8px" }}>
                  {profile?.palette.join(" · ") || "Warm White, Beige, Walnut"}
                </div>
              </div>

              <div className="atelier-card" style={{ padding: "28px" }}>
                <div className="atelier-label">Materiality & Textures</div>
                <div style={{ fontSize: "22px", fontWeight: 300, color: "#2C2A28", marginTop: "8px" }}>
                  {profile?.materials.join(" · ") || "Natural Wood, Fluted Glass, Soft Fabric"}
                </div>
              </div>

              <div className="atelier-card" style={{ padding: "28px" }}>
                <div className="atelier-label">Lighting Ambience</div>
                <div style={{ fontSize: "22px", fontWeight: 300, color: "#2C2A28", marginTop: "8px" }}>
                  {profile?.lighting.join(" · ") || "Warm Ambient & Indirect Cove Lighting"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MOODBOARD GALLERY */}
        {activeTab === "moodboard" && (
          <div style={{ flex: 1 }} className="fade-in">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
              {references.map((ref) => (
                <div
                  key={ref.id}
                  onClick={() => setSelectedImage(ref.imageUrl)}
                  className="img-card"
                  style={{
                    height: "280px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(44,42,40,0.06)",
                    border: "1px solid #EDE9E2",
                  }}
                >
                  <img src={ref.imageUrl} alt={ref.title || "Reference"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
