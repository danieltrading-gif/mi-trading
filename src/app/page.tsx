"use client";

import dynamic from "next/dynamic";
import { Header } from "@/components/layout/Header";

// IMPORTACIÓN DINÁMICA: Le decimos a Vercel que ignore este archivo durante la construcción
const PriceChart = dynamic(() => import("@/components/chart/PriceChart"), {
  ssr: false,
  loading: () => <div className="h-[500px] flex items-center justify-center bg-gray-50">Cargando gráfico de Wall Street...</div>
});

export default function Home() {
  return (
    <div className="flex h-screen w-screen flex-col bg-white text-gray-900 font-sans antialiased overflow-hidden">
      <Header />
      <main className="flex-1 flex p-4 bg-gray-50 items-center justify-center">
        <div className="w-full h-full max-w-6xl bg-white rounded-xl shadow-md border border-gray-100 p-4">
          <PriceChart symbol="AAPL" />
        </div>
      </main>
    </div>
  );
}
