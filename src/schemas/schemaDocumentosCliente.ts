import { z } from "zod";

// Schema para los datos de Latinia
export const LatiniaRequest = z.object({
  tipoNotificacion: z.string().min(1),
  rucCliente: z.string().min(13).max(13),
  correoCliente: z.email(),
  archivosAdjuntar: z.array(
    z.object({
      nombre: z.string(),
      contenido: z.string(), // Base64
      tipo: z.string(),
    })
  ),
  parametrosDinamicos: z.object({
    rucCliente: z.string().min(13).max(13),
    razonSocial: z.string().min(1),
    tipoCuenta: z.string().min(1),
    documentosPedir: z.string().min(1),
  }),
});

// Schema para los datos del sistema
export const DatosSistema = z.object({
  usuario: z.string().min(1),
  fecha: z.string().min(1),
  hora: z.string().min(1),
  canal: z.string().min(1),
});

// Schema completo del request
export const NotificacionClienteRequest = z.object({
  latinia: LatiniaRequest,
  datosSistema: DatosSistema,
});

// Schema del response
export const NotificacionClienteResponse = z.object({
  success: z.boolean(),
  message: z.string(),
  transactionId: z.string().optional(),
});

// Tipos para TypeScript
export type LatiniaRequestType = z.infer<typeof LatiniaRequest>;
export type NotificacionClienteRequestType = z.infer<
  typeof NotificacionClienteRequest
>;
export type NotificacionClienteResponseType = z.infer<
  typeof NotificacionClienteResponse
>;