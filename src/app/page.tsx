"use client";

import PriceChart from "@/components/chart/PriceChart";
import { Header } from "@/components/layout/Header";

export default function Home() {
  return (
    <div className="flex h-screen w-screen flex-col bg-white text-gray-900 font-sans antialiased overflow-hidden">
      {/* Barra superior limpia */}
      <Header />

      {/* El motor del gráfico aislado en toda la pantalla */}
      <main className="flex-1 flex p-4 bg-gray-50 items-center justify-center">
        <div className="w-full h-full max-w-6xl bg-white rounded-xl shadow-md border border-gray-100 p-4">
          <PriceChart symbol="AAPL" />
        </div>
      </main>
    </div>
  );
}
