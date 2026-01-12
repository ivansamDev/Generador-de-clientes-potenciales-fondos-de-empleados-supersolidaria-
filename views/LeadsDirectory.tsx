
import React from 'react';
import { FondoEmpleado } from '../types';
import LeadsTable from './LeadsTable';

interface LeadsDirectoryProps {
  leads: FondoEmpleado[];
  onUpdateStatus: (id: string, status: FondoEmpleado['estado_lead']) => void;
  // Se añade onRemove para completar la funcionalidad del directorio
  onRemove?: (id: string) => void;
}

const LeadsDirectory: React.FC<LeadsDirectoryProps> = ({ leads, onUpdateStatus, onRemove }) => {
  // Manejador local de eliminación si no se proporciona uno global
  const handleRemove = (id: string) => {
    if (onRemove) {
      onRemove(id);
    } else {
      console.warn("Funcionalidad de eliminación no implementada en este contexto.");
    }
  };

  return (
    <div className="space-y-6">
      <LeadsTable 
        leads={leads} 
        onRemove={handleRemove} 
        onUpdateStatus={onUpdateStatus} 
      />
      
      <div className="mt-8 bg-blue-50 p-6 rounded-3xl border border-blue-100 flex items-start gap-4">
        <div className="p-2 bg-blue-500 text-white rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div>
          <h4 className="font-bold text-blue-900 mb-1">Nota de Cumplimiento B2B</h4>
          <p className="text-sm text-blue-800 opacity-80 leading-relaxed">
            Los datos mostrados han sido extraídos de fuentes públicas oficiales bajo la Ley 1712 de 2014 (Transparencia y del Derecho de Acceso a la Información Pública Nacional). 
            Asegúrese de que sus campañas de marketing cumplan con la Política de Tratamiento de Datos Personales (Ley 1581 de 2012).
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeadsDirectory;
