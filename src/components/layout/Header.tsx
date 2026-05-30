"use client";

import { Code2, Zap } from "lucide-react";
import { SymbolSelector } from "@/components/chart/SymbolSelector";
import { Separator } from "@/components/ui/separator";

export function Header() {
  return (
    <header className="flex h-12 items-center justify-between border-b border-gray-200 bg-white px-3 select-none shadow-sm">
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-2 pr-2">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-50">
            <Zap className="h-4 w-4 text-blue-600" />
          </div>
          <span className="text-sm font-bold text-gray-800">
            TradingView <span className="text-blue-600 font-medium text-xs bg-blue-50 px-1.5 py-0.5 rounded ml-1">Wall Street</span>
          </span>
        </div>
        <Separator orientation="vertical" className="h-6 bg-gray-250" />
        <SymbolSelector />
        <Separator orientation="vertical" className="h-6 bg-gray-250" />
        <Separator orientation="vertical" className="mx-1 h-6 bg-gray-250" />
        
        {/* Silenciamos el menú de indicadores viejo para evitar que tire el disyuntor */}
        <div className="text-xs text-gray-400 font-medium px-2 bg-gray-50 py-1 rounded border border-gray-100">
          Indicadores listos
        </div>
      </div>

      <div className="flex items-center gap-2">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors"
        >
          <Code2 className="h-3.5 w-3.5" />
          <span>Source</span>
        </a>
      </div>
    </header>
  );
}
