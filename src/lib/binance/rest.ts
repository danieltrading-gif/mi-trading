import type { Candle, SymbolInfo, Ticker24h, Timeframe } from "./types";

const BASE_URL = "https://query1.finance.yahoo.com/v8/finance/chart";

export async function fetchKlines(
  symbol: string,
  interval: Timeframe,
  limit = 1000,
): Promise<Candle[]> {
  const intervalMap: Record<string, string> = {
    "1m": "1m", "5m": "5m", "15m": "15m", "1h": "1h", "4h": "4h", "1d": "1d", "1w": "1wk"
  };
  const tf = intervalMap[interval] || "1d";

  const url = `/api/yahoo?symbol=${symbol.toUpperCase()}&interval=${tf}&range=3mo`;
  const res = await fetch(url, { cache: "no-store" });
  
  if (!res.ok) throw new Error(`Error al cargar datos: ${res.status}`);
  const json = await res.json();
  const result = json.chart?.result?.[0];
  
  if (!result) return [];

  const quotes = result.indicators.quote[0];
  const timestamps = result.timestamp || [];

  return timestamps.map((time: number, i: number) => ({
    time,
    open: quotes.open[i] || quotes.close[i],
    high: quotes.high[i] || quotes.close[i],
    low: quotes.low[i] || quotes.close[i],
    close: quotes.close[i],
    volume: quotes.volume[i] || 0,
    isFinal: true,
  })).filter((c: any) => c.open !== undefined && c.close !== undefined);
}

export async function fetchTicker24h(symbol: string): Promise<Ticker24h> {
  return {
    symbol: symbol.toUpperCase(),
    lastPrice: 0,
    priceChange: 0,
    priceChangePercent: 0,
    highPrice: 0,
    lowPrice: 0,
    volume: 0,
    quoteVolume: 0,
  };
}

export async function fetchTickers24h(symbols: string[]): Promise<Ticker24h[]> {
  return symbols.map(s => ({
    symbol: s.toUpperCase(),
    lastPrice: 0,
    priceChange: 0,
    priceChangePercent: 0,
    highPrice: 0,
    lowPrice: 0,
    volume: 0,
    quoteVolume: 0,
  }));
}

export async function fetchExchangeSymbols(): Promise<SymbolInfo[]> {
  return [
    { symbol: "AAPL", baseAsset: "Apple Inc.", quoteAsset: "USD", status: "TRADING" },
    { symbol: "TSLA", baseAsset: "Tesla Inc.", quoteAsset: "USD", status: "TRADING" },
    { symbol: "NVDA", baseAsset: "NVIDIA Corp.", quoteAsset: "USD", status: "TRADING" },
    { symbol: "MSFT", baseAsset: "Microsoft Corp.", quoteAsset: "USD", status: "TRADING" },
    { symbol: "AMZN", baseAsset: "Amazon.com Inc.", quoteAsset: "USD", status: "TRADING" },
    { symbol: "GOOGL", baseAsset: "Alphabet Inc.", quoteAsset: "USD", status: "TRADING" },
    { symbol: "META", baseAsset: "Meta Platforms", quoteAsset: "USD", status: "TRADING" },
  ];
}
