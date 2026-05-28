"use client";

import React, { useEffect, useRef } from "react";
import { createChart, ColorType } from "lightweight-charts";

export default function PriceChart({ symbol }: { symbol: string }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'white' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
    });

    // Esta es la forma correcta y actualizada de añadir la serie
    const series = chart.addSeries(require('lightweight-charts').CandlestickSeries);

    const apiKey = "d8c6dghr01qidic6icmgd8c6dghr01qidic6icn0";
    const to = Math.floor(Date.now() / 1000);
    const from = to - 7776000;
    
    fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}&token=${apiKey}`)
      .then(res => res.json())
      .then(data => {
        if (data.s === 'ok' && data.t) {
          const formattedData = data.t.map((t: number, i: number) => ({
            time: t,
            open: data.o[i],
            high: data.h[i],
            low: data.l[i],
            close: data.c[i],
          }));
          series.setData(formattedData);
        }
      })
      .catch(err => console.error("Error:", err));

    return () => chart.remove();
  }, [symbol]);

  return <div ref={chartContainerRef} className="w-full h-[500px]" />;
}
