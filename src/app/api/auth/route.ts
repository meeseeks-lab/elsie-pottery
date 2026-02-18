import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  
  if (username === "elsie" && password === "ytreza#") {
    const token = Buffer.from(`${Date.now()}:elsie:authenticated`).toString("base64");
    return NextResponse.json({ success: true, token });
  }
  
  return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
}
