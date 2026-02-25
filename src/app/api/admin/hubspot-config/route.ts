import { NextRequest, NextResponse } from "next/server";
import { readHubSpotConfig, writeHubSpotConfig } from "@/lib/storage";
import { testConnection } from "@/lib/hubspot";

export async function GET() {
  try {
    const config = await readHubSpotConfig();
    // Return masked token for security
    return NextResponse.json({
      configured: !!config.accessToken,
      tokenPreview: config.accessToken
        ? `${config.accessToken.slice(0, 8)}...${config.accessToken.slice(-4)}`
        : "",
    });
  } catch {
    return NextResponse.json(
      { error: "Error al leer la configuración" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const token = typeof body.accessToken === "string" ? body.accessToken.trim() : "";

    if (!token) {
      return NextResponse.json(
        { error: "El token es requerido" },
        { status: 400 }
      );
    }

    // Test the token before saving
    const result = await testConnection(token);
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error || "Token inválido" },
        { status: 400 }
      );
    }

    await writeHubSpotConfig({ accessToken: token });

    return NextResponse.json({
      success: true,
      total: result.total,
    });
  } catch {
    return NextResponse.json(
      { error: "Error al guardar la configuración" },
      { status: 500 }
    );
  }
}

export async function POST() {
  // Test current connection
  try {
    const config = await readHubSpotConfig();
    if (!config.accessToken) {
      return NextResponse.json(
        { error: "No hay token configurado" },
        { status: 400 }
      );
    }

    const result = await testConnection(config.accessToken);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Error al probar la conexión" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await writeHubSpotConfig({ accessToken: "" });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Error al desconectar" },
      { status: 500 }
    );
  }
}
