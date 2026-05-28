// ============================================================
// src/lib/binance/ws.ts  —  reemplazado por Finnhub WebSocket
// ============================================================
//
// Finnhub WS envía trades en tiempo real, NO velas completas.
// Este módulo:
//  1. Mantiene la misma interfaz pública que tenía el ws.ts de Binance.
//  2. Convierte los trades entrantes en actualizaciones de vela (kline).
//  3. Para el watchlist usa polling liviano cada 15s (más estable que WS multi-símbolo).
//
// ─────────────────────────────────────────────────────────────

import type { Candle, Ticker24h, Timeframe } from "./types";

const TOKEN = process.env.NEXT_PUBLIC_FINNHUB_KEY;
const WS_URL = `wss://ws.finnhub.io?token=${TOKEN}`;

// ── Tipos internos ────────────────────────────────────────────

interface FinnhubTrade {
  p: number; // price
  s: string; // symbol
  t: number; // timestamp ms
  v: number; // volume
}

interface FinnhubMessage {
  type: string;
  data?: FinnhubTrade[];
}

// Segundos por intervalo para construir el "time" de la vela actual
const INTERVAL_SECONDS: Record<Timeframe, number> = {
  "1m":  60,
  "3m":  180,
  "5m":  300,
  "15m": 900,
  "30m": 1800,
  "1h":  3600,
  "2h":  7200,
  "4h":  14400,
  "6h":  21600,
  "8h":  28800,
  "12h": 43200,
  "1d":  86400,
  "3d":  259200,
  "1w":  604800,
  "1M":  2592000,
};

// ── Estado global del WebSocket (singleton) ───────────────────

let socket: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectDelay = 1000;

// Suscripciones activas para el chart (un símbolo a la vez)
let chartSymbol: string | null   = null;
let chartInterval: Timeframe | null = null;
let chartCallback: ((c: Candle) => void) | null = null;

// Vela "en construcción" para el símbolo del chart
let currentCandle: Candle | null = null;

// Suscripciones activas para tickers del watchlist
const tickerCallbacks = new Map<string, (t: Ticker24h) => void>();
const lastTrades      = new Map<string, number>(); // symbol → último precio visto

// ── WebSocket lifecycle ───────────────────────────────────────

function connect() {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return;
  }

  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    reconnectDelay = 1000;
    // Re-suscribir todo lo que estaba activo
    if (chartSymbol) wsSubscribe(chartSymbol);
    for (const sym of tickerCallbacks.keys()) wsSubscribe(sym);
  };

  socket.onmessage = (event: MessageEvent) => {
    try {
      const msg: FinnhubMessage = JSON.parse(event.data as string);
      if (msg.type !== "trade" || !msg.data) return;

      for (const trade of msg.data) {
        handleTrade(trade);
      }
    } catch {
      // mensaje malformado — ignorar
    }
  };

  socket.onerror = () => {
    socket?.close();
  };

  socket.onclose = () => {
    scheduleReconnect();
  };
}

function scheduleReconnect() {
  if (reconnectTimer) return;
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    connect();
  }, reconnectDelay);
  reconnectDelay = Math.min(reconnectDelay * 2, 30_000); // backoff exponencial hasta 30s
}

function wsSubscribe(symbol: string) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "subscribe", symbol }));
  }
}

function wsUnsubscribe(symbol: string) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "unsubscribe", symbol }));
  }
}

// ── Procesamiento de trades ───────────────────────────────────

function handleTrade(trade: FinnhubTrade) {
  const { s: symbol, p: price, t: tsMs, v: volume } = trade;
  const tsSeconds = Math.floor(tsMs / 1000);

  // — Chart update —
  if (symbol === chartSymbol && chartInterval && chartCallback) {
    const barSeconds = INTERVAL_SECONDS[chartInterval];
    const barTime    = Math.floor(tsSeconds / barSeconds) * barSeconds;

    if (!currentCandle || currentCandle.time !== barTime) {
      // Nueva vela
      currentCandle = {
        time:    barTime,
        open:    price,
        high:    price,
        low:     price,
        close:   price,
        volume:  volume,
        isFinal: false,
      };
    } else {
      // Actualizar vela existente
      currentCandle = {
        ...currentCandle,
        high:    Math.max(currentCandle.high, price),
        low:     Math.min(currentCandle.low,  price),
        close:   price,
        volume:  currentCandle.volume + volume,
        isFinal: false,
      };
    }
    chartCallback(currentCandle);
  }

  // — Ticker update (watchlist) —
  if (tickerCallbacks.has(symbol)) {
    const prev = lastTrades.get(symbol) ?? price;
    lastTrades.set(symbol, price);
    const cb = tickerCallbacks.get(symbol);
    if (cb) {
      cb({
        symbol,
        lastPrice:          price,
        priceChange:        price - prev,
        priceChangePercent: prev !== 0 ? ((price - prev) / prev) * 100 : 0,
        highPrice:          0,
        lowPrice:           0,
        volume:             volume,
        quoteVolume:        0,
      });
    }
  }
}

// ── API pública ───────────────────────────────────────────────

/**
 * Suscribirse a actualizaciones de vela en tiempo real para el chart.
 * Reemplaza: subscribeKline(symbol, interval, callback)
 */
export function subscribeKline(
  symbol: string,
  interval: Timeframe,
  callback: (candle: Candle) => void,
): void {
  // Desuscribir símbolo anterior si cambió
  if (chartSymbol && chartSymbol !== symbol) {
    wsUnsubscribe(chartSymbol);
  }

  chartSymbol   = symbol.toUpperCase();
  chartInterval = interval;
  chartCallback = callback;
  currentCandle = null;

  connect();
  wsSubscribe(chartSymbol);
}

/**
 * Desuscribirse del stream del chart.
 */
export function unsubscribeKline(): void {
  if (chartSymbol) {
    wsUnsubscribe(chartSymbol);
    chartSymbol   = null;
    chartInterval = null;
    chartCallback = null;
    currentCandle = null;
  }
}

/**
 * Suscribirse a actualizaciones de precio para el watchlist.
 * Reemplaza: subscribeMiniTicker(symbol, callback)
 */
export function subscribeMiniTicker(
  symbol: string,
  callback: (ticker: Ticker24h) => void,
): void {
  const sym = symbol.toUpperCase();
  tickerCallbacks.set(sym, callback);
  connect();
  wsSubscribe(sym);
}

/**
 * Desuscribirse de un ticker del watchlist.
 */
export function unsubscribeMiniTicker(symbol: string): void {
  const sym = symbol.toUpperCase();
  wsUnsubscribe(sym);
  tickerCallbacks.delete(sym);
  lastTrades.delete(sym);
}

/**
 * Desuscribirse de todos los tickers (útil en cleanup de componentes).
 */
export function unsubscribeAllTickers(): void {
  for (const sym of tickerCallbacks.keys()) {
    wsUnsubscribe(sym);
  }
  tickerCallbacks.clear();
  lastTrades.clear();
}

/**
 * Cerrar completamente la conexión WebSocket.
 */
export function closeConnection(): void {
  unsubscribeKline();
  unsubscribeAllTickers();
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
  socket?.close();
  socket = null;
}
