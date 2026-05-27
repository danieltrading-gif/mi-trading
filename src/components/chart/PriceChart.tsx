import React, { useEffect, useRef, useState } from "react";
import { createChart, IChartApi, ISeriesApi, UTCTimestamp } from "lightweight-charts";

interface PriceChartProps {
  symbol: string;
}

export default function PriceChart({ symbol }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // CREACIÓN DEL GRÁFICO CON FONDO BLANCO (TEMA CLARO TRADINGVIEW)
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: {
        background: { color: "#ffffff" }, // Fondo blanco puro
        textColor: "#1f2937",            // Texto gris oscuro/negro
      },
      grid: {
        vertLines: { color: "#f3f4f6" }, // Líneas verticales muy suaves
        horzLines: { color: "#f3f4f6" }, // Líneas horizontales muy suaves
      },
      rightPriceScale: {
        borderColor: "#e5e7eb",          // Borde de la escala de precios
      },
      timeScale: {
        borderColor: "#e5e7eb",          // Borde de la escala de tiempo
        timeVisible: true,
      },
    });

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderUpColor: "#26a69a",
      borderDownColor: "#ef5350",
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    // FUNCIÓN PARA SOLICITAR LOS DATOS REALES DE YAHOO FINANCE
    const fetchChartData = async () => {
      try {
        setLoading(true);
        // Llamada a tu API interna que conecta con Yahoo Finance
        const res = await fetch(`/api/stocks/candles?symbol=${symbol}&interval=1d`);
        const result = await res.json();

        if (result && result.data) {
          const formattedData = result.data.map((d: any) => ({
            time: (d.time / 1000) as UTCTimestamp,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
          }));

          candlestickSeries.setData(formattedData);
          chart.timeScale().fitContent();
        }
      } catch (err) {
        console.error("Error cargando los datos de Yahoo Finance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();

    // Ajustar tamaño si cambia la pantalla
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
  }, [symbol]);

  return (
    <div className="flex-1 bg-white p-4 relative flex flex-col h-full border border-gray-100 rounded-lg shadow-sm">
      {/* ENCABEZADO CLARO ESTILO TRADINGVIEW PROFESIONAL */}
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

      {/* Contenedor donde la librería dibuja las velas */}
      <div ref={chartContainerRef} className="w-full flex-1" />
    </div>
  );
}
