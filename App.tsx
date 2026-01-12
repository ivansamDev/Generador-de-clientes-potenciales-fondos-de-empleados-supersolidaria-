
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import ScraperConsole from './views/ScraperConsole';
import LeadsDirectory from './views/LeadsDirectory';
import MarketingCampaign from './views/MarketingCampaign';
import { AppView, FondoEmpleado } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [leads, setLeads] = useState<FondoEmpleado[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('solidaria_v2_db');
    if (saved) setLeads(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('solidaria_v2_db', JSON.stringify(leads));
  }, [leads]);

  const addLeads = (newLeads: FondoEmpleado[]) => {
    setLeads(prev => {
      const existingNits = new Set(prev.map(l => l.nit));
      const filtered = newLeads.filter(l => !existingNits.has(l.nit));
      return [...prev, ...filtered];
    });
  };

  const removeLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const updateLeadStatus = (id: string, status: FondoEmpleado['estado_lead']) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, estado_lead: status } : l));
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard leads={leads} onNavigate={setCurrentView} />;
      case 'scraper': return <ScraperConsole onExtract={addLeads} />;
      case 'directorio': return <LeadsDirectory leads={leads} onUpdateStatus={updateLeadStatus} onRemove={removeLead} />;
      case 'marketing': return <MarketingCampaign leads={leads} />;
      default: return <Dashboard leads={leads} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
