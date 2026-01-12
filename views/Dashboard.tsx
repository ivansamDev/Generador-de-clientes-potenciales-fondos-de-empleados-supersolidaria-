
import React from 'react';
import { FondoEmpleado, AppView } from '../types';

interface DashboardProps {
  leads: FondoEmpleado[];
  onNavigate: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ leads, onNavigate }) => {
  const citiesCount = new Set(leads.map(l => l.ciudad)).size;
  const emailsCount = leads.filter(l => l.email && l.email.includes('@')).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h2 className="text-3xl font-bold text-slate-800">Panel de Control</h2>
        <p className="text-slate-500 mt-1">Resumen de tu base de datos de prospección.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Total Fondos Extraídos</p>
          <p className="text-4xl font-bold text-blue-600 mt-2">{leads.length}</p>
          <div className="mt-4 flex items-center gap-1 text-green-600 text-xs font-bold">
            <span>↑ 12% desde la última sesión</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Emails Verificados</p>
          <p className="text-4xl font-bold text-slate-800 mt-2">{emailsCount}</p>
          <div className="mt-4 flex items-center gap-1 text-slate-400 text-xs">
            <span>Disponibles para campaña</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm font-medium">Alcance Geográfico</p>
          <p className="text-4xl font-bold text-slate-800 mt-2">{citiesCount}</p>
          <div className="mt-4 flex items-center gap-1 text-slate-400 text-xs">
            <span>Municipios registrados</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-blue-500/20">
        <div className="relative z-10 max-w-lg">
          <h3 className="text-2xl font-bold">¿Listo para capturar más datos?</h3>
          <p className="mt-2 text-blue-100 opacity-90">
            Utiliza nuestra IA para extraer información directamente desde el portal oficial de SuperSolidaria. 
            Es posible y seguro estructurar miles de contactos en minutos.
          </p>
          {/* Fix: use 'scraper' as defined in AppView and App routes */}
          <button 
            onClick={() => onNavigate('scraper')}
            className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg"
          >
            Comenzar Extracción
          </button>
        </div>
        <div className="absolute top-0 right-0 h-full w-1/3 bg-white/10 -skew-x-12 transform translate-x-1/2"></div>
      </div>

      <section>
        <h4 className="text-lg font-bold text-slate-800 mb-4">Actividades Recientes</h4>
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
          {leads.slice(0, 5).map(lead => (
            <div key={lead.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400">
                  {/* Fix: Property name in types.ts is nombre_fondo */}
                  {lead.nombre_fondo.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{lead.nombre_fondo}</p>
                  <p className="text-xs text-slate-400">{lead.ciudad}, {lead.departamento}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Extraído</span>
            </div>
          ))}
          {leads.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              No hay datos recientes. Comienza escaneando el sitio de SuperSolidaria.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
