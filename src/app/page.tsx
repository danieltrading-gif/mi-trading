"use client";

import React, { useState } from "react";
import PriceChart from "../components/chart/PriceChart";
import RightSidebar from "../components/layout/RightSidebar";
import { Header } from "../components/layout/Header";
import { LeftSidebar } from "../components/layout/LeftSidebar";
import { BottomPanel } from "../components/layout/BottomPanel";

export default function Home() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");

  return (
    <div className="flex flex-col h-screen w-screen bg-white text-gray-900 overflow-hidden font-sans">
      {/* Barra superior original */}
      <Header />

      <div className="flex flex-1 overflow-hidden">
        {/* Barra lateral izquierda de herramientas */}
        <LeftSidebar />

        {/* Contenedor Central: Gráfico arriba y panel inferior abajo */}
        <div className="flex-1 flex flex-col overflow-hidden p-2 bg-gray-50">
          <div className="flex-1 bg-white rounded-lg overflow-hidden relative">
            <PriceChart symbol={selectedSymbol} />
          </div>
          <BottomPanel />
        </div>

        {/* Panel Derecho con las dos listas de acciones */}
        <RightSidebar onSelectSymbol={(symbol) => setSelectedSymbol(symbol)} />
      </div>
    </div>
  );
}
