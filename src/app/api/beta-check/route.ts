import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { code } = await req.json();
  const valid = typeof code === "string" && code.trim() === process.env.BETA_ACCESS_CODE;
  return Response.json({ valid });
}
