"use client";

import { useChartStore } from "@/lib/store/chart-store";
import { cn } from "@/lib/utils";

export function BottomPanel() {
  // Agarramos el símbolo que elijas (ej: AAPL)
  const symbol = useChartStore((s) => s.symbol) || "AAPL";

  return (
    <div className="flex h-9 items-center gap-0 border-t border-gray-200 bg-white px-3 text-xs text-gray-600 font-sans select-none shadow-inner">
      <Stat label="Símbolo" value={symbol} valueClass="text-blue-600 font-bold" />
      <Stat label="24h Cambio" value="—" />
      <Stat label="24h Alto" value="—" />
      <Stat label="24h Bajo" value="—" />
      <Stat label="24h Vol (base)" value="—" />
      <Stat label="24h Vol (USD)" value="—" />
      
      <div className="ml-auto flex items-center gap-2 text-[10px] text-gray-400">
        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
        <span>Yahoo Finance · Ready</span>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center gap-1.5 border-r border-gray-100 px-3">
      <span className="text-gray-400 font-medium">{label}</span>
      <span className={cn("font-semibold font-mono text-gray-800", valueClass)}>
        {value}
      </span>
    </div>
  );
}
