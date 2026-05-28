"use client";

import { MousePointer2, Minus, Ruler, Trash2, Lock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useChartStore, type DrawingTool } from "@/lib/store/chart-store";
import { cn } from "@/lib/utils";

interface ToolDef {
  key: DrawingTool;
  icon: typeof MousePointer2;
  label: string;
  hint?: string;
}

const TOOLS: ToolDef[] = [
  { key: "cursor", icon: MousePointer2, label: "Cursor", hint: "Modo navegación" },
  {
    key: "hline",
    icon: Minus,
    label: "Línea horizontal",
    hint: "Click en el chart para marcar un precio",
  },
  {
    key: "measure",
    icon: Ruler,
    label: "Regla / Medir",
    hint: "Click en dos puntos para medir",
  },
];

const LOCKED = [
  { label: "Línea de tendencia" },
  { label: "Fibonacci" },
  { label: "Texto" },
];

export function LeftSidebar() {
  const tool = useChartStore((s) => s.tool);
  const setTool = useChartStore((s) => s.setTool);
  const clearPriceLines = useChartStore((s) => s.clearPriceLines);
  const symbol = useChartStore((s) => s.symbol) || "AAPL";

  return (
    <aside className="flex w-11 flex-col items-center gap-1 border-r border-gray-200 bg-white py-2 select-none shadow-sm">
      {TOOLS.map((t) => {
        const Icon = t.icon;
        const active = tool === t.key;
        return (
          <Tooltip key={t.key}>
            <TooltipTrigger
              onClick={() => setTool(t.key)}
              aria-label={t.label}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-md transition-all",
                active
                  ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100"
                  : "text-gray-400 hover:bg-gray-100 hover:text-gray-700",
              )}
            >
              <Icon className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs bg-gray-900 text-white rounded p-2">
              <div className="font-bold">{t.label}</div>
              {t.hint && (
                <div className="mt-0.5 text-[10px] text-gray-400">{t.hint}</div>
              )}
            </TooltipContent>
          </Tooltip>
        );
      })}

      <Tooltip>
        <TooltipTrigger
          onClick={() => clearPriceLines(symbol)}
          aria-label="Borrar dibujos"
          className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs bg-gray-900 text-white rounded p-2">
          <div className="font-bold">Borrar dibujos</div>
          <div className="mt-0.5 text-[10px] text-gray-400">
            Limpia las líneas de este símbolo
          </div>
        </TooltipContent>
      </Tooltip>

      <div className="my-1 h-px w-6 bg-gray-200" />

      {LOCKED.map((t) => (
        <Tooltip key={t.label}>
          <TooltipTrigger
            disabled
            aria-label={t.label}
            className="flex h-8 w-8 cursor-not-allowed items-center justify-center rounded text-gray-300 opacity-50"
          >
            <Lock className="h-3.5 w-3.5" />
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs bg-gray-100 text-gray-500 border border-gray-200 rounded p-2">
            <div className="font-medium">{t.label}</div>
            <div className="mt-0.5 text-[10px] text-blue-600 font-semibold">
              Próximamente
            </div>
          </TooltipContent>
        </Tooltip>
      ))}
    </aside>
  );
}
