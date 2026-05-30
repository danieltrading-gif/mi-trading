"use client";
import { useState } from 'react';
import { Plus, Zap, ArrowUp, ArrowDown } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Acciones');
  const tabs = ['Acciones', 'Fondos', 'Futuros', 'Forex', 'Cripto', 'Bonos'];
  
  // Datos simulados (Sección de arriba a la derecha)
  const tickerData = { symbol: 'AAPL', price: 312.06, changeNum: 2.10, changePercent: -0.14, sentiment: 'Indecisión', volume: '70.026.752' };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-200 overflow-hidden">
      
      {/* 1. CABECERA: Datos Activo + Botones de Instrumentos */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold">{tickerData.symbol}</h1>
          <div className="flex gap-4 text-xs">
            <span>Precio: <span className="font-bold">${tickerData.price}</span></span>
            <span className={tickerData.changeNum >= 0 ? 'text-green-500' : 'text-red-500'}>
              Var: {tickerData.changeNum > 0 ? '+' : ''}{tickerData.changeNum} ({tickerData.changePercent}%)
            </span>
            <span className="text-slate-500">Sentimiento: {tickerData.sentiment}</span>
            <span className="text-slate-500">Vol: {tickerData.volume}</span>
          </div>
        </div>
        
        {/* Botones de Instrumentos */}
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full text-[11px] transition ${activeTab === tab ? 'bg-slate-200 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-900'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 2. CUERPO PRINCIPAL */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Watchlist Izquierda */}
        <div className="w-56 border-r border-slate-800 flex flex-col">
          <div className="p-3 text-[9px] uppercase font-bold text-slate-500 flex justify-between items-center border-b border-slate-900">
            Watchlist ({activeTab}) <Plus size={14} className="cursor-pointer hover:text-white"/>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="flex justify-between items-center p-2 bg-slate-900 rounded text-xs border border-slate-800">
              <span>AAPL</span>
              <span className="text-red-500">-0.14%</span>
            </div>
          </div>
        </div>

        {/* Centro (Zona Libre para Análisis) */}
        <div className="flex-1 p-6 flex items-center justify-center border-r border-slate-800 text-slate-700 italic">
          Zona libre para gráficos, indicadores y análisis técnico
        </div>

        {/* Running Stocks Derecha */}
        <div className="w-56 p-4">
          <h2 className="text-[10px] uppercase font-bold text-slate-500 mb-4 flex items-center gap-2">
            <Zap size={14} className="text-yellow-500"/> Running Stocks
          </h2>
          <div className="text-xs space-y-3">
            {['NVDA', 'PLTR', 'AMD'].map(s => (
              <div key={s} className="flex justify-between">
                <span>{s}</span>
                <span className="text-green-500">+4.2%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. FOOTER: Noticias Fijo */}
      <div className="h-24 border-t border-slate-800 bg-slate-900/50 p-4 text-[11px] text-slate-400 overflow-y-auto">
        <span className="font-bold text-slate-200">Noticias de mercado:</span> [Aquí se integrará el feed en tiempo real sobre el activo y contexto económico...]
      </div>
    </div>
  );
}


