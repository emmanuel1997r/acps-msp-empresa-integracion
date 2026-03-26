import { z } from "zod";

// VDM Condocalm Request
export const VdmCondocalmRequest = z.object({
  // Cliente Empresa
  clienteEmpresa: z.object({
    tipoIdentificacion: z.string(),       
    numeroIdentificacion: z.string(),      
    tipoCompania: z.string(),             
  }),

  // Datos del sistema
  datosSistema: z.object({
    usuario: z.string(),                  
    canal: z.string(),                    
  }),
});

// VDM Condocalm Response
export const VdmCondocalmResponse = z.object({
  // Documentos existentes y vigentes
  documentosExistentes: z.object({
        tipoIdentificacion: z.string(),        
        numeroIdentificacion: z.string(),      
        cantidadDocumentosVigentes: z.number(), 
            documentos: z.array(z.object({
            tipoDocumento: z.string(),           
            mandatorio: z.string(),              
            reqDigitalizar: z.string(),          
            excepcionable: z.string(),           
            digitalizado: z.string(),            
            fechaDigitalizado: z.string(),       
    })),
  }),
});

export type VdmCondocalmRequest = z.infer<typeof VdmCondocalmRequest>;
export type VdmCondocalmResponse = z.infer<typeof VdmCondocalmResponse>;