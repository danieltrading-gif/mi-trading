"use client";

export default function PriceChart({ symbol }: { symbol: string }) {
  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h2 className="text-lg font-bold">Datos de: {symbol}</h2>
      <p>Conectando al motor de análisis...</p>
    </div>
  );
}
