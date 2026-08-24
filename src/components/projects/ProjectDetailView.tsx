"use client";

import { useState } from "react";
import Link from "next/link";
import { DEMO_PROJECTS, DEMO_PREFERENCE_PROFILE, DEMO_CONCEPTS } from "@/lib/demo/demoData";
import { formatDate } from "@/lib/utils";

export default function ProjectDetailView({ projectId }: { projectId: string }) {
  const project = DEMO_PROJECTS.find((p) => p.id === projectId) || DEMO_PROJECTS[0];
  const profile = DEMO_PREFERENCE_PROFILE;
  const concepts = DEMO_CONCEPTS;

  const [activeTab, setActiveTab] = useState<"overview" | "concepts" | "preferences" | "notes">("overview");

  return (
    <div style={{ padding: "48px 56px", maxWidth: "1280px", margin: "0 auto" }}>
      {/* Back button */}
      <Link href="/projects" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#6B6964", textDecoration: "none", marginBottom: "24px" }}>
        ← Back to Projects
      </Link>

      {/* Project Banner */}
      <div className="atelier-card" style={{ padding: "32px", marginBottom: "32px", display: "grid", gridTemplateColumns: "1fr 300px", gap: "32px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <span style={{ background: "#F4F0EA", color: "#8B7355", padding: "4px 12px", borderRadius: "100px", fontSize: "11px", fontWeight: 600, textTransform: "uppercase" }}>
              {project.propertyType}
            </span>
            <span style={{ fontSize: "12px", color: "#9B9189" }}>
              Updated {formatDate(project.updatedAt)}
            </span>
          </div>

          <h1 style={{ fontSize: "36px", fontWeight: 300, letterSpacing: "-0.03em", color: "#2C2A28", marginBottom: "8px" }}>
            {project.name}
          </h1>

          <div style={{ fontSize: "15px", color: "#6B6964", marginBottom: "20px" }}>
            Client: <strong>{project.clientName}</strong> · {project.location || "Location specified"}
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <Link
              href={`/consultations/new?projectId=${project.id}`}
              className="atelier-btn-primary"
              style={{ fontSize: "13px", padding: "10px 20px" }}
            >
              Resume Consultation
            </Link>
          </div>
        </div>

        <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #EDE9E2", height: "180px" }}>
          <img src={project.thumbnailUrl} alt={project.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "32px", borderBottom: "1px solid #EDE9E2", paddingBottom: "16px" }}>
        {[
          { id: "overview", label: "Project Overview" },
          { id: "concepts", label: `Saved Concepts (${concepts.length})` },
          { id: "preferences", label: "Client Preference Profile" },
          { id: "notes", label: "Consultation Notes" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: "8px 20px",
              borderRadius: "100px",
              border: activeTab === tab.id ? "1px solid #2C2A28" : "1px solid #EDE9E2",
              background: activeTab === tab.id ? "#2C2A28" : "white",
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

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }} className="fade-in">
          <div>
            <div className="atelier-card" style={{ padding: "28px", marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#2C2A28", marginBottom: "16px" }}>
                Consultation Brief Summary
              </h3>
              <p style={{ fontSize: "14px", color: "#6B6964", lineHeight: 1.7, marginBottom: "16px" }}>
                The client prefers a <strong>minimal modern luxury</strong> design direction for their 4 BHK Residence, prioritizing warm neutrals, beige palettes, and walnut wood accents. Soft ambient lighting with cove illumination is preferred over heavy decorative fixtures.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "24px" }}>
                <div style={{ padding: "16px", background: "#FAF8F5", borderRadius: "10px" }}>
                  <div className="atelier-label">Key Preferences</div>
                  <div style={{ fontSize: "13px", color: "#2C2A28", fontWeight: 500 }}>
                    Minimalist headboards, full-height wardrobes, walnut vanity units, indirect LED cove lighting.
                  </div>
                </div>

                <div style={{ padding: "16px", background: "#FAF8F5", borderRadius: "10px" }}>
                  <div className="atelier-label">Elements to Avoid</div>
                  <div style={{ fontSize: "13px", color: "#2C2A28", fontWeight: 500 }}>
                    Heavy decorative wall paneling, dark moody paint tones, industrial raw metal.
                  </div>
                </div>
              </div>
            </div>

            <div className="atelier-card" style={{ padding: "28px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#2C2A28", marginBottom: "16px" }}>
                Latest Concept Visualization
              </h3>
              {concepts[0] ? (
                <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #EDE9E2", position: "relative" }}>
                  <img src={concepts[0].imageUrl} alt="Concept" style={{ width: "100%", maxHeight: "360px", objectFit: "cover" }} />
                  <div style={{ position: "absolute", bottom: "12px", left: "12px", background: "rgba(44,42,40,0.85)", color: "white", padding: "6px 12px", borderRadius: "6px", fontSize: "11px" }}>
                    Master Bedroom · Dressing Area
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div>
            <div className="atelier-card" style={{ padding: "24px", marginBottom: "24px" }}>
              <div className="atelier-label">Client Info</div>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "#2C2A28", marginBottom: "4px" }}>{project.clientName}</div>
              <div style={{ fontSize: "13px", color: "#6B6964", marginBottom: "16px" }}>rahul.sharma@example.com · +91 98765 43210</div>

              <div style={{ height: "1px", background: "#EDE9E2", marginBottom: "16px" }} />

              <div className="atelier-label">Property Details</div>
              <div style={{ fontSize: "13px", color: "#2C2A28", marginBottom: "4px" }}>4 BHK Residence · 3,200 sq.ft</div>
              <div style={{ fontSize: "12px", color: "#9B9189" }}>Banjara Hills, Hyderabad</div>
            </div>

            <div className="atelier-card" style={{ padding: "24px" }}>
              <div className="atelier-label">Consultation Status</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#8B7355", marginBottom: "12px" }}>
                Concept Refinement Stage
              </div>
              <div style={{ fontSize: "12px", color: "#6B6964", lineHeight: 1.5 }}>
                First consultation completed. Initial concept generated and validated with client.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONCEPTS */}
      {activeTab === "concepts" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }} className="fade-in">
          {concepts.map((concept) => (
            <div key={concept.id} className="atelier-card" style={{ overflow: "hidden" }}>
              <div style={{ height: "280px", position: "relative" }}>
                <img src={concept.imageUrl} alt="Concept" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "20px" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#8B7355", textTransform: "uppercase", marginBottom: "4px" }}>
                  {concept.room.replace(/_/g, " ")} {concept.element ? `— ${concept.element}` : ""}
                </div>
                <div style={{ fontSize: "13px", color: "#6B6964", lineHeight: 1.5, marginBottom: "12px" }}>
                  "{concept.prompt}"
                </div>
                <div style={{ fontSize: "11px", color: "#9B9189" }}>
                  Created {formatDate(concept.createdAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: PREFERENCES */}
      {activeTab === "preferences" && (
        <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px" }}>
          <div className="atelier-card" style={{ padding: "28px" }}>
            <div className="atelier-label">Selected Styles</div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
              {profile.overallStyle.map((s) => (
                <span key={s} style={{ background: "#2C2A28", color: "white", padding: "6px 14px", borderRadius: "100px", fontSize: "13px", textTransform: "capitalize" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="atelier-card" style={{ padding: "28px" }}>
            <div className="atelier-label">Colour Palette</div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
              {profile.palette.map((p) => (
                <span key={p} style={{ background: "#F4F0EA", color: "#8B7355", padding: "6px 14px", borderRadius: "100px", fontSize: "13px", textTransform: "capitalize" }}>
                  {p}
                </span>
              ))}
            </div>
          </div>

          <div className="atelier-card" style={{ padding: "28px" }}>
            <div className="atelier-label">Preferred Materials</div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
              {profile.materials.map((m) => (
                <span key={m} style={{ background: "#FAF8F5", border: "1px solid #EDE9E2", color: "#2C2A28", padding: "6px 14px", borderRadius: "100px", fontSize: "13px" }}>
                  {m}
                </span>
              ))}
            </div>
          </div>

          <div className="atelier-card" style={{ padding: "28px" }}>
            <div className="atelier-label">Lighting Character</div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
              {profile.lighting.map((l) => (
                <span key={l} style={{ background: "#FAF8F5", border: "1px solid #EDE9E2", color: "#2C2A28", padding: "6px 14px", borderRadius: "100px", fontSize: "13px" }}>
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: NOTES */}
      {activeTab === "notes" && (
        <div className="atelier-card fade-in" style={{ padding: "28px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#2C2A28", marginBottom: "16px" }}>
            Consultation Notes & Observations
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { type: "Client Preference", note: "Client mentioned they love natural daylight in the dressing area and hate glossy laminate surfaces.", time: "Today 11:30 AM" },
              { type: "Designer Note", note: "Consider adding indirect cove LED strips along the wardrobe upper trim for warm accenting.", time: "Today 11:45 AM" },
              { type: "AI Inference", note: "High confidence preference match for Walnut wood & Warm beige palette (91%).", time: "Today 12:00 PM" },
            ].map((n, i) => (
              <div key={i} style={{ padding: "16px", background: "#FAF8F5", borderRadius: "10px", border: "1px solid #EDE9E2" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "#8B7355", textTransform: "uppercase" }}>{n.type}</span>
                  <span style={{ fontSize: "11px", color: "#9B9189" }}>{n.time}</span>
                </div>
                <div style={{ fontSize: "13px", color: "#2C2A28" }}>{n.note}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
