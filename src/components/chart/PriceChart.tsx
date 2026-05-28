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

        // BLINDAJE: Verificamos con lupa que los datos existan antes de procesar
        if (result && Array.isArray(result.data) && result.data.length > 0) {
          const formattedData = result.data.map((d: any) => ({
            time: (d.time / 1000) as any,
            open: Number(d.open),
            high: Number(d.high),
            low: Number(d.low),
            close: Number(d.close),
          }));

          candlestickSeries.setData(formattedData);
          chart.timeScale().fitContent();
        } else {
          throw new Error("Formato de datos no válido o vacío");
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
          <span className="text-xs text-gray-400 text-center max-w-xs">La aplicación funciona bien, pero no pudimos traer los precios de la API de Yahoo.</span>
        </div>
      )}

      <div ref={chartContainerRef} className="w-full flex-1" />
    </div>
  );
}
