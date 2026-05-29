import { NextResponse } from 'next/server';
import yahooFinance from 'yahoo-finance2';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) return NextResponse.json({ error: 'Falta símbolo' }, { status: 400 });

  try {
    const result = await yahooFinance.quote(symbol);
    return NextResponse.json({ data: result });
  } catch (err) {
    return NextResponse.json({ error: 'Error de servidor' }, { status: 500 });
  }
}
