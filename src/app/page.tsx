"use client";

// Importamos el gráfico de forma super segura
import dynamic from "next/dynamic";
const PriceChart = dynamic(() => import("@/components/chart/PriceChart"), {
  ssr: false,
});

export default function RootPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden', backgroundColor: '#ffffff' }}>
      <header style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 'bold' }}>TradingView Wall Street</h1>
      </header>
      <main style={{ width: '100%', height: 'calc(100vh - 50px)' }}>
        <PriceChart symbol="AAPL" />
      </main>
    </div>
  );
}
