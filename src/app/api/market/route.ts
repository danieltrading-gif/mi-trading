import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol') || '';
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  // Detectamos si es Crypto o Acción por el nombre
  const isCrypto = symbol.includes('-USD');
  const functionName = isCrypto ? 'CURRENCY_EXCHANGE_RATE' : 'GLOBAL_QUOTE';
  
  // URL dinámica según el tipo
  const url = isCrypto 
    ? `https://www.alphavantage.co/query?function=${functionName}&from_currency=${symbol.split('-')[0]}&to_currency=USD&apikey=${apiKey}`
    : `https://www.alphavantage.co/query?function=${functionName}&symbol=${symbol}&apikey=${apiKey}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json({ data: data });
  } catch (err) {
    return NextResponse.json({ error: 'Error' }, { status: 500 });
  }
}
