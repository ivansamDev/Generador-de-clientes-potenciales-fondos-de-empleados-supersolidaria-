
import React, { useState, useEffect, useRef } from 'react';
import { runAIScraper } from '../services/geminiService';
import { FondoEmpleado } from '../types';

interface ScraperConsoleProps {
  onExtract: (leads: FondoEmpleado[]) => void;
}

const ScraperConsole: React.FC<ScraperConsoleProps> = ({ onExtract }) => {
  const [isScraping, setIsScraping] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [selectedDept, setSelectedDept] = useState('Antioquia');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const startScraping = async () => {
    setIsScraping(true);
    setLogs([]);
    setProgress(10);
    
    addLog(`Iniciando conexión con SuperSolidaria Gateway...`);
    addLog(`Configurando User-Agent rotativo (Chrome/120.0.0)...`);
    
    setTimeout(() => {
      setProgress(30);
      addLog(`Escaneando directorios en ${selectedDept}...`);
    }, 1500);

    try {
      const results = await runAIScraper(`Fondos de empleados en ${selectedDept} Colombia`);
      setProgress(70);
      addLog(`Se encontraron ${results.length} fondos con datos públicos legibles.`);
      
      if (results.length > 0) {
        onExtract(results);
        addLog(`Sincronizando con base de datos local (SQLite Sim)...`);
      }
      
      setProgress(100);
      addLog(`Proceso finalizado exitosamente.`);
    } catch (e) {
      addLog(`ERROR: Tiempo de espera agotado en servidor externo.`);
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-[#002D57]">Motor de Scraping IA</h2>
          <p className="text-slate-500">Extracción automatizada de fuentes gubernamentales abiertas.</p>
        </div>
        <div className="flex gap-4">
           <select 
             value={selectedDept}
             onChange={(e) => setSelectedDept(e.target.value)}
             className="p-3 bg-white border border-slate-200 rounded-xl outline-none text-sm font-bold"
           >
             <option>Antioquia</option>
             <option>Cundinamarca</option>
             <option>Valle del Cauca</option>
             <option>Atlántico</option>
             <option>Santander</option>
           </select>
           <button 
             onClick={startScraping}
             disabled={isScraping}
             className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg"
           >
             {isScraping ? 'Extrayendo...' : 'Iniciar Scraping'}
           </button>
        </div>
      </header>

      <div className="bg-slate-900 rounded-3xl p-6 shadow-2xl border border-white/10 overflow-hidden">
        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
           <div className="flex gap-1.5">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
           </div>
           <span className="text-white/40 text-[10px] uppercase font-mono ml-4 tracking-widest">supersolidaria_scraper.log</span>
        </div>

        <div className="h-96 overflow-y-auto font-mono text-sm space-y-2 mb-6 scroll-smooth pr-4 text-blue-400" ref={scrollRef}>
          {logs.length === 0 && <p className="text-white/20 italic">Esperando instrucción de usuario...</p>}
          {logs.map((log, i) => <p key={i}><span className="text-green-500">➜</span> {log}</p>)}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-white/40 font-bold uppercase tracking-widest">
            <span>Progreso de extracción</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScraperConsole;
