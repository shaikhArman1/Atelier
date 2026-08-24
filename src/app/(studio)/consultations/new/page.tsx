"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useConsultationStore } from "@/store/consultationStore";
import { PROPERTY_TYPES, DESIGN_STYLES, PALETTE_OPTIONS, MATERIAL_OPTIONS, LIGHTING_OPTIONS, FURNITURE_OPTIONS, ORNAMENTATION_OPTIONS, ROOMS } from "@/config/taxonomy";
import { DEMO_LIBRARY_ITEMS, DEMO_REFERENCES, DEMO_CONCEPTS, DEMO_IMAGES } from "@/lib/demo/demoData";
import { generateId } from "@/lib/utils";
import type { RoomType, DesignStyle, ReferenceItem, GeneratedConcept, FloorPlanAnalysis } from "@/types";

type Step = "project_info" | "style_discovery" | "palette" | "materials" | "lighting" | "space_selection" | "element_selection" | "references" | "floor_plan" | "concept" | "summary";

const STEPS: Step[] = ["project_info", "style_discovery", "palette", "materials", "lighting", "space_selection", "element_selection", "references", "floor_plan", "concept", "summary"];

export default function NewConsultationPage() {
  const router = useRouter();
  const store = useConsultationStore();

  const [step, setStep] = useState<Step>("project_info");
  const [stepIndex, setStepIndex] = useState(0);

  // Project info
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bhk, setBhk] = useState("");
  const [location, setLocation] = useState("");

  // Style & preferences
  const [selectedStyles, setSelectedStyles] = useState<DesignStyle[]>([]);
  const [selectedPalette, setSelectedPalette] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedLighting, setSelectedLighting] = useState<string[]>([]);
  const [selectedFurniture, setSelectedFurniture] = useState<string[]>([]);
  const [ornamentation, setOrnamentation] = useState("minimal");

  // Room/element
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  // References
  const [libraryRefs, setLibraryRefs] = useState<ReferenceItem[]>([]);
  const [externalRefs, setExternalRefs] = useState<ReferenceItem[]>([]);
  const [chosenRefs, setChosenRefs] = useState<ReferenceItem[]>([]);
  const [refsLoading, setRefsLoading] = useState(false);

  // Floor plan
  const [floorPlanUrl, setFloorPlanUrl] = useState<string | null>(null);
  const [floorPlanAnalysis, setFloorPlanAnalysis] = useState<FloorPlanAnalysis | null>(null);
  const [analyzingFloorPlan, setAnalyzingFloorPlan] = useState(false);
  const [floorPlanError, setFloorPlanError] = useState("");

  // Concept
  const [concept, setConcept] = useState<GeneratedConcept | null>(null);
  const [generatingConcept, setGeneratingConcept] = useState(false);
  const [refinementText, setRefinementText] = useState("");
  const [conceptError, setConceptError] = useState("");
  const [designerInstructions, setDesignerInstructions] = useState("");

  // Summary
  const [summary, setSummary] = useState("");
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const goNext = () => {
    const nextIdx = stepIndex + 1;
    if (nextIdx < STEPS.length) {
      setStep(STEPS[nextIdx]);
      setStepIndex(nextIdx);
    }
  };

  const goBack = () => {
    const prevIdx = stepIndex - 1;
    if (prevIdx >= 0) {
      setStep(STEPS[prevIdx]);
      setStepIndex(prevIdx);
    }
  };

  const loadReferences = useCallback(async () => {
    setRefsLoading(true);
    try {
      const { searchLibraryClient, searchReferencesClient } = await import("@/services/aiService");
      const libData = await searchLibraryClient(selectedRoom || undefined, selectedElement || undefined, selectedStyles);
      setLibraryRefs(libData.map((r) => ({ ...r, imageUrl: r.publicUrl, source: "private_library" as const })));

      const extData = await searchReferencesClient();
      setExternalRefs(extData);
    } catch (e) {
      setExternalRefs(DEMO_REFERENCES);
    } finally {
      setRefsLoading(false);
    }
  }, [selectedRoom, selectedElement, selectedStyles]);

  const handleFloorPlanUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setFloorPlanUrl(url);
  };

  const analyzeFloorPlan = async () => {
    if (!floorPlanUrl) return;
    setAnalyzingFloorPlan(true);
    setFloorPlanError("");
    try {
      const { analyzeFloorPlanClient } = await import("@/services/aiService");
      const analysis = await analyzeFloorPlanClient({
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        targetRoom: selectedRoom || undefined,
      });
      setFloorPlanAnalysis(analysis);
    } catch {
      setFloorPlanError("Analysis failed. Continuing without floor plan constraints.");
    } finally {
      setAnalyzingFloorPlan(false);
    }
  };

  const generateConcept = async (refinement?: string) => {
    setGeneratingConcept(true);
    setConceptError("");
    try {
      const { generateConceptClient } = await import("@/services/aiService");
      const generated = await generateConceptClient({
        room: selectedRoom!,
        element: selectedElement || undefined,
        preferenceProfile: {
          overallStyle: selectedStyles,
          palette: selectedPalette,
          materials: selectedMaterials,
          lighting: selectedLighting,
          furniture: selectedFurniture,
          ornamentation: ornamentation as any,
          consultationId: "demo-consultation",
          projectId: "demo-project",
          version: 1,
        },
        selectedReferences: chosenRefs,
        floorPlanAnalysis: floorPlanAnalysis || undefined,
        designerInstructions,
        parentConceptUrl: refinement ? concept?.imageUrl : undefined,
        refinementInstruction: refinement,
      });
      setConcept(generated);
    } catch {
      setConceptError("Concept generation failed. Please try again.");
    } finally {
      setGeneratingConcept(false);
    }
  };

  const generateSummary = async () => {
    setGeneratingSummary(true);
    try {
      const { generateSummaryClient } = await import("@/services/aiService");
      const text = await generateSummaryClient(clientName, {
        projectName,
        propertyType,
        profile: { overallStyle: selectedStyles, palette: selectedPalette, materials: selectedMaterials, lighting: selectedLighting, furniture: selectedFurniture, ornamentation, avoid: [] },
        rooms: selectedRoom ? [selectedRoom] : [],
        concepts: concept ? 1 : 0,
        notes: [],
      });
      setSummary(text);
    } catch {
      setSummary("Summary generation failed. Please add your consultation notes manually.");
    } finally {
      setGeneratingSummary(false);
    }
  };

  const progressPct = Math.round(((stepIndex) / (STEPS.length - 1)) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F5" }}>
      {/* Top progress bar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 20,
        background: "white", borderBottom: "1px solid #EDE9E2",
        padding: "0 48px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button onClick={() => router.push("/dashboard")} style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: "none", border: "none", cursor: "pointer",
              color: "#6B6964", fontSize: "13px", padding: "0",
            }}>
              ← Dashboard
            </button>
            <div style={{ width: "1px", height: "16px", background: "#EDE9E2" }} />
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#2C2A28" }}>
              {clientName ? `${clientName} — ` : ""}New Consultation
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ fontSize: "12px", color: "#9B9189" }}>{progressPct}% complete</div>
            <div style={{ width: "120px", height: "3px", background: "#EDE9E2", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progressPct}%`, background: "#8B7355", borderRadius: "2px", transition: "width 0.4s ease" }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "56px 48px" }}>

        {/* STEP 1: Project Info */}
        {step === "project_info" && (
          <div className="fade-in">
            <StepHeader title="Let's start your consultation" subtitle="Tell us about the project" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "32px" }}>
              <div>
                <label className="atelier-label">Client Name</label>
                <input className="atelier-input" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="e.g. Rahul Sharma" />
              </div>
              <div>
                <label className="atelier-label">Project Name</label>
                <input className="atelier-input" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="e.g. 4 BHK Apartment" />
              </div>
            </div>

            <div style={{ marginBottom: "32px" }}>
              <label className="atelier-label">Property Type</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                {PROPERTY_TYPES.map((pt) => (
                  <button
                    key={pt.id}
                    onClick={() => setPropertyType(pt.id)}
                    style={{
                      padding: "16px 12px",
                      border: `2px solid ${propertyType === pt.id ? "#2C2A28" : "#EDE9E2"}`,
                      borderRadius: "10px",
                      background: propertyType === pt.id ? "#F4F0EA" : "white",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: propertyType === pt.id ? 600 : 400,
                      color: propertyType === pt.id ? "#2C2A28" : "#6B6964",
                      fontFamily: "inherit",
                      transition: "all 0.2s ease",
                      textAlign: "center",
                    }}
                  >
                    {pt.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginBottom: "40px" }}>
              <div>
                <label className="atelier-label">BHK / Bedrooms</label>
                <input className="atelier-input" value={bhk} onChange={(e) => setBhk(e.target.value)} placeholder="e.g. 4" type="number" min="1" max="10" />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label className="atelier-label">Location (Optional)</label>
                <input className="atelier-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Banjara Hills, Hyderabad" />
              </div>
            </div>

            <NavButtons onNext={goNext} nextDisabled={!clientName || !propertyType} />
          </div>
        )}

        {/* STEP 2: Style Discovery */}
        {step === "style_discovery" && (
          <div className="fade-in">
            <StepHeader
              title="Which direction feels closer to what you want?"
              subtitle="Select all that resonate. Don't overthink — choose what feels right."
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "40px" }}>
              {DESIGN_STYLES.map((style) => {
                const isSelected = selectedStyles.includes(style.id);
                return (
                  <div
                    key={style.id}
                    onClick={() => setSelectedStyles(prev => isSelected ? prev.filter(s => s !== style.id) : [...prev, style.id])}
                    className="img-card"
                    style={{
                      height: "220px",
                      cursor: "pointer",
                      border: `2px solid ${isSelected ? "#2C2A28" : "transparent"}`,
                      borderRadius: "14px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ position: "relative", height: "100%" }}>
                      <img src={DEMO_IMAGES.styles[style.id as keyof typeof DEMO_IMAGES.styles] || DEMO_IMAGES.styles.modern} alt={style.label} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }} />
                      <div style={{
                        position: "absolute", inset: 0, borderRadius: "12px",
                        background: "linear-gradient(to top, rgba(44,42,40,0.75) 0%, transparent 55%)",
                        display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "16px",
                      }}>
                        <div style={{ fontSize: "15px", fontWeight: 600, color: "white", letterSpacing: "-0.01em" }}>{style.label}</div>
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", marginTop: "3px" }}>{style.description}</div>
                      </div>
                      {isSelected && (
                        <div style={{
                          position: "absolute", top: "12px", right: "12px",
                          width: "28px", height: "28px", borderRadius: "50%",
                          background: "#2C2A28", display: "flex", alignItems: "center", justifyContent: "center",
                          color: "white", fontSize: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                        }}>✓</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <NavButtons onBack={goBack} onNext={goNext} nextLabel="Continue" />
          </div>
        )}

        {/* STEP 3: Palette */}
        {step === "palette" && (
          <div className="fade-in">
            <StepHeader title="What colours feel like home?" subtitle="Select all that appeal to you" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "40px" }}>
              {PALETTE_OPTIONS.map((p) => {
                const isSelected = selectedPalette.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPalette(prev => isSelected ? prev.filter(x => x !== p.id) : [...prev, p.id])}
                    style={{
                      display: "flex", alignItems: "center", gap: "14px",
                      padding: "16px 18px",
                      border: `2px solid ${isSelected ? "#2C2A28" : "#EDE9E2"}`,
                      borderRadius: "12px",
                      background: isSelected ? "#F4F0EA" : "white",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: p.swatch, border: "2px solid rgba(44,42,40,0.1)", flexShrink: 0 }} />
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: "#2C2A28" }}>{p.label}</div>
                    </div>
                    {isSelected && <div style={{ marginLeft: "auto", color: "#8B7355", fontSize: "16px" }}>✓</div>}
                  </button>
                );
              })}
            </div>
            <NavButtons onBack={goBack} onNext={goNext} />
          </div>
        )}

        {/* STEP 4: Materials */}
        {step === "materials" && (
          <div className="fade-in">
            <StepHeader title="Which materials speak to you?" subtitle="Select your preferred materials" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "40px" }}>
              {MATERIAL_OPTIONS.map((mat) => {
                const isSelected = selectedMaterials.includes(mat);
                return (
                  <button
                    key={mat}
                    onClick={() => setSelectedMaterials(prev => isSelected ? prev.filter(x => x !== mat) : [...prev, mat])}
                    style={{
                      padding: "10px 20px",
                      border: `1.5px solid ${isSelected ? "#2C2A28" : "#D9D4CB"}`,
                      borderRadius: "100px",
                      background: isSelected ? "#2C2A28" : "white",
                      color: isSelected ? "white" : "#3D3B39",
                      fontSize: "13px",
                      fontWeight: 500,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {mat}
                  </button>
                );
              })}
            </div>
            <NavButtons onBack={goBack} onNext={goNext} />
          </div>
        )}

        {/* STEP 5: Lighting */}
        {step === "lighting" && (
          <div className="fade-in">
            <StepHeader title="What kind of light feels right?" subtitle="Choose your preferred lighting character" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "40px" }}>
              {LIGHTING_OPTIONS.map((l) => {
                const isSelected = selectedLighting.includes(l.id);
                return (
                  <button
                    key={l.id}
                    onClick={() => setSelectedLighting(prev => isSelected ? prev.filter(x => x !== l.id) : [...prev, l.id])}
                    style={{
                      padding: "18px 24px",
                      border: `2px solid ${isSelected ? "#2C2A28" : "#EDE9E2"}`,
                      borderRadius: "12px",
                      background: isSelected ? "#F4F0EA" : "white",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      textAlign: "left",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#2C2A28" }}>{l.label}</div>
                  </button>
                );
              })}
            </div>
            <NavButtons onBack={goBack} onNext={goNext} />
          </div>
        )}

        {/* STEP 6: Space Selection */}
        {step === "space_selection" && (
          <div className="fade-in">
            <StepHeader title="Where would you like to start?" subtitle="Select the space we'll focus on today" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "40px" }}>
              {(Object.entries(ROOMS) as [RoomType, {label: string; elements: string[]}][]).map(([id, room]) => (
                <button
                  key={id}
                  onClick={() => setSelectedRoom(id)}
                  style={{
                    padding: "18px 12px",
                    border: `2px solid ${selectedRoom === id ? "#2C2A28" : "#EDE9E2"}`,
                    borderRadius: "12px",
                    background: selectedRoom === id ? "#2C2A28" : "white",
                    color: selectedRoom === id ? "white" : "#3D3B39",
                    fontSize: "13px",
                    fontWeight: selectedRoom === id ? 600 : 400,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.2s ease",
                    textAlign: "center",
                  }}
                >
                  {room.label}
                </button>
              ))}
            </div>
            <NavButtons onBack={goBack} onNext={goNext} nextDisabled={!selectedRoom} />
          </div>
        )}

        {/* STEP 7: Element Selection */}
        {step === "element_selection" && selectedRoom && (
          <div className="fade-in">
            <StepHeader
              title={`What would you like to design in the ${ROOMS[selectedRoom].label}?`}
              subtitle="Choose the element to focus on"
            />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "40px" }}>
              {ROOMS[selectedRoom].elements.map((el) => (
                <button
                  key={el}
                  onClick={() => setSelectedElement(el)}
                  style={{
                    padding: "16px",
                    border: `2px solid ${selectedElement === el ? "#8B7355" : "#EDE9E2"}`,
                    borderRadius: "12px",
                    background: selectedElement === el ? "rgba(139,115,85,0.08)" : "white",
                    color: selectedElement === el ? "#8B7355" : "#3D3B39",
                    fontSize: "14px",
                    fontWeight: selectedElement === el ? 600 : 400,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.2s ease",
                  }}
                >
                  {el}
                </button>
              ))}
            </div>
            <NavButtons onBack={goBack} onNext={() => { loadReferences(); goNext(); }} nextDisabled={!selectedElement} nextLabel="Browse References" />
          </div>
        )}

        {/* STEP 8: References */}
        {step === "references" && (
          <div className="fade-in">
            <StepHeader
              title="Curated References"
              subtitle="Select images that match your vision. These guide the concept generation."
            />
            {refsLoading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "60px 0", color: "#6B6964" }}>
                <div style={{ fontSize: "13px", letterSpacing: "0.04em" }}>Matching your design direction…</div>
                <div style={{ display: "flex", gap: "6px" }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#C9A96E", opacity: 0.4 + i * 0.2 }} />)}
                </div>
              </div>
            ) : (
              <>
                {libraryRefs.length > 0 && (
                  <div style={{ marginBottom: "32px" }}>
                    <div className="atelier-label" style={{ marginBottom: "16px" }}>From Your Design Library</div>
                    <ReferenceGrid refs={libraryRefs} chosen={chosenRefs} onToggle={(ref) => setChosenRefs(prev => prev.find(r => r.id === ref.id) ? prev.filter(r => r.id !== ref.id) : [...prev, ref])} />
                  </div>
                )}
                {externalRefs.length > 0 && (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                      <div className="atelier-label" style={{ marginBottom: 0 }}>Curated External References</div>
                      <span className="demo-badge">Demo</span>
                    </div>
                    <ReferenceGrid refs={externalRefs} chosen={chosenRefs} onToggle={(ref) => setChosenRefs(prev => prev.find(r => r.id === ref.id) ? prev.filter(r => r.id !== ref.id) : [...prev, ref])} />
                  </div>
                )}
                <div style={{ marginTop: "16px", fontSize: "13px", color: "#9B9189" }}>
                  {chosenRefs.length} reference{chosenRefs.length !== 1 ? "s" : ""} selected
                </div>
              </>
            )}
            <NavButtons onBack={goBack} onNext={goNext} nextLabel="Continue to Floor Plan" />
          </div>
        )}

        {/* STEP 9: Floor Plan */}
        {step === "floor_plan" && (
          <div className="fade-in">
            <StepHeader title="Have the builder's floor plan?" subtitle="Optional — uploading helps us create a more spatially accurate concept" />

            {!floorPlanUrl ? (
              <div style={{ display: "flex", gap: "16px", marginBottom: "40px" }}>
                <label style={{
                  flex: 1, height: "200px", border: "2px dashed #D9D4CB",
                  borderRadius: "16px", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: "12px",
                  cursor: "pointer", transition: "all 0.2s ease", color: "#9B9189",
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLLabelElement).style.borderColor = "#8B7355"; (e.currentTarget as HTMLLabelElement).style.color = "#8B7355"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLLabelElement).style.borderColor = "#D9D4CB"; (e.currentTarget as HTMLLabelElement).style.color = "#9B9189"; }}
                >
                  <input type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={handleFloorPlanUpload} />
                  <span style={{ fontSize: "24px", opacity: 0.5 }}>⌅</span>
                  <span style={{ fontSize: "14px", fontWeight: 500 }}>Upload Floor Plan</span>
                  <span style={{ fontSize: "12px", opacity: 0.7 }}>PNG, JPG, PDF • Max 20MB</span>
                </label>
                <button
                  onClick={goNext}
                  style={{
                    flex: 1, height: "200px", border: "1px solid #EDE9E2",
                    borderRadius: "16px", background: "white", cursor: "pointer",
                    fontSize: "14px", color: "#6B6964", fontFamily: "inherit",
                    transition: "all 0.2s ease",
                  }}
                >
                  Skip for Now
                </button>
              </div>
            ) : (
              <div style={{ marginBottom: "40px" }}>
                <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
                  <div style={{ flex: 1, borderRadius: "12px", overflow: "hidden", border: "1px solid #EDE9E2" }}>
                    <img src={floorPlanUrl} alt="Floor plan" style={{ width: "100%", maxHeight: "360px", objectFit: "contain", background: "white", padding: "16px" }} />
                  </div>
                  <div style={{ width: "280px" }}>
                    {!floorPlanAnalysis ? (
                      <div>
                        <button
                          className="atelier-btn-primary"
                          onClick={analyzeFloorPlan}
                          disabled={analyzingFloorPlan}
                          style={{ width: "100%", justifyContent: "center", marginBottom: "12px" }}
                        >
                          {analyzingFloorPlan ? "Analysing space…" : "Analyse Floor Plan"}
                        </button>
                        {floorPlanError && <div style={{ fontSize: "12px", color: "#B42828", marginTop: "8px" }}>{floorPlanError}</div>}
                      </div>
                    ) : (
                      <div>
                        <div style={{ padding: "16px", background: "#F4F0EA", borderRadius: "10px", marginBottom: "16px" }}>
                          <div className="atelier-label" style={{ marginBottom: "12px" }}>Detected Layout</div>
                          {floorPlanAnalysis.rooms.map((room, i) => (
                            <div key={i} style={{ marginBottom: "8px", padding: "10px", background: "white", borderRadius: "8px", fontSize: "13px" }}>
                              <div style={{ fontWeight: 600, color: "#2C2A28" }}>{room.name}</div>
                              {room.approxDimensions && (
                                <div style={{ color: "#6B6964", fontSize: "11px", marginTop: "2px" }}>
                                  ~{room.approxDimensions.widthFt}ft × {room.approxDimensions.lengthFt}ft
                                </div>
                              )}
                            </div>
                          ))}
                          <div style={{ fontSize: "11px", color: "#9B9189", marginTop: "8px" }}>
                            Confidence: {Math.round(floorPlanAnalysis.confidence * 100)}%
                          </div>
                        </div>
                        {floorPlanAnalysis.notes && (
                          <div style={{ fontSize: "12px", color: "#6B6964", fontStyle: "italic" }}>{floorPlanAnalysis.notes}</div>
                        )}
                      </div>
                    )}
                    <button
                      onClick={() => { setFloorPlanUrl(null); setFloorPlanAnalysis(null); }}
                      className="atelier-btn-secondary"
                      style={{ width: "100%", justifyContent: "center", marginTop: "12px", fontSize: "13px" }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}

            <NavButtons onBack={goBack} onNext={() => { generateConcept(); goNext(); }} nextLabel="Create Concept" />
          </div>
        )}

        {/* STEP 10: Concept */}
        {step === "concept" && (
          <div className="fade-in">
            {generatingConcept ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ fontSize: "20px", fontWeight: 300, color: "#2C2A28", marginBottom: "16px", letterSpacing: "-0.02em" }}>
                  Creating your visualization…
                </div>
                <div style={{ fontSize: "14px", color: "#9B9189", marginBottom: "32px" }}>Applying your design direction</div>
                <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                  {[0,1,2,3].map(i => (
                    <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#C9A96E", opacity: 0.3 + i * 0.15 }} />
                  ))}
                </div>
              </div>
            ) : concept ? (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                  <div>
                    <h2 style={{ fontSize: "22px", fontWeight: 600, letterSpacing: "-0.02em", color: "#2C2A28" }}>
                      {selectedElement} — {selectedRoom && ROOMS[selectedRoom].label}
                    </h2>
                    <div style={{ fontSize: "13px", color: "#9B9189", marginTop: "4px" }}>
                      Conceptual visualization — AI generated
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button className="atelier-btn-secondary" onClick={() => generateConcept()} style={{ fontSize: "13px" }}>
                      ↺ Variation
                    </button>
                  </div>
                </div>

                <div style={{ position: "relative", borderRadius: "16px", overflow: "hidden", marginBottom: "20px", boxShadow: "0 8px 40px rgba(44,42,40,0.12)" }}>
                  <img src={concept.imageUrl} alt="Generated concept" style={{ width: "100%", maxHeight: "520px", objectFit: "cover", display: "block" }} />
                  <div style={{
                    position: "absolute", bottom: "16px", left: "16px",
                    padding: "8px 14px", background: "rgba(44,42,40,0.7)", backdropFilter: "blur(8px)",
                    borderRadius: "8px", fontSize: "11px", color: "rgba(255,255,255,0.8)", letterSpacing: "0.04em"
                  }}>
                    Conceptual visualization · Final materials & dimensions require professional development
                  </div>
                </div>

                {conceptError && (
                  <div style={{ padding: "12px 16px", background: "rgba(180,40,40,0.06)", border: "1px solid rgba(180,40,40,0.15)", borderRadius: "8px", fontSize: "13px", color: "#B42828", marginBottom: "16px" }}>
                    {conceptError}
                  </div>
                )}

                {/* Refinement */}
                <div style={{ background: "white", border: "1px solid #EDE9E2", borderRadius: "14px", padding: "20px", marginBottom: "24px" }}>
                  <div className="atelier-label" style={{ marginBottom: "12px" }}>Refine This Concept</div>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      className="atelier-input"
                      value={refinementText}
                      onChange={(e) => setRefinementText(e.target.value)}
                      placeholder="e.g. Make the wardrobe full height. Change walnut to lighter oak."
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && refinementText.trim()) {
                          generateConcept(refinementText);
                          setRefinementText("");
                        }
                      }}
                    />
                    <button
                      className="atelier-btn-primary"
                      disabled={!refinementText.trim() || generatingConcept}
                      onClick={() => { generateConcept(refinementText); setRefinementText(""); }}
                      style={{ flexShrink: 0 }}
                    >
                      Apply
                    </button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
                    {["Make wardrobe full height", "Lighter wood tone", "Warmer lighting", "More minimal", "Add dressing mirror"].map(suggestion => (
                      <button
                        key={suggestion}
                        onClick={() => setRefinementText(suggestion)}
                        style={{
                          padding: "6px 12px", borderRadius: "100px",
                          border: "1px solid #EDE9E2", background: "transparent",
                          fontSize: "12px", color: "#6B6964", cursor: "pointer",
                          fontFamily: "inherit", transition: "all 0.2s ease",
                        }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                <NavButtons onBack={goBack} onNext={() => { generateSummary(); goNext(); }} nextLabel="Generate Summary" />
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                {conceptError && (
                  <div style={{ color: "#B42828", fontSize: "14px", marginBottom: "24px" }}>
                    {conceptError}
                  </div>
                )}
                <button className="atelier-btn-primary" onClick={() => generateConcept()}>
                  Generate Concept
                </button>
              </div>
            )}
          </div>
        )}

        {/* STEP 11: Summary */}
        {step === "summary" && (
          <div className="fade-in">
            <StepHeader title="Consultation Summary" subtitle="Your complete design brief — review and edit as needed" />

            {generatingSummary ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#6B6964", fontSize: "14px" }}>
                Generating your consultation brief…
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                <div>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    style={{
                      width: "100%", minHeight: "480px", padding: "20px",
                      border: "1px solid #EDE9E2", borderRadius: "12px",
                      fontFamily: "Manrope, monospace", fontSize: "13px", lineHeight: 1.8,
                      color: "#2C2A28", background: "white", resize: "vertical", outline: "none",
                    }}
                    placeholder="Consultation summary will appear here…"
                  />
                </div>
                {concept && (
                  <div>
                    <div className="atelier-label" style={{ marginBottom: "12px" }}>Selected Concept</div>
                    <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #EDE9E2", marginBottom: "16px" }}>
                      <img src={concept.imageUrl} alt="Generated concept" style={{ width: "100%", height: "240px", objectFit: "cover" }} />
                    </div>
                    <div style={{ fontSize: "12px", color: "#9B9189", fontStyle: "italic" }}>
                      {concept.element && `${concept.element} — `}{selectedRoom && ROOMS[selectedRoom]?.label}
                    </div>
                    {chosenRefs.length > 0 && (
                      <div style={{ marginTop: "20px" }}>
                        <div className="atelier-label" style={{ marginBottom: "10px" }}>Selected References ({chosenRefs.length})</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
                          {chosenRefs.slice(0, 6).map(ref => (
                            <div key={ref.id} style={{ borderRadius: "8px", overflow: "hidden", aspectRatio: "1", border: "1px solid #EDE9E2" }}>
                              <img src={ref.imageUrl} alt="Reference" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
              <button className="atelier-btn-secondary" onClick={goBack} style={{ fontSize: "14px" }}>← Back</button>
              <button className="atelier-btn-primary" onClick={() => router.push("/dashboard")} style={{ fontSize: "14px" }}>
                Save & Complete
              </button>
              <button className="atelier-btn-secondary" onClick={() => { const blob = new Blob([summary], { type: "text/plain" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${clientName}-design-brief.txt`; a.click(); }} style={{ fontSize: "14px" }}>
                Export Brief
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: "40px" }}>
      {subtitle && (
        <div style={{ fontSize: "12px", color: "#9B9189", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "10px" }}>
          {subtitle}
        </div>
      )}
      <h2 style={{ fontSize: "30px", fontWeight: 600, letterSpacing: "-0.025em", color: "#2C2A28", lineHeight: 1.2 }}>
        {title}
      </h2>
    </div>
  );
}

function NavButtons({ onBack, onNext, nextDisabled, nextLabel = "Continue", backLabel = "Back" }: {
  onBack?: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  backLabel?: string;
}) {
  return (
    <div style={{ display: "flex", gap: "12px", marginTop: "40px" }}>
      {onBack && (
        <button className="atelier-btn-secondary" onClick={onBack} style={{ fontSize: "14px" }}>
          ← {backLabel}
        </button>
      )}
      {onNext && (
        <button className="atelier-btn-primary" onClick={onNext} disabled={nextDisabled} style={{ fontSize: "14px" }}>
          {nextLabel} →
        </button>
      )}
    </div>
  );
}

function ReferenceGrid({ refs, chosen, onToggle }: {
  refs: ReferenceItem[];
  chosen: ReferenceItem[];
  onToggle: (ref: ReferenceItem) => void;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
      {refs.map((ref) => {
        const isChosen = chosen.some(c => c.id === ref.id);
        return (
          <div
            key={ref.id}
            onClick={() => onToggle(ref)}
            style={{
              position: "relative", height: "180px", borderRadius: "12px",
              overflow: "hidden", cursor: "pointer",
              border: `2px solid ${isChosen ? "#2C2A28" : "transparent"}`,
              transition: "all 0.2s ease",
            }}
          >
            <img src={ref.imageUrl} alt={ref.title || "Reference"} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
            />
            {isChosen && (
              <div style={{
                position: "absolute", top: "10px", right: "10px",
                width: "26px", height: "26px", borderRadius: "50%",
                background: "#2C2A28", display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: "12px",
              }}>✓</div>
            )}
            {ref.source === "external" && (
              <div style={{
                position: "absolute", bottom: "8px", left: "8px",
                background: "rgba(250,248,245,0.85)", borderRadius: "4px",
                padding: "2px 8px", fontSize: "10px", color: "#6B6964", letterSpacing: "0.04em"
              }}>
                External Ref
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
