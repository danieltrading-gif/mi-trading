"use client";

import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Minus, Activity, TrendingUp, AlertCircle } from 'lucide-react';

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

  // Lógica de análisis de fuerza (Simple heurística)
  const getVolumeAnalysis = (quote: any) => {
    const vol = parseInt(quote["06. volume"]);
    const change = parseFloat(quote["10. change percent"]);
    
    let label = "Volumen Normal";
    let icon = <Activity className="w-4 h-4 text-slate-400" />;
    
    if (vol > 10000000) { label = "Entrada Institucional"; icon = <TrendingUp className="w-4 h-4 text-purple-400" />; }
    else if (vol < 1000000) { label = "Volumen Bajo"; icon = <AlertCircle className="w-4 h-4 text-yellow-400" />; }

    const marketSentiment = change > 0.5 ? "Compradores Dominan" : change < -0.5 ? "Vendedores Dominan" : "Indecisión";
    
    return { label, icon, marketSentiment };
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 font-sans">
      <div className="w-60 border-r border-slate-800 bg-slate-950 flex flex-col">
        <div className="p-4 border-b border-slate-800 font-bold text-[11px] tracking-widest text-slate-500">MIS ACTIVOS</div>
        {watchlist.map(ticker => (
          <div key={ticker} onClick={() => setSelectedTicker(ticker)}
            className={`px-4 py-3 cursor-pointer text-xs font-medium hover:bg-slate-900 ${selectedTicker === ticker ? 'bg-slate-900 border-l-2 border-blue-500' : ''}`}>
            {ticker}
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-950">
          <h1 className="text-3xl font-bold text-white mb-6 tracking-tight">{selectedTicker}</h1>
          
          {loading ? <p className="text-sm text-slate-500 animate-pulse">Analizando mercado...</p> : data && data["Global Quote"] ? (() => {
            const quote = data["Global Quote"];
            const analysis = getVolumeAnalysis(quote);
            const isPositive = parseFloat(quote["10. change percent"]) >= 0;

            return (
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                  <p className="text-[10px] uppercase text-slate-500">Precio</p>
                  <p className="text-2xl font-mono text-white mt-1">${parseFloat(quote["05. price"]).toFixed(2)}</p>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                  <p className="text-[10px] uppercase text-slate-500">Variación</p>
                  <p className={`text-2xl font-mono mt-1 flex items-center gap-2 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                    {isPositive ? <ArrowUp className="w-5 h-5"/> : <ArrowDown className="w-5 h-5"/>}
                    {quote["10. change percent"]}
                  </p>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                  <p className="text-[10px] uppercase text-slate-500">Sentimiento</p>
                  <p className="text-sm font-semibold mt-2 text-slate-200">{analysis.marketSentiment}</p>
                </div>
                <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
                  <p className="text-[10px] uppercase text-slate-500 flex items-center gap-2">Volumen {analysis.icon}</p>
                  <p className="text-sm font-semibold text-slate-200">{parseInt(quote["06. volume"]).toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400">{analysis.label}</p>
                </div>
              </div>
            );
          })() : null}
        </div>

        <div className="flex-1 p-6 flex items-center justify-center border-dashed border-2 border-slate-800 m-6 rounded-lg bg-slate-900/50">
          <p className="text-slate-600 text-sm">Zona de Gráfico (Lightweight Charts próximamente)</p>
        </div>
      </div>
    </div>
  );
}



