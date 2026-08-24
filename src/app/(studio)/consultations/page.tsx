"use client";

import { useState } from "react";
import Link from "next/link";
import { DEMO_PROJECTS } from "@/lib/demo/demoData";
import { formatDate } from "@/lib/utils";

export default function ConsultationsPage() {
  const [projects] = useState(DEMO_PROJECTS);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  return (
    <div style={{ padding: "48px 56px", maxWidth: "1280px", margin: "0 auto" }}>
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#8B7355", fontWeight: 600, marginBottom: "6px" }}>
            Consultation Sessions
          </div>
          <h1 style={{ fontSize: "36px", fontWeight: 300, letterSpacing: "-0.03em", color: "#2C2A28" }}>
            Client Consultations
          </h1>
          <p style={{ fontSize: "14px", color: "#6B6964", marginTop: "4px" }}>
            Track and conduct visual consultation sessions with real-time AI concept generation.
          </p>
        </div>

        <Link
          href="/consultations/new"
          className="atelier-btn-primary"
          style={{ fontSize: "14px", padding: "12px 24px" }}
        >
          + New Consultation Session
        </Link>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "32px", borderBottom: "1px solid #EDE9E2", paddingBottom: "16px" }}>
        {[
          { id: "all", label: "All Consultations" },
          { id: "active", label: "In Progress" },
          { id: "completed", label: "Completed Briefs" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            style={{
              padding: "8px 16px",
              borderRadius: "100px",
              border: statusFilter === tab.id ? "1px solid #2C2A28" : "1px solid #EDE9E2",
              background: statusFilter === tab.id ? "#2C2A28" : "white",
              color: statusFilter === tab.id ? "white" : "#6B6964",
              fontSize: "13px",
              fontWeight: statusFilter === tab.id ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Consultations Table / Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {projects.map((project) => (
          <div
            key={project.id}
            className="atelier-card"
            style={{ padding: "24px", display: "grid", gridTemplateColumns: "100px 2fr 1fr 1fr 180px", gap: "20px", alignItems: "center" }}
          >
            <div style={{ width: "100px", height: "70px", borderRadius: "8px", overflow: "hidden" }}>
              <img src={project.thumbnailUrl} alt={project.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            <div>
              <div style={{ fontSize: "11px", color: "#8B7355", fontWeight: 600, textTransform: "uppercase", marginBottom: "2px" }}>
                {project.clientName}
              </div>
              <div style={{ fontSize: "16px", fontWeight: 600, color: "#2C2A28" }}>
                {project.name}
              </div>
              <div style={{ fontSize: "12px", color: "#9B9189", marginTop: "2px" }}>
                {project.location || project.propertyType}
              </div>
            </div>

            <div>
              <div className="atelier-label">Status</div>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#8B7355", background: "#F4F0EA", padding: "3px 8px", borderRadius: "4px" }}>
                {project.status.replace(/_/g, " ").toUpperCase()}
              </span>
            </div>

            <div>
              <div className="atelier-label">Last Updated</div>
              <div style={{ fontSize: "13px", color: "#2C2A28" }}>
                {formatDate(project.updatedAt)}
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <Link
                href={`/consultations/${project.id}`}
                className="atelier-btn-secondary"
                style={{ fontSize: "12px", padding: "8px 14px" }}
              >
                View
              </Link>
              <Link
                href={`/consultations/new?projectId=${project.id}`}
                className="atelier-btn-primary"
                style={{ fontSize: "12px", padding: "8px 14px" }}
              >
                Resume →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
