import { NextRequest, NextResponse } from "next/server";

// TODO: wire up Clerk auth
// TODO: fetch user wardrobe from Supabase for context
// TODO: check usage quota
// TODO: call Anthropic claude-sonnet-4-6 with image or scraped product data

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, productUrl } = await req.json();

    if (!imageUrl && !productUrl) {
      return NextResponse.json({ error: "Provide imageUrl or productUrl" }, { status: 400 });
    }

    // Placeholder response
    const result = {
      verdict: "YES",
      confidence: "HIGH",
      reasoning:
        "This piece complements your existing wardrobe well. The neutral tone integrates with your dominant palette, and the silhouette fills a gap in your outerwear.",
      warnings: [] as string[],
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("[checker/route]", error);
    return NextResponse.json({ error: "Failed to analyse item" }, { status: 500 });
  }
}
