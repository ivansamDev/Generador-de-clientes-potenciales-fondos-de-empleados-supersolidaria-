
import React, { useState } from 'react';
import { FondoEmpleado, SegmentoValor } from '../types';

interface LeadsTableProps {
  leads: FondoEmpleado[];
  onRemove: (id: string) => void;
  onUpdateStatus?: (id: string, status: FondoEmpleado['estado_lead']) => void;
}

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, onRemove, onUpdateStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);

  const statuses: FondoEmpleado['estado_lead'][] = ['Nuevo', 'Contactado', 'Interesado', 'Descartado'];
  const segments: SegmentoValor[] = ['Premium (Grande)', 'Estándar (Mediano)', 'Emergente (Pequeño)'];

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const toggleSegment = (segment: string) => {
    setSelectedSegments(prev => 
      prev.includes(segment) ? prev.filter(s => s !== segment) : [...prev, segment]
    );
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.nombre_fondo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.email && l.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.nit && l.nit.includes(searchTerm)) ||
      (l.representante_legal && l.representante_legal.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(l.estado_lead);
    const matchesSegment = selectedSegments.length === 0 || selectedSegments.includes(l.segmento);

    return matchesSearch && matchesStatus && matchesSegment;
  });

  const copyToClipboard = async () => {
    if (filteredLeads.length === 0) return;

    const headers = [
      "Nombre del Fondo", "Sigla", "NIT", "Dirección", "Ciudad", "Departamento", 
      "Email", "Teléfono", "Sitio Web", "Representante Legal", 
      "Nivel Supervisión", "Segmento", "Estado"
    ];

    const rows = filteredLeads.map(l => [
      l.nombre_fondo,
      l.sigla || '',
      l.nit || '',
      l.direccion || '',
      l.ciudad || '',
      l.departamento || '',
      l.email || '',
      l.telefono || '',
      l.sitio_web || '',
      l.representante_legal || 'No definido',
      l.nivel_supervision || '',
      l.segmento || '',
      l.estado_lead || ''
    ]);

    const textData = [
      headers.join('\t'),
      ...rows.map(row => row.join('\t'))
    ].join('\n');

    try {
      await navigator.clipboard.writeText(textData);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const exportToCSV = () => {
    if (filteredLeads.length === 0) return;
    
    const headers = [
      "Nombre del Fondo", "Sigla", "NIT", "Dirección", "Ciudad", "Departamento", 
      "Email Principal", "Teléfono de Contacto", "Sitio Web", "Representante Legal",
      "Nivel de Supervisión", "Segmento de Valor", "Estado del Lead", "Fecha de Extracción"
    ];

    const rows = filteredLeads.map(l => [
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
      new Date(l.fecha_extraccion).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(field => `"${(field || '').toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Directorio_Completo_SuperSolidaria_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#002D57] rounded-2xl text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Gestión de Directorio</h2>
            <p className="text-slate-500 mt-1">Base de datos unificada con Representantes Legales y NIT.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            disabled={filteredLeads.length === 0}
            className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 ${
              copyFeedback ? 'bg-green-600 text-white' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {copyFeedback ? '¡Copiado!' : 'Copiar para Excel'}
          </button>
          <button
            onClick={exportToCSV}
            disabled={filteredLeads.length === 0}
            className="bg-[#002D57] text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-900 disabled:opacity-50 transition-all shadow-lg flex items-center gap-2"
          >
            Exportar CSV
          </button>
        </div>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar por Fondo, Representante Legal, Ciudad o NIT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm shadow-sm"
              />
              <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 border ${
                showFilters ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
              Filtrar
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white border border-slate-100 rounded-2xl shadow-inner animate-slideDown">
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Estado del Lead</h4>
                <div className="flex flex-wrap gap-2">
                  {statuses.map(status => (
                    <button
                      key={status}
                      onClick={() => toggleStatus(status)}
                      className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                        selectedStatuses.includes(status) ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Segmento</h4>
                <div className="flex flex-wrap gap-2">
                  {segments.map(segment => (
                    <button
                      key={segment}
                      onClick={() => toggleSegment(segment)}
                      className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                        selectedSegments.includes(segment) ? 'bg-amber-600 text-white border-amber-600' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {segment}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#002D57] text-white text-[10px] uppercase tracking-widest font-black">
              <tr>
                <th className="px-6 py-5">Fondo / Entidad</th>
                <th className="px-6 py-5">Representante Legal</th>
                <th className="px-6 py-5">Información Legal</th>
                <th className="px-6 py-5">Contacto Directo</th>
                <th className="px-6 py-5">Estatus</th>
                <th className="px-6 py-5">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-5">
                    <p className="font-bold text-slate-800 leading-tight">{lead.nombre_fondo}</p>
                    {lead.sigla && <p className="text-[10px] text-slate-400 font-medium">({lead.sigla})</p>}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#002D57]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">{lead.representante_legal || 'No identificado'}</p>
                        <p className="text-[9px] text-slate-400 uppercase font-black">Rep. Legal</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-slate-700 font-medium">NIT: {lead.nit || '---'}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{lead.ciudad}, {lead.departamento}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-slate-800 font-bold truncate max-w-[140px]">{lead.email || 'Sin correo'}</p>
                    <p className="text-xs text-slate-500">{lead.telefono || 'Sin teléfono'}</p>
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
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
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
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-400 italic font-medium bg-slate-50/30">
                    No se encontraron registros. Intenta ajustar los filtros o la búsqueda.
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
