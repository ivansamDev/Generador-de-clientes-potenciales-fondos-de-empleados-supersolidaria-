
import React, { useState } from 'react';
import { FondoEmpleado } from '../types';

interface LeadsTableProps {
  leads: FondoEmpleado[];
  onRemove: (id: string) => void;
  onUpdateStatus?: (id: string, status: FondoEmpleado['estado_lead']) => void;
}

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, onRemove, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrado de leads basado en el término de búsqueda extendido
  const filteredLeads = leads.filter(l => 
    l.nombre_fondo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.email && l.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (l.nit && l.nit.includes(searchTerm)) ||
    (l.representante_legal && l.representante_legal.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportToCSV = () => {
    if (leads.length === 0) return;
    
    const headers = [
      "Nombre del Fondo", 
      "Sigla",
      "NIT", 
      "Dirección",
      "Ciudad", 
      "Departamento", 
      "Email Principal", 
      "Teléfono de Contacto", 
      "Sitio Web", 
      "Representante Legal",
      "Nivel de Supervisión",
      "Segmento de Valor",
      "Estado del Lead",
      "Fecha de Extracción",
      "URL de la Fuente"
    ];

    const rows = leads.map(l => [
      l.nombre_fondo,
      l.sigla || 'N/A',
      l.nit || 'N/A',
      l.direccion || 'N/A',
      l.ciudad,
      l.departamento,
      l.email || 'N/A',
      l.telefono || 'N/A',
      l.sitio_web || 'N/A',
      l.representante_legal || 'No especificado',
      l.nivel_supervision,
      l.segmento,
      l.estado_lead,
      new Date(l.fecha_extraccion).toLocaleString(),
      l.fuente_url || 'Búsqueda Directa'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(field => {
        const value = (field || '').toString().replace(/"/g, '""');
        return `"${value}"`;
      }).join(','))
    ].join('\n');

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Campaña_Marketing_SuperSolidaria_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Directorio de Gestión</h2>
            <p className="text-slate-500 mt-1">Base de datos enriquecida con representantes legales y segmentación.</p>
          </div>
        </div>
        <button
          onClick={exportToCSV}
          disabled={leads.length === 0}
          className="bg-[#002D57] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-900 disabled:opacity-50 transition-all shadow-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Exportar Base CRM (CSV)
        </button>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre, representante, NIT, ciudad o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-2/3 pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm shadow-sm"
            />
            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#002D57] text-white text-[10px] uppercase tracking-widest font-black">
              <tr>
                <th className="px-6 py-5">Fondo / Representante</th>
                <th className="px-6 py-5">Información Legal</th>
                <th className="px-6 py-5">Contacto y Web</th>
                <th className="px-6 py-5">Estatus / Segmento</th>
                <th className="px-6 py-5">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-800 leading-tight mb-1">{lead.nombre_fondo}</p>
                    <div className="flex items-center gap-2">
                      <span className="p-1 bg-slate-100 rounded text-[10px] text-slate-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      </span>
                      <p className="text-xs font-semibold text-blue-600">{lead.representante_legal || 'Representante no definido'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-slate-700 font-medium">NIT: {lead.nit || '---'}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{lead.ciudad}, {lead.departamento}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-slate-800 font-bold">{lead.email || 'Sin correo'}</p>
                    <p className="text-xs text-slate-500">{lead.telefono || 'Sin teléfono'}</p>
                    {lead.sitio_web && (
                      <a href={lead.sitio_web} target="_blank" rel="noreferrer" className="text-[10px] text-blue-500 hover:underline mt-1 block truncate max-w-[150px]">
                        {lead.sitio_web}
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-2">
                      <select 
                        value={lead.estado_lead}
                        onChange={(e) => onUpdateStatus?.(lead.id, e.target.value as any)}
                        className={`block w-full p-2 rounded-lg text-[10px] font-black uppercase border-none outline-none ${
                          lead.estado_lead === 'Nuevo' ? 'bg-blue-100 text-blue-700' :
                          lead.estado_lead === 'Contactado' ? 'bg-yellow-100 text-yellow-700' :
                          lead.estado_lead === 'Interesado' ? 'bg-green-100 text-green-700' :
                          'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <option value="Nuevo">Nuevo</option>
                        <option value="Contactado">Contactado</option>
                        <option value="Interesado">Interesado</option>
                        <option value="Descartado">Descartado</option>
                      </select>
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        lead.segmento === 'Premium (Grande)' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {lead.segmento}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <button 
                      onClick={() => onRemove(lead.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-xl"
                      title="Eliminar registro"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic font-medium bg-slate-50/30">
                    {leads.length === 0 ? "No hay registros disponibles. Usa el Scraper o el Scanner de datos para poblar la base." : "No se encontraron resultados para tu búsqueda."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeadsTable;
