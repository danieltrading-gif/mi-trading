import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json({ error: 'Falta el símbolo' }, { status: 400 });
  }

  try {
    // Obtenemos los datos fundamentales del activo
    const quote = await yahooFinance.quote(symbol);
    return NextResponse.json({ data: quote });
  } catch (error) {
    console.error("Error al obtener datos de Yahoo:", error);
    return NextResponse.json({ error: 'No se pudo obtener la información' }, { status: 500 });
  }
}
