import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("elsie_content")
    .select("id, value, updated_at");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const decoded = Buffer.from(token, "base64").toString();
    if (!decoded.includes(":elsie:authenticated")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updates: { id: string; value: string }[] = await req.json();
  const rows = updates.map((u) => ({
    id: u.id,
    value: u.value,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabaseAdmin
    .from("elsie_content")
    .upsert(rows, { onConflict: "id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
