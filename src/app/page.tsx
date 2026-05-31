"use client";
import { useState, useEffect } from 'react';
import { Plus, Zap, ArrowUp, ArrowDown } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Acciones');
  const [data, setData] = useState<any>(null);
  const tabs = ['Acciones', 'Fondos', 'Futuros', 'Forex', 'Cripto', 'Bonos'];

  // Lógica de colores y estados basada en datos reales
  const getChangeColor = (val: string) => parseFloat(val) >= 0 ? 'text-green-500' : 'text-red-500';
  
  // Análisis simple de volumen (usando 10M como umbral institucional)
  const getVolumeAnalysis = (vol: string) => {
    const v = parseInt(vol);
    if (v > 10000000) return { label: 'Institucional', color: 'text-purple-400' };
    if (v > 5000000) return { label: 'Alto', color: 'text-blue-400' };
    return { label: 'Normal', color: 'text-slate-400' };
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 overflow-hidden">
      
      {/* 1. CABECERA: Ticker + Tarjetas de Datos + Botones Instrumentos */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold">AAPL</h1>
          
          {/* Tarjetas de Datos Técnicos */}
          <div className="flex gap-2 text-xs">
            <div className="px-3 py-1 bg-slate-900 rounded border border-slate-800 font-bold text-base">312.06</div>
            <div className={`px-3 py-1 bg-slate-900 rounded border border-slate-800 font-bold ${getChangeColor("-0.45")}`}>-0.45</div>
            <div className={`px-3 py-1 bg-slate-900 rounded border border-slate-800 font-bold ${getChangeColor("-0.14")}`}>-0.14%</div>
            <div className="px-3 py-1 bg-slate-900 rounded border border-slate-800">
               Sentimiento: <span className="text-yellow-500 font-bold">Indecisión</span>
            </div>
            <div className="px-3 py-1 bg-slate-900 rounded border border-slate-800 flex gap-2">
               Volumen: <span className="font-bold">70.026.752</span>
               <span className={`text-[10px] ${getVolumeAnalysis("70026752").color}`}>({getVolumeAnalysis("70026752").label})</span>
            </div>
          </div>
        </div>
        
        {/* Botones de Instrumentos */}
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full text-[11px] transition ${activeTab === tab ? 'bg-slate-200 text-slate-950 font-bold' : 'text-slate-700 hover:bg-slate-900'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 2. CUERPO PRINCIPAL */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-56 border-r border-slate-800 flex flex-col">
          <div className="p-3 text-[9px] uppercase font-bold text-slate-500 flex justify-between items-center border-b border-slate-900">
            Watchlist ({activeTab}) <Plus size={14} className="cursor-pointer hover:text-white"/>
          </div>
          <div className="p-2 space-y-1">
             <div className="flex justify-between p-2 bg-slate-900 rounded text-xs border border-slate-800 text-red-500">
                <span>AAPL</span> <span>-0.14%</span>
             </div>
          </div>
        </div>

        <div className="flex-1 p-6 flex items-center justify-center border-r border-slate-800 text-slate-700 italic">
          Zona libre para gráficos y análisis técnico
        </div>

        <div className="w-56 p-4">
          <h2 className="text-[10px] uppercase font-bold text-slate-500 mb-4 flex items-center gap-2">
            <Zap size={14} className="text-yellow-500"/> Running Stocks
          </h2>
          <div className="text-xs space-y-3">
             <div className="flex justify-between"><span>NVDA</span> <span className="text-green-500">+4.2%</span></div>
          </div>
        </div>
      </div>

      <div className="h-24 border-t border-slate-800 bg-slate-900/50 p-4 text-[11px] text-slate-400 overflow-y-auto">
        <span className="font-bold text-slate-200">Noticias de mercado:</span> Contexto global e industrial en tiempo real.
      </div>
    </div>
  );
}


