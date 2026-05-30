"use client";
import { useState } from 'react';
import { Bitcoin, BarChart2, Briefcase, Zap, Plus, ArrowUp, ArrowDown } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Acciones');
  const [selectedTicker, setSelectedTicker] = useState('AAPL');
  const tabs = ['Acciones', 'Fondos', 'Futuros', 'Forex', 'Cripto', 'Bonos'];
  
  // Datos simulados por ahora para mantener la estabilidad del diseño
  const mockData = { price: 312.06, change: -0.45, percent: -0.14, volume: 70026752, sentiment: 'Indecisión' };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
      
      {/* 1. Navegación Superior Centralizada */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-center gap-2 border-b border-slate-800 bg-slate-950 z-10">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm ${activeTab === tab ? 'bg-slate-200 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-900'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* 2. Barra Lateral Izquierda (Watchlist) */}
      <div className="w-72 mt-16 border-r border-slate-800 flex flex-col">
        <div className="p-4 text-[10px] uppercase text-slate-500 font-bold flex justify-between items-center">
            Watchlist ({activeTab})
            <button className="hover:text-white"><Plus size={16}/></button>
        </div>
        <div className="flex-1 overflow-y-auto">
            {/* Aquí se listarán los activos seleccionados */}
            <div className="px-4 py-3 bg-slate-900 border-l-2 border-blue-500 text-sm">AAPL 312.06 -0.14%</div>
        </div>
      </div>

      {/* 3. Panel Central (Datos + Gráfico) */}
      <div className="flex-1 mt-16 p-8 flex flex-col">
        <h1 className="text-4xl font-bold mb-6">{selectedTicker}</h1>
        
        {/* Panel de Datos (Recuperado y fijo) */}
        <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-900 p-4 rounded border border-slate-800">
                <p className="text-[10px] text-slate-500">PRECIO</p>
                <p className="text-xl font-bold">${mockData.price}</p>
            </div>
            <div className="bg-slate-900 p-4 rounded border border-slate-800">
                <p className="text-[10px] text-slate-500">VARIACIÓN</p>
                <p className={`text-xl font-bold flex items-center ${mockData.change < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {mockData.change < 0 ? <ArrowDown size={16}/> : <ArrowUp size={16}/>} {mockData.percent}%
                </p>
            </div>
            <div className="bg-slate-900 p-4 rounded border border-slate-800">
                <p className="text-[10px] text-slate-500">SENTIMIENTO</p>
                <p className="text-xl font-bold">{mockData.sentiment}</p>
            </div>
            <div className="bg-slate-900 p-4 rounded border border-slate-800">
                <p className="text-[10px] text-slate-500">VOLUMEN</p>
                <p className="text-xl font-bold">{mockData.volume.toLocaleString()}</p>
            </div>
        </div>

        {/* Espacio para gráfico */}
        <div className="flex-1 border-dashed border-2 border-slate-800 rounded flex items-center justify-center text-slate-600">
            Zona de Gráfico
        </div>
      </div>

      {/* 4. Barra Lateral Derecha (Running Stocks / Momentum) */}
      <div className="w-64 mt-16 border-l border-slate-800 bg-slate-950 p-4">
        <h2 className="text-[10px] uppercase font-bold text-slate-500 mb-4 flex items-center gap-2">
            <Zap size={14} className="text-yellow-500"/> Running Stocks
        </h2>
        <div className="text-xs text-slate-400 space-y-3">
            <div>NVDA <span className="text-green-500">+4.2%</span></div>
            <div>PLTR <span className="text-green-500">+3.1%</span></div>
            <div>AMD <span className="text-green-500">+2.5%</span></div>
        </div>
      </div>
    </div>
  );
}



