"use client";

import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

export default function PriceChart({ symbol }: { symbol: string }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 500,
      layout: { background: { color: "#ffffff" }, textColor: "#1f2937" },
    });

    const series = chart.addCandlestickSeries();

    // Conexión directa a Finnhub
    const apiKey = "d8c6dghr01qidic6icmgd8c6dghr01qidic6icn0"; // <--- PEGÁ TU KEY ACÁ
    const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${Math.floor(Date.now()/1000) - 7776000}&to=${Math.floor(Date.now()/1000)}&token=${apiKey}`;

fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log("Datos de Finnhub:", data); // <-- ESTO ES CLAVE
        if (data.s === 'ok') {
          const formattedData = data.t.map((t: any, i: number) => ({
            time: t,
            open: data.o[i],
            high: data.h[i],
            low: data.l[i],
            close: data.c[i],
          }));
          series.setData(formattedData);
        } else {
          console.warn("Finnhub no devolvió 'ok', sino:", data.s);
        }
      })
      .catch(err => console.error("Error de conexión:", err));

    return () => chart.remove();
  }, [symbol]);

  return <div ref={chartContainerRef} className="w-full h-[500px]" />;
}
