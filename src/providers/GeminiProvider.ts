import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import type { ConceptGenerationInput, GeneratedConcept, FloorPlanInput, FloorPlanAnalysis } from "@/types";
import { buildConceptPrompt, buildFloorPlanPrompt, PROMPT_VERSION } from "@/prompts";
import { generateId } from "@/lib/utils";
import { DEMO_IMAGES } from "@/lib/demo/demoData";

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
];

export class GeminiProvider {
  private client: GoogleGenerativeAI;
  private visionModel: string = "gemini-1.5-pro";

  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async analyzeFloorPlan(input: FloorPlanInput): Promise<FloorPlanAnalysis> {
    const model = this.client.getGenerativeModel({ model: this.visionModel, safetySettings });
    const prompt = buildFloorPlanPrompt(input.targetRoom);

    try {
      // Fetch image and convert to base64
      const response = await fetch(input.imageUrl);
      const buffer = await response.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const mimeType = response.headers.get("content-type") || "image/jpeg";

      const result = await model.generateContent([
        prompt,
        { inlineData: { data: base64, mimeType } },
      ]);

      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON in response");

      const parsed = JSON.parse(jsonMatch[0]);
      return parsed as FloorPlanAnalysis;
    } catch (err) {
      console.error("Floor plan analysis failed:", err);
      throw err;
    }
  }

  async generateConcept(input: ConceptGenerationInput): Promise<Omit<GeneratedConcept, "id" | "consultationId" | "projectId" | "savedToProject" | "createdAt">> {
    const prompt = buildConceptPrompt(input);
    // Gemini image generation via Imagen 3 (when available via API)
    // For now return structured data with prompt for image generation
    // This will be expanded when Imagen 3 API is available server-side
    return {
      room: input.room,
      element: input.element,
      imageUrl: "", // Will be populated by image generation
      prompt,
      referencesUsed: input.selectedReferences.map((r) => r.id),
      floorPlanId: undefined,
      profileVersion: input.preferenceProfile.version,
      provider: "gemini",
      model: "gemini-1.5-pro",
      promptVersion: PROMPT_VERSION,
    };
  }

  async generateSummaryText(prompt: string): Promise<string> {
    const model = this.client.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}

// Demo provider - returns curated demo assets
export class DemoProvider {
  async analyzeFloorPlan(_input: FloorPlanInput): Promise<FloorPlanAnalysis> {
    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 2000));
    return {
      rooms: [
        {
          name: "Master Bedroom",
          roomType: "master_bedroom",
          approxDimensions: { widthFt: 12, lengthFt: 14 },
          openings: [
            { type: "window", wall: "east", approxWidthFt: 5 },
            { type: "window", wall: "north", approxWidthFt: 4 },
            { type: "door", wall: "south", approxWidthFt: 3 },
          ],
          position: { x: 0.5, y: 0.05, width: 0.48, height: 0.42 },
        },
        {
          name: "Living Room",
          roomType: "living_room",
          approxDimensions: { widthFt: 18, lengthFt: 14 },
          openings: [
            { type: "window", wall: "west", approxWidthFt: 8 },
            { type: "door", wall: "east", approxWidthFt: 3 },
          ],
          position: { x: 0.02, y: 0.05, width: 0.46, height: 0.42 },
        },
        {
          name: "Kitchen",
          roomType: "kitchen",
          approxDimensions: { widthFt: 10, lengthFt: 8 },
          openings: [{ type: "door", wall: "south", approxWidthFt: 3 }],
          position: { x: 0.5, y: 0.5, width: 0.25, height: 0.3 },
        },
        {
          name: "Bathroom",
          roomType: "bathroom",
          approxDimensions: { widthFt: 6, lengthFt: 8 },
          openings: [{ type: "door", wall: "west", approxWidthFt: 2.5 }],
          position: { x: 0.75, y: 0.5, width: 0.22, height: 0.3 },
        },
      ],
      overallDimensions: { widthFt: 45, lengthFt: 38 },
      confidence: 0.82,
      notes: "DEMO: Sample floor plan analysis. Upload a real floor plan for actual AI analysis.",
    };
  }

  async generateConcept(input: ConceptGenerationInput): Promise<Omit<GeneratedConcept, "id" | "consultationId" | "projectId" | "savedToProject" | "createdAt">> {
    await new Promise((r) => setTimeout(r, 3000));
    const conceptImages = Object.values(DEMO_IMAGES.concepts);
    const idx = Math.floor(Math.random() * conceptImages.length);
    return {
      room: input.room,
      element: input.element,
      imageUrl: conceptImages[idx],
      prompt: buildConceptPrompt(input),
      referencesUsed: input.selectedReferences.map((r) => r.id),
      profileVersion: input.preferenceProfile.version,
      provider: "demo",
      model: "demo-v1",
      promptVersion: PROMPT_VERSION,
    };
  }

  async generateSummaryText(clientName: string, profile: Omit<GeneratedConcept, "id" | "consultationId" | "projectId" | "savedToProject" | "createdAt">): Promise<string> {
    await new Promise((r) => setTimeout(r, 1500));
    return `CONSULTATION SUMMARY — DEMO

CLIENT
${clientName}

OVERALL DESIGN DIRECTION
Minimal Modern Luxury with warm accents

PREFERRED PALETTE
Warm White · Beige · Walnut

PREFERRED MATERIALS
Natural Wood · Matte Laminate · Fabric · Natural Stone

LIGHTING DIRECTION
Warm ambient · Indirect cove lighting

MASTER BEDROOM — DRESSING AREA
— Full-height walnut wardrobe with integrated lighting
— Minimal dressing vanity with warm LED strip
— Soft fabric upholstered seating nook
— Matte laminate finish, handle-less profiles

ELEMENTS TO AVOID
— Heavy ornamentation or decorative profiles
— Dark tones or overly dramatic colour
— Industrial or raw material aesthetics

NEXT STEPS
— Finalize wardrobe layout and dimensions
— Select fabric for seating
— Review lighting plan with electrical consultant

Note: This is a DEMO summary. Real consultations generate AI-powered summaries.`;
  }
}
