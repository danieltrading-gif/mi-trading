"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";

interface PriceChartProps {
  symbol: string;
}

export default function PriceChart({ symbol }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. EFECTO PRINCIPAL: Dibuja el gráfico una sola vez al arrancar (Protegido contra renderizado de servidor)
  useEffect(() => {
    if (typeof window === "undefined" || !chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: { background: { color: "#ffffff" }, textColor: "#1f2937" },
      grid: { vertLines: { color: "#f3f4f6" }, horzLines: { color: "#f3f4f6" } },
      rightPriceScale: { borderColor: "#e5e7eb" },
      timeScale: { borderColor: "#e5e7eb", timeVisible: true },
    });

    const candlestickSeries = chart.addSeries("Candlestick" as any, {
      upColor: "#26a69a", downColor: "#ef5350",
      borderUpColor: "#26a69a", borderDownColor: "#ef5350",
      wickUpColor: "#26a69a", wickDownColor: "#ef5350",
    });

    chartRef.current = chart;
    seriesRef.current = candlestickSeries;

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  // 2. EFECTO DE DATOS: Busca los precios en Yahoo de forma aislada sin romper la pantalla
  useEffect(() => {
    if (typeof window === "undefined" || !seriesRef.current || !chartRef.current) return;

    const fetchChartData = async () => {
      try {
        setLoading(true);
        
        const res = await fetch(`/api/yahoo?symbol=${symbol}&interval=1d`);
        if (!res.ok) return;
        
        const result = await res.json();

        if (result?.chart?.result?.[0]) {
          const chartResult = result.chart.result[0];
          const timestamps = chartResult.timestamp;
          const quotes = chartResult.indicators.quote[0];

          if (timestamps && quotes?.open) {
            const formattedData = timestamps
              .map((time: number, index: number) => ({
                time: time as any,
                open: quotes.open[index] ? Number(quotes.open[index]) : null,
                high: quotes.high[index] ? Number(quotes.high[index]) : null,
                low: quotes.low[index] ? Number(quotes.low[index]) : null,
                close: quotes.close[index] ? Number(quotes.close[index]) : null,
              }))
              .filter((d: any) => d.open !== null && d.high !== null && d.low !== null && d.close !== null);

            if (formattedData.length > 0) {
              seriesRef.current.setData(formattedData);
              chartRef.current.timeScale().fitContent();
              setError(null);
            }
          }
        }
      } catch (err) {
        console.error("Error silencioso en Yahoo Finance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [symbol]);

  return (
    <div className="flex-1 bg-white p-4 relative flex flex-col h-full border border-gray-100 rounded-lg shadow-sm">
      <div className="flex items-center space-x-3 mb-4 select-none border-b border-gray-100 pb-2">
        <span className="text-xl font-bold text-gray-900 tracking-tight">{symbol}</span>
        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">1D</span>
        <span className="text-xs text-gray-400 font-medium">Yahoo Finance Market</span>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
          <span className="text-sm font-medium text-gray-500 animate-pulse">Sincronizando con Wall Street...</span>
        </div>
      )}

      <div ref={chartContainerRef} className="w-full flex-1" />
    </div>
  );
}
