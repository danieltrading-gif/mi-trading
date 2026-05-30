"use client";

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [watchlist] = useState(['AAPL', 'TSLA', 'BTC-USD']);
  const [selectedTicker, setSelectedTicker] = useState('AAPL');
  const [data, setData] = useState<any>(null);
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
      {/* Sidebar */}
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
        <h2 className="text-3xl font-bold mb-6">Cotización: {selectedTicker}</h2>
        
        {loading ? (
          <p>Cargando datos...</p>
        ) : data && data["Global Quote"] ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded shadow border border-gray-200">
              <p className="text-sm text-gray-500">Precio Actual</p>
              <p className="text-2xl font-bold">${parseFloat(data["Global Quote"]["05. price"]).toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded shadow border border-gray-200">
              <p className="text-sm text-gray-500">Cambio (%)</p>
              <p className="text-2xl font-bold text-blue-600">{data["Global Quote"]["10. change percent"]}</p>
            </div>
            <div className="bg-white p-6 rounded shadow border border-gray-200">
              <p className="text-sm text-gray-500">Volumen</p>
              <p className="text-2xl font-bold">{data["Global Quote"]["06. volume"]}</p>
            </div>
          </div>
        ) : (
          <p>No se encontraron datos para este símbolo.</p>
        )}
      </div>
    </div>
  );
}




