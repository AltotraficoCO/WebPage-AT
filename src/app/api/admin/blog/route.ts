import { NextResponse } from "next/server";
import { fetchBlogPosts } from "@/lib/hubspot";

export async function GET() {
  try {
    const data = await fetchBlogPosts();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error al conectar con el servicio de blog" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const data = await fetchBlogPosts();
    return NextResponse.json({ success: true, total: data.total });
  } catch {
    return NextResponse.json(
      { error: "Error al sincronizar" },
      { status: 500 }
    );
  }
}
