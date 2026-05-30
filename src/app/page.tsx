"use client";
import { useState, useEffect } from 'react';
import { Bitcoin, BarChart2, Briefcase, Zap } from 'lucide-react';

export default function Dashboard() {
  const [category, setCategory] = useState<'STOCKS' | 'CRYPTO' | 'ETF' | 'COMMODITIES'>('STOCKS');
  const [selectedTicker, setSelectedTicker] = useState('AAPL');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const lists = {
    STOCKS: ['AAPL', 'TSLA', 'NVDA', 'AMD', 'PLTR', 'SOFI', 'AMC', 'GME'],
    CRYPTO: ['BTC-USD', 'ETH-USD', 'SOL-USD', 'ADA-USD', 'XRP-USD'],
    ETF: ['SPY', 'QQQ', 'IWM'],
    COMMODITIES: ['GC=F', 'SI=F', 'CL=F']
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/market?symbol=${selectedTicker}`);
        const result = await res.json();
        // Normalizamos los datos aquí
        setData(result.data["Global Quote"] || result.data["Realtime Currency Exchange Rate"] || {});
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    }
    fetchData();
  }, [selectedTicker]);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200">
      <div className="w-60 border-r border-slate-800 bg-slate-950 flex flex-col">
        <div className="grid grid-cols-4 gap-1 p-2 border-b border-slate-800">
          {(['STOCKS', 'CRYPTO', 'ETF', 'COMMODITIES'] as const).map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} 
              className={`p-2 rounded text-[9px] ${category === cat ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-900'}`}>
              {cat.substring(0,3)}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto">
          {lists[category].map(ticker => (
            <div key={ticker} onClick={() => setSelectedTicker(ticker)}
              className={`px-4 py-3 cursor-pointer text-xs border-b border-slate-900 ${selectedTicker === ticker ? 'bg-slate-900 border-l-2 border-blue-500' : 'hover:bg-slate-900'}`}>
              {ticker}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-white mb-6">{selectedTicker}</h1>
        {loading ? <p>Cargando...</p> : (
            <div className="text-sm">
                {/* Visualización de datos simplificada para verificar la conexión */}
                <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
        )}
      </div>
    </div>
  );
}



