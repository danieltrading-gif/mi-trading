import React, { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";

interface PriceChartProps {
  symbol: string;
}

export default function PriceChart({ symbol }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#1f2937",
      },
      grid: {
        vertLines: { color: "#f3f4f6" },
        horzLines: { color: "#f3f4f6" },
      },
      rightPriceScale: { borderColor: "#e5e7eb" },
      timeScale: { borderColor: "#e5e7eb", timeVisible: true },
    });

    const candlestickSeries = chart.addSeries("Candlestick" as any, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderUpColor: "#26a69a",
      borderDownColor: "#ef5350",
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    const fetchChartData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(`/api/yahoo?symbol=${symbol}&interval=1d`);
        if (!res.ok) throw new Error("Error en la respuesta del servidor");
        
        const result = await res.json();

        // CORRECCIÓN: Leemos la estructura real y directa de tu API de Yahoo
        if (result && result.chart && result.chart.result && result.chart.result[0]) {
          const chartResult = result.chart.result[0];
          const timestamps = chartResult.timestamp;
          const quotes = chartResult.indicators.quote[0];

          if (timestamps && quotes && quotes.open) {
            const formattedData = timestamps.map((time: number, index: number) => ({
              time: time as any, // Yahoo ya viene en segundos, NO se divide por 1000
              open: Number(quotes.open[index]),
              high: Number(quotes.high[index]),
              low: Number(quotes.low[index]),
              close: Number(quotes.close[index]),
            })).filter((d: any) => d.open && d.high && d.low && d.close); // Limpia datos nulos de días feriados

            candlestickSeries.setData(formattedData);
            chart.timeScale().fitContent();
          } else {
            throw new Error("Datos de cotización incompletos");
          }
        } else {
          throw new Error("Formato de respuesta de Yahoo no válido");
        }
      } catch (err: any) {
        console.error("Error cargando Yahoo Finance:", err);
        setError(err.message || "Error al conectar con el mercado");
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
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

      {error && !loading && (
        <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center z-40 p-4">
          <span className="text-sm font-semibold text-red-500 mb-1">⚠️ {error}</span>
          <span className="text-xs text-gray-400 text-center">No pudimos procesar el formato de los precios.</span>
        </div>
      )}

      <div ref={chartContainerRef} className="w-full flex-1" />
    </div>
  );
}
