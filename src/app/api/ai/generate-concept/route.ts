import { NextResponse } from "next/server";
import { DemoProvider, GeminiProvider } from "@/providers/GeminiProvider";
import type { ConceptGenerationInput } from "@/types";
import { generateId } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body: ConceptGenerationInput = await req.json();
    const isDemo = process.env.NEXT_PUBLIC_APP_MODE !== "live" || !process.env.GEMINI_API_KEY;

    let result;
    if (isDemo) {
      const provider = new DemoProvider();
      result = await provider.generateConcept(body);
    } else {
      const provider = new GeminiProvider(process.env.GEMINI_API_KEY!);
      result = await provider.generateConcept(body);
    }

    const concept = {
      ...result,
      id: generateId(),
      consultationId: body.preferenceProfile.consultationId || "",
      projectId: body.preferenceProfile.projectId || "",
      savedToProject: false,
      createdAt: new Date(),
    };

    return NextResponse.json({ success: true, concept, isDemo });
  } catch (err) {
    console.error("Concept generation error:", err);
    return NextResponse.json({ success: false, error: "Concept generation failed. Please try again." }, { status: 500 });
  }
}
