"use client";
import PriceChart from "@/components/chart/PriceChart";

export default function Home() {
  return (
    <main style={{ padding: '20px' }}>
      <h1>TradingView Wall Street</h1>
      <PriceChart symbol="AAPL" />
    </main>
  );
}













