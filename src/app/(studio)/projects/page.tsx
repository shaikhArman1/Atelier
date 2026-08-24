"use client";

import { useState } from "react";
import Link from "next/link";
import { DEMO_PROJECTS } from "@/lib/demo/demoData";
import { formatDate } from "@/lib/utils";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "#9B9189" },
  preference_discovery: { label: "Preference Discovery", color: "#8B7355" },
  space_selection: { label: "Space Selection", color: "#8B7355" },
  reference_selection: { label: "Reference Selection", color: "#C9A96E" },
  concept_generation: { label: "Concept Generation", color: "#5B7A5B" },
  refinement: { label: "Refinement", color: "#5B7A5B" },
  summary: { label: "Summary Ready", color: "#2C6E8A" },
  completed: { label: "Completed", color: "#9B9189" },
};

export default function ProjectsPage() {
  const [projects] = useState(DEMO_PROJECTS);
  const [filterType, setFilterType] = useState<string>("all");

  const filteredProjects = projects.filter((p) => {
    if (filterType === "all") return true;
    return p.propertyType === filterType;
  });

  return (
    <div style={{ padding: "48px 56px", maxWidth: "1280px", margin: "0 auto" }}>
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#8B7355", fontWeight: 600, marginBottom: "6px" }}>
            Client Management
          </div>
          <h1 style={{ fontSize: "36px", fontWeight: 300, letterSpacing: "-0.03em", color: "#2C2A28" }}>
            Design Projects
          </h1>
          <p style={{ fontSize: "14px", color: "#6B6964", marginTop: "4px" }}>
            Manage active client consultations, preference profiles, floor plans, and generated concepts.
          </p>
        </div>

        <Link
          href="/consultations/new"
          className="atelier-btn-primary"
          style={{ fontSize: "14px", padding: "12px 24px" }}
        >
          + New Consultation
        </Link>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "32px", borderBottom: "1px solid #EDE9E2", paddingBottom: "16px" }}>
        {[
          { id: "all", label: "All Projects" },
          { id: "apartment", label: "Apartments" },
          { id: "villa", label: "Villas" },
          { id: "office", label: "Offices" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            style={{
              padding: "8px 16px",
              borderRadius: "100px",
              border: filterType === tab.id ? "1px solid #2C2A28" : "1px solid #EDE9E2",
              background: filterType === tab.id ? "#2C2A28" : "white",
              color: filterType === tab.id ? "white" : "#6B6964",
              fontSize: "13px",
              fontWeight: filterType === tab.id ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
        {filteredProjects.map((project) => {
          const status = STATUS_LABELS[project.status] || STATUS_LABELS.new;
          return (
            <Link key={project.id} href={`/projects/${project.id}`} style={{ textDecoration: "none" }}>
              <div
                className="atelier-card"
                style={{
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 48px rgba(44,42,40,0.12)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(44,42,40,0.08)";
                }}
              >
                {/* Image */}
                <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
                  <img
                    src={project.thumbnailUrl}
                    alt={project.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div style={{
                    position: "absolute", bottom: "12px", left: "12px",
                    background: "rgba(250,248,245,0.92)", backdropFilter: "blur(8px)",
                    borderRadius: "6px", padding: "4px 10px",
                    fontSize: "10px", fontWeight: 600, color: status.color,
                    letterSpacing: "0.06em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.6)"
                  }}>
                    {status.label}
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: "24px" }}>
                  <div style={{ fontSize: "11px", color: "#9B9189", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "6px" }}>
                    {project.clientName}
                  </div>
                  <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#2C2A28", marginBottom: "4px" }}>
                    {project.name}
                  </h3>
                  <div style={{ fontSize: "13px", color: "#6B6964", marginBottom: "16px" }}>
                    {project.location || project.propertyType}
                  </div>

                  <div style={{ height: "1px", background: "#EDE9E2", marginBottom: "16px" }} />

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: "12px", color: "#9B9189" }}>
                      Updated {formatDate(project.updatedAt)}
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#8B7355" }}>
                      View Project →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
