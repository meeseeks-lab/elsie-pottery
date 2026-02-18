import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "public", "data", "pieces.json");

async function getPieces() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET() {
  const pieces = await getPieces();
  return NextResponse.json(pieces);
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const piece = await req.json();
  const pieces = await getPieces();
  
  piece.id = `${piece.category}-${Date.now()}`;
  piece.date = piece.date || new Date().toISOString().split("T")[0];
  pieces.unshift(piece);
  
  await fs.writeFile(DATA_FILE, JSON.stringify(pieces, null, 2));
  return NextResponse.json({ success: true, piece });
}
