import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!symbol) return NextResponse.json({ error: 'Falta símbolo' }, { status: 400 });
  if (!apiKey) return NextResponse.json({ error: 'Falta configurar API KEY' }, { status: 500 });

  try {
    const res = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`);
    const data = await res.json();
    
    // Alpha Vantage suele devolver error si la API KEY es inválida o se agotó el límite
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: 'Error de conexión' }, { status: 500 });
  }
}
