"use client";

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [watchlist] = useState(['AAPL', 'TSLA', 'BTC-USD']);
  const [selectedTicker, setSelectedTicker] = useState('AAPL');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Llamamos a TU propia API route
        const res = await fetch(`/api/market?symbol=${selectedTicker}`);
        const result = await res.json();
        setData(result.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedTicker]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-slate-900 text-white p-4">
        <h1 className="text-xl font-bold mb-4">Mis Activos</h1>
        {watchlist.map(ticker => (
          <div 
            key={ticker} 
            onClick={() => setSelectedTicker(ticker)}
            className={`p-3 cursor-pointer ${selectedTicker === ticker ? 'bg-slate-700' : 'hover:bg-slate-800'}`}
          >
            {ticker}
          </div>
        ))}
      </div>

{/* Main Content */}
<div className="w-3/4 p-8">
  <h2 className="text-3xl font-bold">Analizando: {selectedTicker}</h2>
  {loading ? (
    <p>Cargando datos...</p>
  ) : data ? (
    <div className="mt-6 bg-white p-6 rounded shadow border border-gray-200">
      <h3 className="font-bold text-lg mb-2">Datos recibidos:</h3>
      <pre className="text-xs bg-gray-50 p-2 overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  ) : (
    <p className="text-red-500 mt-4">No se recibieron datos. Verifica tu API Key o el ticker.</p>
  )}
</div>
  );
}






