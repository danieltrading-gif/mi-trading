import { NextResponse } from 'next/server';
// Usamos una importación más directa para evitar errores de módulos internos
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return NextResponse.json({ error: 'Falta el símbolo' }, { status: 400 });
  }

  try {
    // yahooFinance tiene una propiedad .quote que es la que necesitamos
    const quote = await yahooFinance.quote(symbol);
    return NextResponse.json({ data: quote });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}
