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
      {/* Sidebar - Más compacto */}
      <div className="w-1/6 bg-slate-900 text-white p-2 text-sm">
        <h1 className="text-base font-bold mb-4 px-2">Mis Activos</h1>
        {watchlist.map(ticker => (
          <div 
            key={ticker} 
            onClick={() => setSelectedTicker(ticker)}
            className={`p-2 cursor-pointer border-b border-slate-800 ${selectedTicker === ticker ? 'bg-slate-700' : 'hover:bg-slate-800'}`}
          >
            {ticker}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="w-5/6 p-8">
        <h2 className="text-3xl font-bold">Analizando: {selectedTicker}</h2>
        {loading ? (
          <p>Cargando datos del servidor...</p>
        ) : (
          <div className="mt-6 bg-white p-6 rounded shadow border border-gray-200">
            <h3 className="font-bold text-lg mb-2">Respuesta del API:</h3>
            <pre className="text-xs bg-gray-50 p-2 overflow-x-auto">
              {data ? JSON.stringify(data, null, 2) : "No hay datos recibidos. Verifica la API KEY en Vercel."}
            </pre>
          </div>
        )}
      </div> 
      {/* <--- ¡Este DIV faltaba para cerrar el Main Content! */}
    </div>
  );
}





