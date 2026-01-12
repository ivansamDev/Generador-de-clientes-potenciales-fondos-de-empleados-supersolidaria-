
import { GoogleGenAI, Type } from "@google/genai";
import { FondoEmpleado } from "../types";

// Always use named parameter for apiKey and obtain exclusively from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Utiliza Grounding para buscar y extraer datos reales del sitio oficial.
 */
export const runAIScraper = async (query: string): Promise<FondoEmpleado[]> => {
  // Use gemini-3-pro-preview for complex reasoning and extraction tasks
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Busca en el sitio oficial de la Superintendencia de la Economía Solidaria (supersolidaria.gov.co) 
    y en datos.gov.co información de contacto de fondos de empleados en: ${query}. 
    Extrae: nombre, nit, email, telefono, ciudad, direccion y el nombre del representante legal si está disponible. 
    Clasifica como "Premium" si es de nivel 1 de supervisión.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            nombre_fondo: { type: Type.STRING },
            nit: { type: Type.STRING },
            direccion: { type: Type.STRING },
            ciudad: { type: Type.STRING },
            departamento: { type: Type.STRING },
            email: { type: Type.STRING },
            telefono: { type: Type.STRING },
            sitio_web: { type: Type.STRING },
            representante_legal: { type: Type.STRING },
            nivel_supervision: { type: Type.STRING },
            segmento: { type: Type.STRING },
            fuente_url: { type: Type.STRING }
          },
          required: ["nombre_fondo", "email"]
        }
      }
    }
  });

  try {
    const jsonStr = response.text?.trim() || "[]";
    const data = JSON.parse(jsonStr);
    return data.map((item: any, index: number) => ({
      ...item,
      id: `lead-${Date.now()}-${index}`,
      fecha_extraccion: new Date().toISOString(),
      estado_lead: 'Nuevo'
    }));
  } catch (e) {
    console.error("Error parsing scraper data", e);
    return [];
  }
};

/**
 * Encuentra enlaces oficiales de directorios.
 */
export const findDirectoryLinks = async (): Promise<{ text: string; links: any[] }> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: 'Encuentra los enlaces directos a los directorios de entidades vigiladas (fondos de empleados) en el sitio de la Superintendencia de la Economía Solidaria de Colombia (supersolidaria.gov.co) y datos.gov.co.',
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return {
    text: response.text || '',
    links: links
  };
};

/**
 * Extrae leads estructurados de texto, ahora incluyendo representante legal.
 */
export const extractLeadsFromText = async (text: string): Promise<FondoEmpleado[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Extrae información detallada de fondos de empleados del siguiente texto. 
    Identifica específicamente el nombre del Representante Legal si aparece.
    Devuelve una lista JSON con: nombre_fondo, nit, direccion, ciudad, departamento, email, telefono, sitio_web, representante_legal.
    Texto: ${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            nombre_fondo: { type: Type.STRING },
            nit: { type: Type.STRING },
            direccion: { type: Type.STRING },
            ciudad: { type: Type.STRING },
            departamento: { type: Type.STRING },
            email: { type: Type.STRING },
            telefono: { type: Type.STRING },
            sitio_web: { type: Type.STRING },
            representante_legal: { type: Type.STRING },
            segmento: { type: Type.STRING }
          },
          required: ["nombre_fondo"]
        }
      }
    }
  });

  try {
    const jsonStr = response.text?.trim() || "[]";
    const data = JSON.parse(jsonStr);
    return data.map((item: any, index: number) => ({
      ...item,
      id: `ext-${Date.now()}-${index}`,
      fecha_extraccion: new Date().toISOString(),
      estado_lead: 'Nuevo',
      nivel_supervision: item.nivel_supervision || 'No definido',
      segmento: item.segmento || 'Estándar (Mediano)'
    }));
  } catch (e) {
    console.error("Error extracting leads from text", e);
    return [];
  }
};
