import { NextRequest, NextResponse } from "next/server";
import { supabase, supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("elsie_logbook")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const entry = await req.json();

  const { data, error } = await supabaseAdmin
    .from("elsie_logbook")
    .insert({
      date: entry.date,
      title: entry.title,
      clay_type: entry.clayType || entry.clay_type,
      custom_clay_type: entry.customClayType || entry.custom_clay_type,
      clay_brand: entry.clayBrand || entry.clay_brand,
      techniques: entry.techniques,
      forming_details: entry.formingDetails || entry.forming_details,
      stage: entry.stage,
      firing_type: entry.firingType || entry.firing_type,
      firing_temp: entry.firingTemp || entry.firing_temp,
      firing_temp_unit: entry.firingTempUnit || entry.firing_temp_unit,
      firing_schedule: entry.firingSchedule || entry.firing_schedule,
      glazes: entry.glazes,
      glaze_application: entry.glazeApplication || entry.glaze_application,
      glaze_coats: entry.glazeCoats || entry.glaze_coats,
      underglaze: entry.underglaze,
      room_temp: entry.roomTemp || entry.room_temp,
      room_humidity: entry.roomHumidity || entry.room_humidity,
      drying_time: entry.dryingTime || entry.drying_time,
      kiln_position: entry.kilnPosition || entry.kiln_position,
      outcome_notes: entry.outcomeNotes || entry.outcome_notes,
      mood: entry.mood,
      learnings: entry.learnings,
      linked_piece_id: entry.linkedPieceId || entry.linked_piece_id,
      photos: entry.photos,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, entry: data });
}

export async function PUT(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const updated = await req.json();
  const { id, ...fields } = updated;

  const { data, error } = await supabaseAdmin
    .from("elsie_logbook")
    .update(fields)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, entry: data });
}

export async function DELETE(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();

  const { error } = await supabaseAdmin
    .from("elsie_logbook")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
