
import React, { useState } from 'react';
import { FondoEmpleado } from '../types';

interface MarketingCampaignProps {
  leads: FondoEmpleado[];
}

const MarketingCampaign: React.FC<MarketingCampaignProps> = ({ leads }) => {
  const [template, setTemplate] = useState('Convenio de Beneficios');
  const [subject, setSubject] = useState('Propuesta de Beneficios para {nombre_fondo}');
  const [body, setBody] = useState('Estimado Representante de {nombre_fondo},\n\nNos complace ofrecerle una propuesta exclusiva de bienestar para sus afiliados en {ciudad}. Contamos con servicios de...');

  const leadsWithEmail = leads.filter(l => l.email);

  return (
    <div className="space-y-8 animate-fadeIn">
      <header>
        <h2 className="text-2xl font-black text-[#002D57]">Central de Campañas B2B</h2>
        <p className="text-slate-500">Diseña comunicaciones masivas personalizadas para los fondos.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <span className="p-2 bg-blue-100 rounded-lg text-blue-600">📝</span> Editor de Plantilla
              </h3>
              <div className="space-y-4">
                 <div>
                    <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Asunto del Email</label>
                    <input 
                      type="text" 
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                    />
                 </div>
                 <div>
                    <label className="text-xs font-black uppercase text-slate-400 mb-2 block">Cuerpo del Mensaje</label>
                    <textarea 
                      rows={10}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm leading-relaxed"
                    ></textarea>
                 </div>
                 <div className="flex gap-2">
                    {['{nombre_fondo}', '{ciudad}', '{representante}'].map(tag => (
                      <button 
                        key={tag}
                        onClick={() => setBody(prev => prev + tag)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-[10px] font-bold text-slate-600 border border-slate-300 transition-colors"
                      >
                        Insertar {tag}
                      </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-[#002D57] p-8 rounded-3xl shadow-xl text-white">
              <h3 className="font-bold mb-4">Resumen de Audiencia</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <span className="text-sm opacity-60">Total Leads Disponibles</span>
                    <span className="text-2xl font-black">{leadsWithEmail.length}</span>
                 </div>
                 <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <span className="text-sm opacity-60">Segmento Premium</span>
                    <span className="text-2xl font-black text-yellow-400">{leads.filter(l => l.segmento === 'Premium (Grande)').length}</span>
                 </div>
                 <button className="w-full py-4 bg-yellow-400 text-[#002D57] rounded-2xl font-black hover:bg-yellow-300 transition-all shadow-xl shadow-yellow-400/20">
                    Sincronizar con CRM Externo
                 </button>
                 <p className="text-[10px] text-blue-200 text-center italic">Integraciones disponibles: Mailchimp, Sendinblue, HubSpot</p>
              </div>
           </div>

           <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl">
              <h4 className="text-amber-800 font-black text-xs uppercase mb-2">Aviso de Cumplimiento</h4>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                Esta comunicación debe incluir un enlace de desuscripción y mención explícita a la política de tratamiento de datos personales del emisor.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingCampaign;
