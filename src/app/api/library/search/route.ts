import { NextResponse } from "next/server";
import { DEMO_LIBRARY_ITEMS } from "@/lib/demo/demoData";
import type { RoomType, DesignStyle } from "@/types";

export async function POST(req: Request) {
  try {
    const { room, element, styles, materials, palette } = await req.json();
    
    // Demo mode: filter local library items
    const results = DEMO_LIBRARY_ITEMS.filter((item) => {
      const roomMatch = !room || item.room === room;
      const styleMatch = !styles?.length || styles.some((s: DesignStyle) => item.style.includes(s));
      const elementMatch = !element || item.element?.toLowerCase().includes(element.toLowerCase());
      return roomMatch || styleMatch || elementMatch;
    }).sort(() => Math.random() - 0.5);

    return NextResponse.json({ success: true, results, total: results.length });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Library search failed." }, { status: 500 });
  }
}
