import { NextResponse } from "next/server";
import { DemoProvider } from "@/providers/GeminiProvider";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const isDemo = process.env.NEXT_PUBLIC_APP_MODE !== "live" || !process.env.GEMINI_API_KEY;

    let summary: string;
    if (isDemo) {
      const provider = new DemoProvider();
      summary = await provider.generateSummaryText(body.clientName, body);
    } else {
      const { GeminiProvider } = await import("@/providers/GeminiProvider");
      const { buildSummaryPrompt } = await import("@/prompts");
      const provider = new GeminiProvider(process.env.GEMINI_API_KEY!);
      const prompt = buildSummaryPrompt(body);
      summary = await provider.generateSummaryText(prompt);
    }

    return NextResponse.json({ success: true, summary, isDemo });
  } catch (err) {
    console.error("Summary generation error:", err);
    return NextResponse.json({ success: false, error: "Summary generation failed." }, { status: 500 });
  }
}
