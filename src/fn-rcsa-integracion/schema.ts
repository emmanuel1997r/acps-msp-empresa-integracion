import { z } from "zod";

// HU7 - Archivo Negativo Integration Request
export const ArchivoNegativoIntegracionRequest = z.object({
  tipoIdentificacion: z.string(),
  numeroIdentificacion: z.string(),
  usuario: z.string(),
  canal: z.string(),
});

// HU7 - Archivo Negativo Integration Response
export const ArchivoNegativoIntegracionResponse = z.object({
  tipoIdentificacion: z.string(),
  numeroIdentificacion: z.string(),
  cantidadCoincidencias: z.number(),
  detalleCoincidencias: z.array(z.object({
    tipoArchivo: z.string(),
    fechaIngreso: z.string(),
    motivo: z.string(),
    estado: z.string(),
    observaciones: z.string().optional(),
    fechaVencimiento: z.string().optional(),
  })),
});

export type ArchivoNegativoIntegracionRequest = z.infer<typeof ArchivoNegativoIntegracionRequest>;
export type ArchivoNegativoIntegracionResponse = z.infer<typeof ArchivoNegativoIntegracionResponse>;
