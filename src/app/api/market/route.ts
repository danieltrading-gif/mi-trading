import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!symbol) return NextResponse.json({ error: 'Falta símbolo' }, { status: 400 });
  
  // URL de prueba directa
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    // Devolvemos el dato tal cual viene de Alpha Vantage
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Error de conexión' }, { status: 500 });
  }
}
