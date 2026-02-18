import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("elsie_pieces")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  // Map image_url to image for frontend compatibility
  const mapped = (data || []).map((p: Record<string, unknown>) => ({
    ...p,
    image: p.image_url,
  }));
  return NextResponse.json(mapped);
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const piece = await req.json();

  const { data, error } = await supabaseAdmin
    .from("elsie_pieces")
    .insert({
      title: piece.title,
      description: piece.description,
      category: piece.category,
      status: piece.status,
      date: piece.date || new Date().toISOString().split("T")[0],
      image_url: piece.image_url || piece.image,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, piece: data });
}
