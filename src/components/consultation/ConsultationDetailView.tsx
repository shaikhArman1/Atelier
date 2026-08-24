"use client";

import { useState } from "react";
import Link from "next/link";
import { DEMO_PROJECTS, DEMO_PREFERENCE_PROFILE, DEMO_CONCEPTS, DEMO_REFERENCES } from "@/lib/demo/demoData";
import PresentationMode from "@/components/consultation/PresentationMode";
import ConceptVersionHistory from "@/components/concepts/ConceptVersionHistory";
import type { GeneratedConcept } from "@/types";

export default function ConsultationDetailView({ id }: { id: string }) {
  const project = DEMO_PROJECTS.find((p) => p.id === id) || DEMO_PROJECTS[0];
  const profile = DEMO_PREFERENCE_PROFILE;
  const concepts = DEMO_CONCEPTS;

  const [activeConcept, setActiveConcept] = useState<GeneratedConcept | null>(concepts[0] || null);
  const [isPresentationActive, setIsPresentationActive] = useState(false);

  return (
    <div style={{ padding: "48px 56px", maxWidth: "1280px", margin: "0 auto" }}>
      {/* Presentation Mode overlay */}
      {isPresentationActive && (
        <PresentationMode
          concept={activeConcept}
          references={DEMO_REFERENCES}
          profile={profile}
          clientName={project.clientName}
          projectName={project.name}
          onClose={() => setIsPresentationActive(false)}
        />
      )}

      {/* Header & Launch Presentation CTA */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <Link href="/consultations" style={{ fontSize: "13px", color: "#6B6964", textDecoration: "none", marginBottom: "8px", display: "inline-block" }}>
            ← Back to Consultations
          </Link>
          <h1 style={{ fontSize: "32px", fontWeight: 300, color: "#2C2A28", letterSpacing: "-0.02em" }}>
            {project.name} <span style={{ color: "#9B9189" }}>· {project.clientName}</span>
          </h1>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => setIsPresentationActive(true)}
            className="atelier-btn-accent"
            style={{ fontSize: "14px", padding: "12px 24px" }}
          >
            ✦ Launch Client Presentation Mode
          </button>
          <Link
            href={`/consultations/new?projectId=${project.id}`}
            className="atelier-btn-primary"
            style={{ fontSize: "14px", padding: "12px 24px" }}
          >
            Resume Flow →
          </Link>
        </div>
      </div>

      {/* Concept Version History Component */}
      <ConceptVersionHistory
        concepts={concepts}
        activeConcept={activeConcept}
        onSelectConcept={(c) => setActiveConcept(c)}
      />

      {/* Active Concept Display */}
      {activeConcept && (
        <div className="atelier-card" style={{ padding: "32px", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div>
              <div className="atelier-label">Active Concept Visualization</div>
              <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#2C2A28" }}>
                {activeConcept.room.replace(/_/g, " ")} — {activeConcept.element || "Design Concept"}
              </h2>
            </div>
            <div className="demo-badge">Provider: {activeConcept.provider} ({activeConcept.model})</div>
          </div>

          <div style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid #EDE9E2", marginBottom: "20px" }}>
            <img src={activeConcept.imageUrl} alt="Concept Visualization" style={{ width: "100%", maxHeight: "500px", objectFit: "cover" }} />
          </div>

          <div style={{ padding: "16px", background: "#FAF8F5", borderRadius: "10px" }}>
            <div className="atelier-label" style={{ marginBottom: "4px" }}>Generated AI Prompt Context</div>
            <div style={{ fontSize: "13px", color: "#6B6964", fontStyle: "italic", lineHeight: 1.6 }}>
              "{activeConcept.prompt}"
            </div>
          </div>
        </div>
      )}

      {/* Consultation Summary Brief */}
      <div className="atelier-card" style={{ padding: "32px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#2C2A28", marginBottom: "16px" }}>
          Consultation Brief
        </h3>
        <pre style={{ fontFamily: "Manrope, sans-serif", fontSize: "13px", color: "#6B6964", whiteSpace: "pre-wrap", lineHeight: 1.8 }}>
{`CONSULTATION SUMMARY — ${project.name}

CLIENT
${project.clientName}

OVERALL DESIGN DIRECTION
Minimal Modern Luxury with warm accents

PREFERRED PALETTE
Warm White · Beige · Walnut

PREFERRED MATERIALS
Natural Wood · Matte Laminate · Fabric · Natural Stone

LIGHTING DIRECTION
Warm ambient · Indirect cove lighting`}
        </pre>
      </div>
    </div>
  );
}
