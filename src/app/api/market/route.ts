import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Aquí pondremos la lógica de Alpha Vantage apenas tengas tu API Key
  return NextResponse.json({ message: "API lista para conectar" });
}
