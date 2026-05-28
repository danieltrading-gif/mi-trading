// ============================================================
// src/lib/binance/rest.ts  —  reemplazado por Finnhub
// ============================================================
import type { Candle, SymbolInfo, Ticker24h, Timeframe } from "./types";

const TOKEN = process.env.NEXT_PUBLIC_FINNHUB_KEY || "";
const BASE  = "https://finnhub.io/api/v1";

// Mapeo de timeframes de la app → resoluciones de Finnhub
const RESOLUTION_MAP: Record<Timeframe, string> = {
  "1m":  "1",
  "3m":  "3",
  "5m":  "5",
  "15m": "15",
  "30m": "30",
  "1h":  "60",
  "2h":  "120",
  "4h":  "240",
  "6h":  "360",
  "8h":  "480",
  "12h": "720",
  "1d":  "D",
  "3d":  "D",    // Agregado
  "1w":  "W",
  "1M":  "M",    // Agregado
};

// Segundos por barra para calcular el rango "from"
const SECONDS_PER_BAR: Record<string, number> = {
  "1": 60, "5": 300, "15": 900, "60": 3600,
  "240": 14400, "D": 86400, "W": 604800,
};

// ── Velas históricas ──────────────────────────────────────────
export async function fetchKlines(
  symbol: string,
  interval: Timeframe,
  limit = 500,
): Promise<Candle[]> {
  let resolution = RESOLUTION_MAP[interval] ?? "D";

  const to   = Math.floor(Date.now() / 1000);
  const from = to - (SECONDS_PER_BAR[resolution] ?? 86400) * limit;

  const url = `${BASE}/stock/candle?symbol=${encodeURIComponent(symbol)}&resolution=${resolution}&from=${from}&to=${to}&token=${TOKEN}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    // Si 4h no está disponible, reintentamos con 60m
    if (resolution === "240") {
      return fetchKlines(symbol, "1h", limit);
    }
    throw new Error(`Finnhub candle error ${res.status}`);
  }

  const data = await res.json();

  // "no_data" o símbolo inválido
  if (data.s !== "ok" || !Array.isArray(data.t)) return [];

  return (data.t as number[]).map((time: number, i: number) => ({
    time,                // Unix timestamp en segundos  ✓ lightweight-charts lo acepta así
    open:   data.o[i],
    high:   data.h[i],
    low:    data.l[i],
    close:  data.c[i],
    volume: data.v[i],
    isFinal: true,
  }));
}

// ── Quote individual ──────────────────────────────────────────
export async function fetchTicker24h(symbol: string): Promise<Ticker24h> {
  const res = await fetch(`${BASE}/quote?symbol=${encodeURIComponent(symbol)}&token=${TOKEN}`);
  if (!res.ok) throw new Error(`Finnhub quote error ${res.status}`);
  const q = await res.json();

  return {
    symbol,
    lastPrice:          q.c  ?? 0,   // current price
    priceChange:        q.d  ?? 0,   // change
    priceChangePercent: q.dp ?? 0,   // change %
    highPrice:          q.h  ?? 0,   // high of day
    lowPrice:           q.l  ?? 0,   // low of day
    volume:             0,           // Finnhub /quote no devuelve volumen; usar /stock/candle si lo necesitás
    quoteVolume:        0,
  };
}

// ── Quotes de múltiples símbolos (watchlist) ──────────────────
export async function fetchTickers24h(symbols: string[]): Promise<Ticker24h[]> {
  // Llamadas en paralelo con un pequeño throttle para no exceder rate limit (60 req/min gratis)
  const BATCH = 10;
  const results: Ticker24h[] = [];

  for (let i = 0; i < symbols.length; i += BATCH) {
    const batch = symbols.slice(i, i + BATCH);
    const settled = await Promise.allSettled(batch.map(fetchTicker24h));
    for (const r of settled) {
      if (r.status === "fulfilled") results.push(r.value);
    }
    if (i + BATCH < symbols.length) {
      await new Promise(resolve => setTimeout(resolve, 200)); // 200 ms entre batches
    }
  }

  return results;
}

// ── Lista de símbolos disponibles ─────────────────────────────
// Podés ampliar esta lista libremente; son los tickers de acciones
// que aparecerán en el buscador de la app.
export async function fetchExchangeSymbols(): Promise<SymbolInfo[]> {
  return [
    { symbol: "AAPL",  baseAsset: "Apple Inc.",              quoteAsset: "USD", status: "TRADING" },
    { symbol: "MSFT",  baseAsset: "Microsoft Corp.",          quoteAsset: "USD", status: "TRADING" },
    { symbol: "NVDA",  baseAsset: "NVIDIA Corp.",             quoteAsset: "USD", status: "TRADING" },
    { symbol: "TSLA",  baseAsset: "Tesla Inc.",               quoteAsset: "USD", status: "TRADING" },
    { symbol: "GOOGL", baseAsset: "Alphabet Inc. (A)",        quoteAsset: "USD", status: "TRADING" },
    { symbol: "AMZN",  baseAsset: "Amazon.com Inc.",          quoteAsset: "USD", status: "TRADING" },
    { symbol: "META",  baseAsset: "Meta Platforms",           quoteAsset: "USD", status: "TRADING" },
    { symbol: "AMD",   baseAsset: "Advanced Micro Devices",   quoteAsset: "USD", status: "TRADING" },
    { symbol: "NFLX",  baseAsset: "Netflix Inc.",             quoteAsset: "USD", status: "TRADING" },
    { symbol: "ORCL",  baseAsset: "Oracle Corp.",             quoteAsset: "USD", status: "TRADING" },
    { symbol: "CRM",   baseAsset: "Salesforce Inc.",          quoteAsset: "USD", status: "TRADING" },
    { symbol: "ADBE",  baseAsset: "Adobe Inc.",               quoteAsset: "USD", status: "TRADING" },
    { symbol: "INTC",  baseAsset: "Intel Corp.",              quoteAsset: "USD", status: "TRADING" },
    { symbol: "QCOM",  baseAsset: "Qualcomm Inc.",            quoteAsset: "USD", status: "TRADING" },
    { symbol: "SPY",   baseAsset: "SPDR S&P 500 ETF",         quoteAsset: "USD", status: "TRADING" },
    { symbol: "QQQ",   baseAsset: "Invesco QQQ Trust",        quoteAsset: "USD", status: "TRADING" },
    { symbol: "DIA",   baseAsset: "SPDR Dow Jones ETF",       quoteAsset: "USD", status: "TRADING" },
    { symbol: "GLD",   baseAsset: "SPDR Gold Shares",         quoteAsset: "USD", status: "TRADING" },
    { symbol: "BRK.B", baseAsset: "Berkshire Hathaway B",     quoteAsset: "USD", status: "TRADING" },
    { symbol: "JPM",   baseAsset: "JPMorgan Chase",           quoteAsset: "USD", status: "TRADING" },
  ];
}
















