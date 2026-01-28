import { z } from 'zod';

export const IdentificacionBaseSchema = z.object({
  tipoIdentificacion: z.string(),
  numeroIdentificacion: z.string(),
  fechaExpedicion: z.string(),
  fechaCaducidad: z.string()
});

export const PersonaBaseSchema = z.object({
  nombres: z.string(),
  apellidos: z.string()
}).extend(IdentificacionBaseSchema.shape);

export const DireccionBaseSchema = z.object({
  tipoDireccion: z.string(),
  ciudad: z.string(),
  parroquia: z.string(),
  sector: z.string(),
  ciudadela: z.string(),
  direccion: z.string(),
  referencia: z.string(),
  telefono: z.string(),
  extension: z.string().optional()
});

export const DatosExtranjeroSchema = z.object({
  esExtranjero: z.boolean(),
  resideEnEcuador: z.boolean().optional(),
  anosResidencia: z.number().optional(),
  fechaIngresoPais: z.string().optional(),
  paisOrigenPasaporte: z.string().optional(),
  tipoVisa: z.string().optional()
}).extend(IdentificacionBaseSchema.partial().shape);

// Types inferidos
export type PersonaBase = z.infer<typeof PersonaBaseSchema>;
export type IdentificacionBase = z.infer<typeof IdentificacionBaseSchema>;
export type DireccionBase = z.infer<typeof DireccionBaseSchema>;
export type DatosExtranjero = z.infer<typeof DatosExtranjeroSchema>