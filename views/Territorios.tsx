
import React, { useState } from 'react';

const DEPARTAMENTOS_COLOMBIA = [
  {
    nombre: "Antioquia",
    ciudades: ["Medellín", "Bello", "Itagüí", "Envigado", "Rionegro", "Apartadó", "Turbo", "Caucasia"],
    info: "Alta concentración de fondos industriales y de servicios."
  },
  {
    nombre: "Bogotá / Cundinamarca",
    ciudades: ["Bogotá D.C.", "Soacha", "Chía", "Zipaquirá", "Facatativá", "Fusagasugá", "Girardot"],
    info: "Sede de los fondos de empleados más grandes del país (Nivel 1)."
  },
  {
    nombre: "Valle del Cauca",
    ciudades: ["Cali", "Buenaventura", "Palmira", "Tuluá", "Buga", "Cartago", "Jamundí"],
    info: "Fuerte presencia de fondos del sector agroindustrial y azucarero."
  },
  {
    nombre: "Santander",
    ciudades: ["Bucaramanga", "Floridablanca", "Barrancabermeja", "Girón", "Piedecuesta", "San Gil"],
    info: "Fondos vinculados a hidrocarburos y educación superior."
  },
  {
    nombre: "Atlántico",
    ciudades: ["Barranquilla", "Soledad", "Malambo", "Sabanalarga", "Puerto Colombia"],
    info: "Eje logístico y comercial con fondos de sector portuario."
  },
  {
    nombre: "Bolívar",
    ciudades: ["Cartagena", "Magangué", "Turbaco", "El Carmen de Bolívar"],
    info: "Fondos del sector turístico y petroquímico."
  },
  {
    nombre: "Huila",
    ciudades: ["Neiva", "Pitalito", "Garzón", "La Plata"],
    info: "Fondos cooperativos y de servicios públicos regionales."
  },
  {
    nombre: "Eje Cafetero",
    ciudades: ["Pereira", "Manizales", "Armenia", "Dosquebradas", "Santa Rosa de Cabal"],
    info: "Fondos de servicios, salud y sector cafetero."
  }
];

const Territorios: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState(DEPARTAMENTOS_COLOMBIA[0]);

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h2 className="text-2xl font-black text-[#002D57]">Explorador de Territorios</h2>
        <p className="text-slate-500">Analiza las alternativas de ciudades por departamento para optimizar tu estrategia de extracción.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Listado de Departamentos */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Departamentos</h3>
          {DEPARTAMENTOS_COLOMBIA.map((dept) => (
            <button
              key={dept.nombre}
              onClick={() => setSelectedDept(dept)}
              className={`w-full text-left px-5 py-4 rounded-2xl transition-all font-bold text-sm flex justify-between items-center ${
                selectedDept.nombre === dept.nombre
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'bg-white text-slate-600 hover:bg-blue-50'
              }`}
            >
              {dept.nombre}
              <span className="text-[10px] opacity-60 bg-black/10 px-2 py-0.5 rounded-full">
                {dept.ciudades.length}
              </span>
            </button>
          ))}
        </div>

        {/* Detalle de Ciudades Alternativas */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-yellow-400 rounded-2xl text-[#002D57]">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800">{selectedDept.nombre}</h3>
                <p className="text-slate-500 text-sm">{selectedDept.info}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedDept.ciudades.map((ciudad) => (
                <div 
                  key={ciudad}
                  className="p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-blue-300 hover:bg-white transition-all cursor-default"
                >
                  <p className="font-bold text-slate-800 group-hover:text-blue-600">{ciudad}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Potencial de Fondos</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <h4 className="text-blue-900 font-bold text-sm mb-2 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Consejo Estratégico
              </h4>
              <p className="text-xs text-blue-800 leading-relaxed">
                Utiliza estas ciudades alternativas en el <strong>IA Scraper</strong> para ampliar tu base de datos. 
                Muchos fondos regionales tienen su sede principal en ciudades intermedias, no solo en las capitales departamentales.
              </p>
            </div>
          </div>
          
          <div className="bg-[#002D57] p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">¿Quieres automatizar la búsqueda en {selectedDept.nombre}?</h3>
                <p className="text-blue-200 text-sm opacity-80 max-w-lg">
                  Nuestra IA puede realizar barridos secuenciales en todas las ciudades listadas para asegurar que no se escape ningún fondo relevante de este territorio.
                </p>
                <button className="mt-6 bg-yellow-400 text-[#002D57] px-8 py-3 rounded-xl font-black hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/20">
                  Lanzar Barrido Territorial
                </button>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Territorios;
