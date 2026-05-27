"use client";

import React, { useState } from "react";
import PriceChart from "@/components/chart/PriceChart";
import RightSidebar from "@/components/layout/RightSidebar";

export default function Home() {
  // Inicializamos por defecto con Apple (AAPL) para que cargue directo de Yahoo
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");

  return (
    <main className="flex h-screen w-screen bg-white overflow-hidden font-sans select-none">
      {/* PANEL CENTRAL DEL GRÁFICO (FONDO BLANCO) */}
      <div className="flex-1 flex flex-col h-full bg-white p-2">
        <PriceChart symbol={selectedSymbol} />
      </div>

      {/* PANEL DERECHO CON WATCHLISTS DIVIDIDAS (OPERATORIA / POTENCIALES) */}
      <RightSidebar onSelectSymbol={(symbol) => setSelectedSymbol(symbol)} />
    </main>
  );
}
