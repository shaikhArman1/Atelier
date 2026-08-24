import { NextResponse } from "next/server";
import { DEMO_REFERENCES } from "@/lib/demo/demoData";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const isDemo = !process.env.GOOGLE_SEARCH_API_KEY || process.env.NEXT_PUBLIC_APP_MODE !== "live";

    if (isDemo) {
      await new Promise((r) => setTimeout(r, 1000));
      return NextResponse.json({ success: true, results: DEMO_REFERENCES, isDemo: true });
    }

    // Real Google Custom Search implementation would go here
    const query = `${body.styles?.join(" ")} ${body.room?.replace(/_/g, " ")} ${body.element} interior design ${body.materials?.join(" ")}`;
    const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&searchType=image&num=10`;
    const res = await fetch(url);
    const data = await res.json();

    const results = (data.items || []).map((item: any, i: number) => ({
      id: `ext-${i}`,
      imageUrl: item.link,
      title: item.title,
      sourceUrl: item.image?.contextLink,
      source: "external",
      relevanceScore: 1 - i * 0.05,
    }));

    return NextResponse.json({ success: true, results, isDemo: false });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Reference search failed." }, { status: 500 });
  }
}
