"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChartStore } from "@/lib/store/chart-store";
import { cn } from "@/lib/utils";

// Lista de acciones disponibles para buscar de forma segura sin romper nada
const WALL_STREET_SYMBOLS = [
  { symbol: "AAPL", name: "Apple Inc.", market: "NASDAQ" },
  { symbol: "NVDA", name: "NVIDIA Corporation", market: "NASDAQ" },
  { symbol: "MSFT", name: "Microsoft Corporation", market: "NASDAQ" },
  { symbol: "AMZN", name: "Amazon.com, Inc.", market: "NASDAQ" },
  { symbol: "INTC", name: "Intel Corporation", market: "NASDAQ" },
  { symbol: "PYPL", name: "PayPal Holdings, Inc.", market: "NASDAQ" },
  { symbol: "BABA", name: "Alibaba Group Holding", market: "NYSE" },
  { symbol: "WBD", name: "Warner Bros. Discovery", market: "NASDAQ" },
  { symbol: "PFE", name: "Pfizer Inc.", market: "NYSE" },
  { symbol: "DIS", name: "The Walt Disney Company", market: "NYSE" },
  { symbol: "TSLA", name: "Tesla, Inc.", market: "NASDAQ" },
  { symbol: "AMD", name: "Advanced Micro Devices", market: "NASDAQ" },
  { symbol: "KO", name: "豪華 Coca-Cola Company", market: "NYSE" },
];

export function SymbolSelector() {
  const symbol = useChartStore((s) => s.symbol) || "AAPL";
  const setSymbol = useChartStore((s) => s.setSymbol);
  const open = useChartStore((s) => s.symbolDialogOpen);
  const setOpen = useChartStore((s) => s.setSymbolDialogOpen);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toUpperCase();
    if (!q) return WALL_STREET_SYMBOLS;
    return WALL_STREET_SYMBOLS.filter(
      (s) => s.symbol.includes(q) || s.name.toUpperCase().includes(q)
    );
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="group flex items-center gap-2 rounded px-3 py-1.5 text-sm font-semibold hover:bg-gray-100 text-gray-700 transition-colors">
        <Search className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600" />
        <span className="tabular-nums font-bold">{symbol}</span>
        <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
      </DialogTrigger>
      <DialogContent className="max-w-md gap-0 bg-white p-0 border border-gray-200 rounded-lg shadow-lg">
        <DialogHeader className="border-b border-gray-100 px-4 py-3">
          <DialogTitle className="text-sm font-bold text-gray-800">Buscar Acción de Wall Street</DialogTitle>
        </DialogHeader>
        <div className="border-b border-gray-100 p-3 bg-gray-50">
          <Input
            autoFocus
            placeholder="Ej: AAPL, NVDA, TSLA..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-white border-gray-300 text-gray-900 focus-visible:ring-blue-500"
          />
        </div>
        <ScrollArea className="h-[300px]">
          <div className="flex flex-col">
            {filtered.length === 0 && (
              <div className="p-4 text-center text-xs text-gray-400">
                Sin resultados
              </div>
            )}
            {filtered.map((s) => (
              <button
                key={s.symbol}
                onClick={() => {
                  setSymbol(s.symbol);
                  setOpen(false);
                  setQuery("");
                }}
                className={cn(
                  "flex items-center justify-between border-b border-gray-50 px-4 py-2.5 text-left text-xs hover:bg-gray-50 transition-colors",
                  s.symbol === symbol && "bg-blue-50/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900 text-sm">{s.symbol}</span>
                  <span className="text-gray-400 font-medium">{s.name}</span>
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{s.market}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
