
export type NivelSupervision = '1' | '2' | '3' | 'No definido';
export type SegmentoValor = 'Premium (Grande)' | 'Estándar (Mediano)' | 'Emergente (Pequeño)';

export interface FondoEmpleado {
  id: string;
  nombre_fondo: string;
  nit: string;
  sigla?: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  email: string;
  telefono: string;
  sitio_web: string;
  representante_legal?: string;
  nivel_supervision: NivelSupervision;
  segmento: SegmentoValor;
  fecha_extraccion: string;
  fuente_url: string;
  estado_lead: 'Nuevo' | 'Contactado' | 'Interesado' | 'Descartado';
}

export type AppView = 'dashboard' | 'scraper' | 'directorio' | 'marketing' | 'config';
