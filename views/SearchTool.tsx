
import React, { useState } from 'react';
import { findDirectoryLinks } from '../services/geminiService';

const SearchTool: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ text: string; links: any[] } | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const data = await findDirectoryLinks();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Buscador Inteligente</h2>
        <p className="text-slate-500 mt-1">Usa Gemini para localizar las fuentes oficiales de datos en SuperSolidaria.</p>
      </header>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 text-sm flex gap-3">
          <span className="text-xl">💡</span>
          <p>
            SuperSolidaria publica regularmente PDFs y archivos de Excel con el "Directorio de Entidades Vigiladas". 
            Esta herramienta te ayuda a encontrar la versión más reciente.
          </p>
        </div>

        {!result ? (
          <div className="py-12 text-center">
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-3 mx-auto disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Buscando fuentes oficiales...
                </>
              ) : "Encontrar Directorios de SuperSolidaria"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="prose prose-slate max-w-none p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="whitespace-pre-wrap text-slate-700">{result.text}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.links.map((chunk, idx) => (
                <a 
                  key={idx}
                  href={chunk.web?.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all group"
                >
                  <p className="font-bold text-slate-800 group-hover:text-blue-600 truncate">{chunk.web?.title || 'Fuente de Datos'}</p>
                  <p className="text-xs text-slate-500 mt-1 truncate">{chunk.web?.uri}</p>
                </a>
              ))}
            </div>

            <button 
              onClick={() => setResult(null)}
              className="text-slate-500 text-sm font-medium hover:text-slate-800"
            >
              Nueva búsqueda
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchTool;
