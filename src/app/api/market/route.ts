import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!symbol) return NextResponse.json({ error: 'Falta símbolo' }, { status: 400 });
  if (!apiKey) return NextResponse.json({ error: 'Falta configurar API KEY' }, { status: 500 });
  
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    // Verificamos si Alpha Vantage nos envió un mensaje de error en el cuerpo
    if (data["Note"] || data["Error Message"]) {
      return NextResponse.json({ error: data["Note"] || data["Error Message"] }, { status: 429 });
    }
    
    return NextResponse.json({ data: data });
  } catch (err) {
    return NextResponse.json({ error: 'Error de conexión con Alpha Vantage' }, { status: 500 });
  }
}
