"use client";

import { useState } from "react";
import type { FloorPlanAnalysis, DetectedRoom } from "@/types";

interface FloorPlanViewerProps {
  analysis: FloorPlanAnalysis;
  onConfirm?: (analysis: FloorPlanAnalysis) => void;
  selectedRoomName?: string;
}

export default function FloorPlanViewer({ analysis, onConfirm, selectedRoomName }: FloorPlanViewerProps) {
  const [activeRoom, setActiveRoom] = useState<string | null>(selectedRoomName || analysis.rooms[0]?.name || null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableRooms, setEditableRooms] = useState<DetectedRoom[]>(analysis.rooms);

  const totalWidth = analysis.overallDimensions?.widthFt || 50;
  const totalLength = analysis.overallDimensions?.lengthFt || 40;

  const handleDimensionChange = (roomIndex: number, width: number, length: number) => {
    const updated = [...editableRooms];
    updated[roomIndex] = {
      ...updated[roomIndex],
      approxDimensions: { widthFt: width, lengthFt: length },
    };
    setEditableRooms(updated);
  };

  return (
    <div style={{ background: "white", borderRadius: "16px", border: "1px solid #EDE9E2", padding: "24px", boxShadow: "0 4px 24px rgba(44,42,40,0.06)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <div className="atelier-label" style={{ marginBottom: "4px" }}>Architectural Layout Analysis</div>
          <h3 style={{ fontSize: "18px", fontWeight: 600, color: "#2C2A28" }}>
            Detected Spatial Geometry
          </h3>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="atelier-btn-secondary"
            style={{ fontSize: "12px", padding: "6px 14px" }}
          >
            {isEditing ? "Done Editing" : "✎ Adjust Layout"}
          </button>
          {onConfirm && (
            <button
              onClick={() => onConfirm({ ...analysis, rooms: editableRooms })}
              className="atelier-btn-primary"
              style={{ fontSize: "12px", padding: "6px 14px" }}
            >
              Confirm Layout ✓
            </button>
          )}
        </div>
      </div>

      {/* SVG Canvas for Floor Plan */}
      <div style={{ position: "relative", width: "100%", height: "320px", background: "#FAF8F5", borderRadius: "12px", border: "1px solid #EDE9E2", overflow: "hidden", marginBottom: "20px" }}>
        {/* Subtle architectural grid background */}
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(217,212,203,0.4)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Render Rooms */}
          {editableRooms.map((room, idx) => {
            const pos = room.position || {
              x: (idx % 2) * 0.48 + 0.02,
              y: Math.floor(idx / 2) * 0.46 + 0.05,
              width: 0.44,
              height: 0.42,
            };

            const isSelected = activeRoom === room.name;

            return (
              <g
                key={idx}
                onClick={() => setActiveRoom(room.name)}
                style={{ cursor: "pointer" }}
              >
                {/* Room Fill */}
                <rect
                  x={`${pos.x * 100}%`}
                  y={`${pos.y * 100}%`}
                  width={`${pos.width * 100}%`}
                  height={`${pos.height * 100}%`}
                  fill={isSelected ? "rgba(139,115,85,0.12)" : "rgba(250,248,245,0.85)"}
                  stroke={isSelected ? "#8B7355" : "#3D3B39"}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  rx="4"
                  style={{ transition: "all 0.2s ease" }}
                />

                {/* Openings (Windows / Doors) */}
                {room.openings.map((op, oIdx) => {
                  let wx = pos.x;
                  let wy = pos.y;
                  let ww = 0.08;
                  let wh = 0.02;

                  if (op.wall === "north") { wx = pos.x + pos.width / 2 - 0.04; wy = pos.y; ww = 0.08; wh = 0.015; }
                  else if (op.wall === "south") { wx = pos.x + pos.width / 2 - 0.04; wy = pos.y + pos.height - 0.015; ww = 0.08; wh = 0.015; }
                  else if (op.wall === "east") { wx = pos.x + pos.width - 0.015; wy = pos.y + pos.height / 2 - 0.04; ww = 0.015; wh = 0.08; }
                  else if (op.wall === "west") { wx = pos.x; wy = pos.y + pos.height / 2 - 0.04; ww = 0.015; wh = 0.08; }

                  return (
                    <rect
                      key={oIdx}
                      x={`${wx * 100}%`}
                      y={`${wy * 100}%`}
                      width={`${ww * 100}%`}
                      height={`${wh * 100}%`}
                      fill={op.type === "window" ? "#6B8E6B" : "#C9A96E"}
                      rx="1"
                    />
                  );
                })}

                {/* Room Label */}
                <text
                  x={`${(pos.x + pos.width / 2) * 100}%`}
                  y={`${(pos.y + pos.height / 2 - 0.02) * 100}%`}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#2C2A28"
                  fontSize="12"
                  fontWeight={isSelected ? "700" : "600"}
                  fontFamily="Manrope, sans-serif"
                >
                  {room.name}
                </text>

                {/* Dimensions label */}
                {room.approxDimensions && (
                  <text
                    x={`${(pos.x + pos.width / 2) * 100}%`}
                    y={`${(pos.y + pos.height / 2 + 0.05) * 100}%`}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#6B6964"
                    fontSize="10"
                    fontFamily="Manrope, sans-serif"
                  >
                    {room.approxDimensions.widthFt}ft × {room.approxDimensions.lengthFt}ft
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Room Details & Adjustment Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
        {editableRooms.map((room, idx) => {
          const isSelected = activeRoom === room.name;
          return (
            <div
              key={idx}
              onClick={() => setActiveRoom(room.name)}
              style={{
                padding: "14px 16px",
                borderRadius: "10px",
                border: `1.5px solid ${isSelected ? "#8B7355" : "#EDE9E2"}`,
                background: isSelected ? "#F4F0EA" : "white",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#2C2A28" }}>{room.name}</div>
                <div style={{ fontSize: "11px", color: "#9B9189" }}>
                  {room.openings.length} opening{room.openings.length !== 1 ? "s" : ""}
                </div>
              </div>

              {isEditing ? (
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: "10px", color: "#9B9189", display: "block" }}>Width (ft)</label>
                    <input
                      type="number"
                      className="atelier-input"
                      style={{ padding: "4px 8px", fontSize: "12px" }}
                      value={room.approxDimensions?.widthFt || 12}
                      onChange={(e) => handleDimensionChange(idx, Number(e.target.value), room.approxDimensions?.lengthFt || 14)}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: "10px", color: "#9B9189", display: "block" }}>Length (ft)</label>
                    <input
                      type="number"
                      className="atelier-input"
                      style={{ padding: "4px 8px", fontSize: "12px" }}
                      value={room.approxDimensions?.lengthFt || 14}
                      onChange={(e) => handleDimensionChange(idx, room.approxDimensions?.widthFt || 12, Number(e.target.value))}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: "12px", color: "#6B6964" }}>
                  Approx: {room.approxDimensions?.widthFt || "--"}ft × {room.approxDimensions?.lengthFt || "--"}ft
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
