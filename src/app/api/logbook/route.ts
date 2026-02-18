import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "public", "data", "logbook.json");

async function getEntries() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET() {
  const entries = await getEntries();
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entry = await req.json();
  const entries = await getEntries();

  entry.id = `log-${Date.now()}`;
  entry.createdAt = new Date().toISOString();
  entries.unshift(entry);

  await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2));
  return NextResponse.json({ success: true, entry });
}

export async function PUT(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const updated = await req.json();
  const entries = await getEntries();
  const idx = entries.findIndex((e: { id: string }) => e.id === updated.id);
  if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

  entries[idx] = { ...entries[idx], ...updated };
  await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2));
  return NextResponse.json({ success: true, entry: entries[idx] });
}

export async function DELETE(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  let entries = await getEntries();
  entries = entries.filter((e: { id: string }) => e.id !== id);
  await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2));
  return NextResponse.json({ success: true });
}
