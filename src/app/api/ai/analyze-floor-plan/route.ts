import { NextResponse } from "next/server";
import { DemoProvider, GeminiProvider } from "@/providers/GeminiProvider";
import type { FloorPlanInput } from "@/types";

export async function POST(req: Request) {
  try {
    const body: FloorPlanInput = await req.json();
    const isDemo = process.env.NEXT_PUBLIC_APP_MODE !== "live" || !process.env.GEMINI_API_KEY;

    let analysis;
    if (isDemo) {
      const provider = new DemoProvider();
      analysis = await provider.analyzeFloorPlan(body);
    } else {
      const provider = new GeminiProvider(process.env.GEMINI_API_KEY!);
      analysis = await provider.analyzeFloorPlan(body);
    }

    return NextResponse.json({ success: true, analysis, isDemo });
  } catch (err) {
    console.error("Floor plan analysis error:", err);
    return NextResponse.json(
      { success: false, error: "Floor plan analysis failed. You can continue without floor plan analysis." },
      { status: 500 }
    );
  }
}
