"use client";

import { useState } from "react";
import { DEMO_LIBRARY_ITEMS } from "@/lib/demo/demoData";
import { ROOMS, DESIGN_STYLES, MATERIAL_OPTIONS, PALETTE_OPTIONS } from "@/config/taxonomy";
import type { DesignLibraryItem, RoomType, DesignStyle } from "@/types";

export default function LibraryPage() {
  const [items, setItems] = useState<DesignLibraryItem[]>(DEMO_LIBRARY_ITEMS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [selectedStyle, setSelectedStyle] = useState<string>("all");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("all");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<DesignLibraryItem | null>(null);

  // New item upload state
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadRoom, setUploadRoom] = useState<RoomType>("master_bedroom");
  const [uploadElement, setUploadElement] = useState("Dressing Area");
  const [uploadStyles, setUploadStyles] = useState<DesignStyle[]>(["minimal"]);
  const [uploadPalette, setUploadPalette] = useState<string[]>(["warm_neutrals"]);
  const [uploadMaterials, setUploadMaterials] = useState<string[]>(["Walnut"]);
  const [uploadDescription, setUploadDescription] = useState("");
  const [uploadTags, setUploadTags] = useState("");

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadUrl(url);
    }
  };

  const handleAddLibraryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadUrl) return;

    const newItem: DesignLibraryItem = {
      id: `lib-${Date.now()}`,
      designerId: "demo-designer",
      storagePath: `library/custom-${Date.now()}.jpg`,
      publicUrl: uploadUrl,
      room: uploadRoom,
      element: uploadElement,
      style: uploadStyles,
      palette: uploadPalette,
      materials: uploadMaterials,
      tags: uploadTags.split(",").map(t => t.trim()).filter(Boolean),
      description: uploadDescription,
      createdAt: new Date(),
    };

    setItems([newItem, ...items]);
    setIsUploadOpen(false);
    // Reset form
    setUploadUrl("");
    setUploadDescription("");
    setUploadTags("");
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    if (activeItem?.id === id) setActiveItem(null);
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.element?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRoom = selectedRoom === "all" || item.room === selectedRoom;
    const matchesStyle = selectedStyle === "all" || item.style.includes(selectedStyle as DesignStyle);
    const matchesMaterial = selectedMaterial === "all" || item.materials.includes(selectedMaterial);

    return matchesSearch && matchesRoom && matchesStyle && matchesMaterial;
  });

  return (
    <div style={{ padding: "48px 56px", maxWidth: "1280px", margin: "0 auto" }}>
      {/* Top Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "40px" }}>
        <div>
          <div style={{ fontSize: "11px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#8B7355", fontWeight: 600, marginBottom: "6px" }}>
            Private Design Library
          </div>
          <h1 style={{ fontSize: "36px", fontWeight: 300, letterSpacing: "-0.03em", color: "#2C2A28" }}>
            Curated Visual References
          </h1>
          <p style={{ fontSize: "14px", color: "#6B6964", marginTop: "4px" }}>
            Your firm's private collection of design inspiration, materials, and finished work.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="atelier-btn-primary"
          style={{ fontSize: "14px", padding: "12px 24px" }}
        >
          + Add Reference
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #EDE9E2", padding: "20px 24px", marginBottom: "32px", boxShadow: "0 4px 20px rgba(44,42,40,0.04)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "16px" }}>
          <div>
            <label className="atelier-label">Search Keywords</label>
            <input
              type="text"
              className="atelier-input"
              placeholder="Search by element, tag, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <label className="atelier-label">Room Type</label>
            <select
              className="atelier-input"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
            >
              <option value="all">All Rooms</option>
              {Object.entries(ROOMS).map(([key, value]) => (
                <option key={key} value={key}>{value.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="atelier-label">Design Style</label>
            <select
              className="atelier-input"
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
            >
              <option value="all">All Styles</option>
              {DESIGN_STYLES.map((style) => (
                <option key={style.id} value={style.id}>{style.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="atelier-label">Material</label>
            <select
              className="atelier-input"
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
            >
              <option value="all">All Materials</option>
              {MATERIAL_OPTIONS.map((mat) => (
                <option key={mat} value={mat}>{mat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", background: "white", borderRadius: "16px", border: "1px dashed #D9D4CB" }}>
          <div style={{ fontSize: "16px", color: "#6B6964", marginBottom: "8px" }}>No reference images found</div>
          <div style={{ fontSize: "13px", color: "#9B9189" }}>Try adjusting your search filters or add a new reference.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="atelier-card img-card"
              style={{ overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column" }}
            >
              <div style={{ height: "220px", position: "relative" }}>
                <img src={item.publicUrl} alt={item.description || "Design Reference"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{
                  position: "absolute", top: "10px", right: "10px",
                  background: "rgba(44,42,40,0.75)", backdropFilter: "blur(4px)",
                  color: "white", borderRadius: "4px", padding: "3px 8px",
                  fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em"
                }}>
                  {item.room.replace(/_/g, " ")}
                </div>
              </div>

              <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#2C2A28", marginBottom: "4px" }}>
                    {item.element || item.room.replace(/_/g, " ")}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6B6964", marginBottom: "12px", lineHeight: 1.4 }}>
                    {item.description || "No description provided"}
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {item.style.map((s) => (
                    <span key={s} style={{ background: "#F4F0EA", color: "#8B7355", fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "100px", textTransform: "capitalize" }}>
                      {s}
                    </span>
                  ))}
                  {item.materials.slice(0, 2).map((m) => (
                    <span key={m} style={{ background: "#FAF8F5", border: "1px solid #EDE9E2", color: "#6B6964", fontSize: "10px", padding: "2px 8px", borderRadius: "100px" }}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(44,42,40,0.5)", backdropFilter: "blur(6px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="atelier-card fade-in" style={{ width: "100%", maxWidth: "600px", padding: "32px", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#2C2A28" }}>Add Reference to Design Library</h2>
              <button onClick={() => setIsUploadOpen(false)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#9B9189" }}>✕</button>
            </div>

            <form onSubmit={handleAddLibraryItem} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label className="atelier-label">Select Image File</label>
                {!uploadUrl ? (
                  <label style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    height: "140px", border: "2px dashed #D9D4CB", borderRadius: "12px", cursor: "pointer",
                    background: "#FAF8F5", color: "#6B6964"
                  }}>
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageFile} />
                    <span style={{ fontSize: "24px", marginBottom: "4px" }}>⌅</span>
                    <span style={{ fontSize: "13px", fontWeight: 500 }}>Click to upload image</span>
                    <span style={{ fontSize: "11px", color: "#9B9189" }}>JPG, PNG, WebP up to 20MB</span>
                  </label>
                ) : (
                  <div style={{ position: "relative", height: "160px", borderRadius: "12px", overflow: "hidden" }}>
                    <img src={uploadUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      type="button"
                      onClick={() => setUploadUrl("")}
                      style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(44,42,40,0.8)", color: "white", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer" }}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label className="atelier-label">Room Type</label>
                  <select className="atelier-input" value={uploadRoom} onChange={(e) => setUploadRoom(e.target.value as RoomType)}>
                    {Object.entries(ROOMS).map(([key, value]) => (
                      <option key={key} value={key}>{value.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="atelier-label">Element / Focus Area</label>
                  <input className="atelier-input" placeholder="e.g. Headboard Wall, TV Unit" value={uploadElement} onChange={(e) => setUploadElement(e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="atelier-label">Primary Style</label>
                <select className="atelier-input" value={uploadStyles[0]} onChange={(e) => setUploadStyles([e.target.value as DesignStyle])}>
                  {DESIGN_STYLES.map((style) => (
                    <option key={style.id} value={style.id}>{style.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="atelier-label">Description & Design Details</label>
                <textarea
                  className="atelier-input"
                  style={{ minHeight: "80px", resize: "vertical" }}
                  placeholder="Describe materials, lighting, finishes..."
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="atelier-label">Tags (comma separated)</label>
                <input className="atelier-input" placeholder="walnut, minimalist, warm lighting, fluted panel" value={uploadTags} onChange={(e) => setUploadTags(e.target.value)} />
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "12px" }}>
                <button type="button" className="atelier-btn-secondary" onClick={() => setIsUploadOpen(false)}>Cancel</button>
                <button type="submit" className="atelier-btn-primary" disabled={!uploadUrl}>Save to Library</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Item Detail Modal */}
      {activeItem && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(44,42,40,0.6)", backdropFilter: "blur(6px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="atelier-card fade-in" style={{ width: "100%", maxWidth: "800px", overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <div style={{ height: "480px", background: "#2C2A28" }}>
              <img src={activeItem.publicUrl} alt={activeItem.description || "Reference"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            <div style={{ padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B7355", fontWeight: 600 }}>
                    {activeItem.room.replace(/_/g, " ")}
                  </div>
                  <button onClick={() => setActiveItem(null)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#9B9189" }}>✕</button>
                </div>

                <h3 style={{ fontSize: "22px", fontWeight: 600, color: "#2C2A28", marginBottom: "8px" }}>
                  {activeItem.element || activeItem.room.replace(/_/g, " ")}
                </h3>

                <p style={{ fontSize: "14px", color: "#6B6964", lineHeight: 1.6, marginBottom: "24px" }}>
                  {activeItem.description || "No detailed description provided."}
                </p>

                <div style={{ marginBottom: "20px" }}>
                  <div className="atelier-label">Design Styles</div>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {activeItem.style.map((s) => (
                      <span key={s} style={{ background: "#F4F0EA", color: "#2C2A28", fontSize: "12px", padding: "4px 10px", borderRadius: "100px", textTransform: "capitalize" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <div className="atelier-label">Materials</div>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {activeItem.materials.map((m) => (
                      <span key={m} style={{ background: "#FAF8F5", border: "1px solid #EDE9E2", color: "#6B6964", fontSize: "12px", padding: "4px 10px", borderRadius: "100px" }}>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  onClick={() => handleDeleteItem(activeItem.id)}
                  style={{ background: "rgba(180,40,40,0.06)", border: "1px solid rgba(180,40,40,0.2)", color: "#B42828", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", cursor: "pointer" }}
                >
                  Delete Reference
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
