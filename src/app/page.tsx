"use client";

import { useState } from 'react';

export default function Dashboard() {
  const [watchlist, setWatchlist] = useState(['AAPL', 'BTC-USD', 'TSLA']);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Columna Izquierda: Watchlist */}
      <div className="w-1/4 bg-slate-900 text-white p-4">
        <h1 className="text-xl font-bold mb-4">Watchlist</h1>
        <ul>
          {watchlist.map(ticker => (
            <li key={ticker} className="p-2 border-b border-slate-700 flex justify-between">
              {ticker}
              <button onClick={() => setWatchlist(watchlist.filter(t => t !== ticker))} className="text-red-400">X</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Columna Derecha: Panel de Información */}
      <div className="w-3/4 p-8">
        <h2 className="text-3xl font-bold">Resumen de Mercado</h2>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-6 rounded shadow">KPI 1: Precio</div>
          <div className="bg-white p-6 rounded shadow">KPI 2: Tendencia</div>
          <div className="bg-white p-6 rounded shadow">KPI 3: Score</div>
        </div>
        <div className="mt-8 bg-white p-6 rounded shadow">
          <h3 className="font-bold mb-2">Noticias Recientes</h3>
          <p>Aquí cargaremos el feed de noticias en breve...</p>
        </div>
      </div>
    </div>
  );
}











