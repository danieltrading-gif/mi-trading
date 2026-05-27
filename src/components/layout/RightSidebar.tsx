import React, { useEffect, useState } from "react";

interface TickerData {
  symbol: string;
  price: number;
  change: number;
}

// Lista inicial para la sección de arriba (dinámica)
const INITIAL_WATCHLIST = ["AAPL", "NVDA", "MSFT", "AMZN"];
// Tus 10 empresas seleccionadas con potencial fundamental para la sección de abajo
const POTENTIAL_STOCKS = ["INTC", "PYPL", "BABA", "WBD", "PFE", "DIS", "BA", "KVUE", "T", "VALE"];

export default function RightSidebar({ onSelectSymbol }: { onSelectSymbol: (symbol: string) => void }) {
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>(INITIAL_WATCHLIST);
  const [watchlistData, setWatchlistData] = useState<TickerData[]>([]);
  const [potentialData, setPotentialData] = useState<TickerData[]>([]);
  const [newSymbol, setNewSymbol] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Simulación de actualización de precios en vivo (reemplazable por tu API de Yahoo luego)
  useEffect(() => {
    const updatePrices = () => {
      const mockFetch = (symbols: string[]) =>
        symbols.map((s) => ({
          symbol: s,
          price: s === "AAPL" ? 308.82 : s === "NVDA" ? 249.00 : s === "MSFT" ? 239.35 : s === "AMZN" ? 234.82 : 50 + Math.random() * 150,
          change: Number(((Math.random() * 4) - 2).toFixed(2)),
        }));

      setWatchlistData(mockFetch(watchlistSymbols));
      setPotentialData(mockFetch(POTENTIAL_STOCKS));
    };

    updatePrices();
    const interval = setInterval(updatePrices, 3000); // Actualiza cada 3 segundos en vivo
    return () => clearInterval(interval);
  }, [watchlistSymbols]);

  // Función para agregar CUALQUIER acción del mundo usando el buscador +
  const handleAddSymbol = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSymbol = newSymbol.trim().toUpperCase();
    if (cleanSymbol && !watchlistSymbols.includes(cleanSymbol)) {
      setWatchlistSymbols([...watchlistSymbols, cleanSymbol]);
      setNewSymbol("");
      setShowSearch(false);
    }
  };

  const renderRow = (stock: TickerData) => (
    <div
      key={stock.symbol}
      onClick={() => onSelectSymbol(stock.symbol)}
      className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors border border-transparent"
    >
      <span className="font-bold text-sm text-gray-800">{stock.symbol}</span>
      <div className="text-right flex space-x-6 items-center">
        <span className="font-mono text-sm font-semibold text-gray-900">
          {stock.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className={`font-mono text-xs font-bold w-16 text-right ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
          {stock.change >= 0 ? `+${stock.change}` : stock.change}%
        </span>
      </div>
    </div>
  );

  return (
    <div className="w-80 border-l border-gray-200 bg-white text-gray-900 p-4 h-full flex flex-col font-sans select-none">
      
      {/* SECCIÓN 1: ACCIONES EN OBSERVACIÓN / OPERATORIA */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-xs tracking-wider text-gray-500">ACCIONES EN SEGUIMIENTO</h2>
        <button 
          onClick={() => setShowSearch(!showSearch)} 
          className="text-xl font-semibold text-gray-400 hover:text-blue-600 transition-colors px-2 focus:outline-none"
        >
          +
        </button>
      </div>

      {/* Buscador dinámico emulando la versatilidad de TradingView */}
      {showSearch && (
        <form onSubmit={handleAddSymbol} className="mb-3 flex space-x-2">
          <input
            type="text"
            placeholder="Ej: TSLA, AMD, KO..."
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-2 py-1 text-xs uppercase bg-gray-50 text-gray-900 focus:outline-none focus:border-blue-500"
            autoFocus
          />
          <button type="submit" className="bg-blue-600 text-white text-xs px-3 py-1 rounded font-semibold hover:bg-blue-700">
            Añadir
          </button>
        </form>
      )}

      <div className="flex justify-between text-[10px] text-gray-400 font-bold mb-2 px-1 border-b border-gray-100 pb-1">
        <span>SÍMBOLO</span>
        <div className="space-x-10">
          <span>PRECIO</span>
          <span>CHG%</span>
        </div>
      </div>

      {/* Lista superior escaneable */}
      <div className="flex-1 overflow-y-auto space-y-0.5 mb-4 max-h-[45%] border-b border-gray-100">
        {watchlistData.map(renderRow)}
      </div>

      {/* SECCIÓN 2: CARPETA DE COMPRA / SUBVALORADAS (Tus 10 elegidas) */}
      <div className="mb-2">
        <h2 className="font-bold text-xs tracking-wider text-gray-500">POTENCIAL DE CRECIMIENTO (10)</h2>
      </div>

      <div className="flex justify-between text-[10px] text-gray-400 font-bold mb-2 px-1 border-b border-gray-100 pb-1">
        <span>SÍMBOLO</span>
        <div className="space-x-10">
          <span>PRECIO</span>
          <span>CHG%</span>
        </div>
      </div>

      {/* Lista inferior fija de las 10 joyas fundamentales */}
      <div className="flex-1 overflow-y-auto space-y-0.5">
        {potentialData.map(renderRow)}
      </div>

    </div>
  );
}
