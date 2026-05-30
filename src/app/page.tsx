"use client";
import { useState } from 'react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Acciones');
  const [selectedTicker, setSelectedTicker] = useState('AAPL');
  const tabs = ['Acciones', 'Fondos', 'Futuros', 'Forex', 'Cripto', 'Bonos'];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200">
      {/* 1. NAVEGACIÓN CENTRAL (Arriba) */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-center gap-2 border-b border-slate-800 bg-slate-950 z-10">
        {tabs.map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm transition ${activeTab === tab ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-400 hover:bg-slate-900'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 2. LISTA LATERAL (Tu Watchlist de 20 activos) */}
      <div className="w-72 mt-16 border-r border-slate-800 bg-slate-950 flex flex-col">
         {/* Aquí irá la lógica de tu lista de 20 con el diseño de TradingView */}
         <div className="p-4 text-[10px] uppercase text-slate-500 font-bold tracking-widest">
            Watchlist ({activeTab})
         </div>
         {/* Próximamente: Lista estilo TradingView */}
      </div>

      {/* 3. ÁREA PRINCIPAL (Gráfico + Detalles) */}
      <div className="flex-1 mt-16 p-6">
        <h1 className="text-4xl font-bold">{selectedTicker}</h1>
        <p className="text-slate-500">Aquí integraremos el buscador de activos para tu biblioteca...</p>
      </div>
    </div>
  );
}



