import { z } from "zod";

// BPM Sincronización Request
export const BPMSincronizacionRequest = z.object({
  // Trazabilidad de acciones en BPM
  trazabilidadBPM: z.object({
    idBPM: z.string(),
    tipoIdentificacion: z.string(),
    numeroIdentificacion: z.string(),
    accionRealizadaBPM: z.string(),
    numeroCuenta: z.string().optional(), // Condicional: cuando acción = "Aprobación de cuenta por Central de Verificación"
  }),

  // Datos del sistema
  datosDelSistema: z.object({
    usuario: z.string(),
    fecha: z.string(),
    hora: z.string(),
    canal: z.string(),
  }),
});

// BPM Sincronización Response
export const BPMSincronizacionResponse = z.object({
  datosDelSistema: z.object({
    resultado: z.enum(['Ok', 'Error']),
    idBPM: z.string().optional(),
    codigoError: z.number().optional(),
    detalleErrores: z.array(z.string()).optional(),
  }),
});

export type BPMSincronizacionRequest = z.infer<typeof BPMSincronizacionRequest>;
export type BPMSincronizacionResponse = z.infer<typeof BPMSincronizacionResponse>;
