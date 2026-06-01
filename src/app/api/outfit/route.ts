import { NextResponse } from "next/server";

// TODO: wire up Clerk auth — verify session and get userId
// TODO: wire up Supabase — fetch user's wardrobe items with image URLs
// TODO: check usage quota before calling Anthropic
// TODO: wire up Anthropic claude-sonnet-4-6 with vision

export async function POST() {
  try {
    // const { userId } = await req.json();

    // Placeholder response — replace with real Claude vision call
    const result = {
      outfitItems: ["OVERSIZED BLAZER", "SLIM TROUSERS", "WHITE TEE", "LEATHER LOAFERS"],
      reasoning:
        "A clean, editorial combination that balances the oversized blazer with slim trousers. The white tee grounds the look without competing. Monochrome keeps it sharp.",
      itemIds: [] as string[],
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("[outfit/route]", error);
    return NextResponse.json({ error: "Failed to generate outfit" }, { status: 500 });
  }
}
