"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
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

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects] = useState(DEMO_PROJECTS);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ padding: "48px 56px", maxWidth: "1200px" }}>
      {/* Header */}
      <div style={{ marginBottom: "56px" }}>
        <div style={{ fontSize: "13px", color: "#9B9189", letterSpacing: "0.02em", marginBottom: "12px" }}>
          {greeting}, {user?.displayName?.split(" ")[0]}
        </div>
        <h1 style={{ fontSize: "40px", fontWeight: 300, letterSpacing: "-0.03em", color: "#2C2A28", lineHeight: 1.1, marginBottom: "6px" }}>
          Turn client ideas into<br />
          <span style={{ fontStyle: "italic", fontFamily: "DM Serif Display, serif", fontWeight: 400 }}>visual design directions.</span>
        </h1>
        <div style={{ marginTop: "32px" }}>
          <Link
            href="/consultations/new"
            className="atelier-btn-primary"
            style={{ fontSize: "15px", padding: "14px 28px" }}
          >
            <span style={{ fontSize: "18px" }}>+</span>
            Start New Consultation
          </Link>
        </div>
      </div>

      {/* Recent Projects */}
      <div style={{ marginBottom: "56px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <div className="atelier-label">Recent Projects</div>
          </div>
          <Link href="/projects" style={{ fontSize: "13px", color: "#8B7355", textDecoration: "none", letterSpacing: "-0.01em" }}>
            View all →
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {projects.map((project) => {
            const status = STATUS_LABELS[project.status] || STATUS_LABELS.new;
            return (
              <Link
                key={project.id}
                href={`/consultations/new?projectId=${project.id}`}
                style={{ textDecoration: "none" }}
              >
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
                  <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
                    <img
                      src={project.thumbnailUrl}
                      alt={project.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
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

                  {/* Info */}
                  <div style={{ padding: "20px" }}>
                    <div style={{ fontSize: "11px", color: "#9B9189", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "6px" }}>
                      {project.clientName}
                    </div>
                    <div style={{ fontSize: "15px", fontWeight: 600, color: "#2C2A28", letterSpacing: "-0.01em", marginBottom: "4px" }}>
                      {project.name}
                    </div>
                    {project.location && (
                      <div style={{ fontSize: "12px", color: "#9B9189", marginBottom: "12px" }}>{project.location}</div>
                    )}
                    <div style={{ height: "1px", background: "#EDE9E2", marginBottom: "12px" }} />
                    <div style={{ fontSize: "11px", color: "#9B9189" }}>
                      Updated {formatDate(project.updatedAt)}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}

          {/* New project card */}
          <Link href="/consultations/new" style={{ textDecoration: "none" }}>
            <div
              style={{
                border: "2px dashed #D9D4CB",
                borderRadius: "16px",
                height: "280px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                color: "#9B9189",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "#8B7355";
                (e.currentTarget as HTMLDivElement).style.color = "#8B7355";
                (e.currentTarget as HTMLDivElement).style.background = "rgba(139,115,85,0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "#D9D4CB";
                (e.currentTarget as HTMLDivElement).style.color = "#9B9189";
                (e.currentTarget as HTMLDivElement).style.background = "transparent";
              }}
            >
              <div style={{ fontSize: "28px", opacity: 0.5 }}>+</div>
              <div style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "-0.01em" }}>New Consultation</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {[
          { label: "Active Projects", value: "3", sub: "In progress" },
          { label: "This Month", value: "2", sub: "Consultations" },
          { label: "Library Items", value: "8", sub: "Design references" },
          { label: "Concepts", value: "5", sub: "Generated" },
        ].map((stat) => (
          <div key={stat.label} style={{
            background: "white",
            borderRadius: "12px",
            padding: "20px 24px",
            border: "1px solid #EDE9E2",
          }}>
            <div style={{ fontSize: "28px", fontWeight: 300, color: "#2C2A28", letterSpacing: "-0.02em", marginBottom: "4px" }}>
              {stat.value}
            </div>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "#2C2A28", marginBottom: "2px" }}>{stat.label}</div>
            <div style={{ fontSize: "11px", color: "#9B9189" }}>{stat.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
