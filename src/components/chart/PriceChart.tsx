"use client";

// Definimos que este componente ACEPTA un 'symbol' como texto
interface PriceChartProps {
  symbol: string;
}

export default function PriceChart({ symbol }: PriceChartProps) {
  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h2 className="text-lg font-bold">Dashboard: {symbol}</h2>
      <p>Estamos configurando el análisis para este activo.</p>
    </div>
  );
}
