import { NextResponse } from "next/server";
import { getPortfolio } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getPortfolio();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Failed to load portfolio data" }, { status: 500 });
  }
}
