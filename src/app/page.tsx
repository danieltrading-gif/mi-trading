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
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    }
    fetchData();
  }, [selectedTicker]);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200">
      {/* Sidebar - Ahora oscuro elegante */}
      <div className="w-60 border-r border-slate-800 bg-slate-950 flex flex-col">
        <div className="p-4 border-b border-slate-800 font-bold text-sm tracking-wide">MIS ACTIVOS</div>
        {watchlist.map(ticker => (
          <div key={ticker} onClick={() => setSelectedTicker(ticker)}
            className={`px-4 py-3 cursor-pointer text-xs font-medium hover:bg-slate-900 ${selectedTicker === ticker ? 'bg-slate-900 border-l-2 border-blue-500' : ''}`}>
            {ticker}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header de Datos */}
        <div className="p-6 border-b border-slate-800 bg-slate-950">
          <h1 className="text-2xl font-bold text-white mb-4">{selectedTicker}</h1>
          
          {loading ? <p className="text-sm text-slate-500">Cargando...</p> : data && data["Global Quote"] ? (
            <div className="flex gap-8">
              <div>
                <p className="text-[10px] uppercase text-slate-500">Precio</p>
                <p className="text-xl font-mono text-white">{parseFloat(data["Global Quote"]["05. price"]).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-slate-500">Variación</p>
                <p className={`text-xl font-mono ${parseFloat(data["Global Quote"]["10. change percent"]) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {data["Global Quote"]["10. change percent"]}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Espacio para el Gráfico */}
        <div className="flex-1 p-6 bg-slate-950 flex items-center justify-center border-dashed border-2 border-slate-800 m-6 rounded-lg">
          <p className="text-slate-600 text-sm">Aquí insertaremos el gráfico próximamente</p>
        </div>
      </div>
    </div>
  );
}



