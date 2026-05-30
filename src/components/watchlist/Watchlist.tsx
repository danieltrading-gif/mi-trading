"use client";

import { Plus, X } from "lucide-react";
import { useChartStore } from "@/lib/store/chart-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function Watchlist() {
  const watchlist = useChartStore((s) => s.watchlist);
  const symbol = useChartStore((s) => s.symbol);
  const setSymbol = useChartStore((s) => s.setSymbol);
  const removeFromWatchlist = useChartStore((s) => s.removeFromWatchlist);
  const openSymbolDialog = useChartStore((s) => s.setSymbolDialogOpen);

  return (
    <div className="flex h-full flex-col bg-slate-900 text-white">
      <div className="flex items-center justify-between border-b border-slate-700 px-3 py-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Mis Activos
        </h2>
        <button
          onClick={() => openSymbolDialog(true)}
          className="rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {watchlist.map((s) => {
            const isActive = s === symbol;
            return (
              <div
                key={s}
                onClick={() => setSymbol(s)}
                className={cn(
                  "group flex cursor-pointer items-center justify-between px-3 py-2 text-xs transition-colors hover:bg-slate-800",
                  isActive && "bg-slate-800",
                )}
              >
                <span className="font-medium">{s}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromWatchlist(s);
                  }}
                  className="invisible p-0.5 text-slate-400 hover:text-red-400 group-hover:visible"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
          {watchlist.length === 0 && (
            <div className="p-4 text-center text-xs text-slate-500">
              Tu lista está vacía
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
