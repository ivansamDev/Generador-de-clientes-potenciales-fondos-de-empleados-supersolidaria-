
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'scraper', label: 'IA Scraper', icon: '🤖' },
    { id: 'directorio', label: 'Base de Datos', icon: '🗄️' },
    { id: 'marketing', label: 'Campañas Email', icon: '✉️' },
  ];

  return (
    <aside className="w-72 bg-[#002D57] text-white flex flex-col h-screen sticky top-0 shadow-2xl">
      <div className="p-8 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-yellow-400 p-2 rounded-lg text-[#002D57] font-black text-xl">SS</div>
          <h1 className="text-xl font-bold tracking-tight">SuperSolidaria<br/><span className="text-sm font-normal text-blue-300">Market Explorer</span></h1>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          <span className="text-[10px] text-blue-200 uppercase font-bold tracking-widest">En línea - Vercel Ready</span>
        </div>
      </div>
      
      <nav className="flex-1 mt-8 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as AppView)}
            className={`w-full text-left px-5 py-4 rounded-xl transition-all flex items-center gap-4 group ${
              currentView === item.id 
                ? 'bg-blue-600/30 text-white border-l-4 border-yellow-400' 
                : 'text-blue-100/60 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="text-2xl opacity-80 group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="font-semibold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-black/20 p-4 rounded-2xl border border-white/5 text-[10px] text-blue-300">
          <p className="font-bold mb-1 uppercase">Cumplimiento Legal</p>
          <p className="opacity-70 leading-relaxed">Solo datos públicos (Ley 1581/2012). Uso corporativo B2B exclusivamente.</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
