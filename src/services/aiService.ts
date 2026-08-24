import { DemoProvider, GeminiProvider } from "@/providers/GeminiProvider";
import { DEMO_LIBRARY_ITEMS, DEMO_REFERENCES } from "@/lib/demo/demoData";
import { generateId } from "@/lib/utils";
import type { ConceptGenerationInput, FloorPlanInput, ReferenceItem, GeneratedConcept, RoomType, DesignStyle } from "@/types";

const isDemo = process.env.NEXT_PUBLIC_APP_MODE !== "live" || !process.env.GEMINI_API_KEY;

export async function generateConceptClient(input: ConceptGenerationInput): Promise<GeneratedConcept> {
  let result;
  if (isDemo || typeof window !== "undefined") {
    const provider = new DemoProvider();
    result = await provider.generateConcept(input);
  } else {
    const provider = new GeminiProvider(process.env.GEMINI_API_KEY || "");
    result = await provider.generateConcept(input);
  }

  return {
    ...result,
    id: generateId(),
    consultationId: input.preferenceProfile.consultationId || "",
    projectId: input.preferenceProfile.projectId || "",
    savedToProject: false,
    createdAt: new Date(),
  };
}

export async function analyzeFloorPlanClient(input: FloorPlanInput) {
  if (isDemo || typeof window !== "undefined") {
    const provider = new DemoProvider();
    return provider.analyzeFloorPlan(input);
  } else {
    const provider = new GeminiProvider(process.env.GEMINI_API_KEY || "");
    return provider.analyzeFloorPlan(input);
  }
}

export async function generateSummaryClient(clientName: string, data: any) {
  const provider = new DemoProvider();
  return provider.generateSummaryText(clientName, data);
}

export async function searchLibraryClient(room?: RoomType, element?: string, styles?: DesignStyle[]) {
  const results = DEMO_LIBRARY_ITEMS.filter((item) => {
    const roomMatch = !room || item.room === room;
    const styleMatch = !styles?.length || styles.some((s) => item.style.includes(s));
    const elementMatch = !element || item.element?.toLowerCase().includes(element.toLowerCase());
    return roomMatch || styleMatch || elementMatch;
  });
  return results;
}

export async function searchReferencesClient() {
  await new Promise((r) => setTimeout(r, 600));
  return DEMO_REFERENCES;
}
