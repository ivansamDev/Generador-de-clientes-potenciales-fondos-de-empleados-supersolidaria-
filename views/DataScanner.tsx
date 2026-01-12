
import React, { useState } from 'react';
import { extractLeadsFromText } from '../services/geminiService';
import { FondoEmpleado } from '../types';

interface DataScannerProps {
  onExtract: (leads: FondoEmpleado[]) => void;
}

const DataScanner: React.FC<DataScannerProps> = ({ onExtract }) => {
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleProcess = async () => {
    if (!rawText.trim()) return;
    
    setLoading(true);
    setSuccess(false);
    try {
      const extracted = await extractLeadsFromText(rawText);
      if (extracted.length > 0) {
        onExtract(extracted);
        setSuccess(true);
        setRawText('');
      } else {
        alert("No se pudieron identificar fondos en el texto proporcionado. Asegúrate de que los datos incluyan nombres o correos.");
      }
    } catch (e) {
      console.error(e);
      alert("Error durante la extracción. Revisa tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Extractor de Datos Inteligente</h2>
        <p className="text-slate-500 mt-1">Copia y pega texto desde el sitio de SuperSolidaria para convertirlo en una base de datos limpia.</p>
      </header>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-end">
           <label className="block text-sm font-bold text-slate-700">Contenido del Directorio (Texto o Tablas)</label>
           <span className="text-xs text-slate-400">Tip: Puedes pegar el contenido de un PDF o una tabla web.</span>
        </div>
        
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Ejemplo: FONDO DE EMPLEADOS DE LA EMPRESA X - NIT: 800... - Correo: contacto@fondo.co - Dirección: Calle 123 # 45-67..."
          className="w-full h-80 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-mono"
        ></textarea>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {success && (
              <span className="text-green-600 text-sm font-bold flex items-center gap-1">
                ✅ Datos agregados exitosamente!
              </span>
            )}
          </div>
          <button
            onClick={handleProcess}
            disabled={loading || !rawText.trim()}
            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {loading ? "Procesando con IA..." : "Convertir a Base de Datos"}
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl text-amber-900 text-sm">
        <h4 className="font-bold mb-2">Instrucciones de uso:</h4>
        <ol className="list-decimal ml-4 space-y-1 opacity-80">
          <li>Ve al sitio oficial: <a href="https://www.supersolidaria.gov.co/es" target="_blank" className="underline font-bold">supersolidaria.gov.co</a></li>
          <li>Busca el "Directorio de Entidades Vigiladas" o "Fondos de Empleados".</li>
          <li>Selecciona y copia la información (texto o tablas).</li>
          <li>Pégala aquí y nuestra IA extraerá automáticamente Nombres, NIT, Correos, Teléfonos y más.</li>
        </ol>
      </div>
    </div>
  );
};

export default DataScanner;
