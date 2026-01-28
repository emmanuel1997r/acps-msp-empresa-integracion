import { z } from "zod";

// RCSA Integration Request
export const RCSAIntegracionRequest = z.object({
  // Cliente Empresa
  clienteEmpresa: z.object({
    tipoBusqueda: z.string(),
    tipoVerificacion: z.string(),
    tipoIdentificacion: z.string(),
    numeroIdentificacion: z.string(),
    compania: z.string(), // Razón Social
    nacionalidad: z.string(),
    codigoActividadEconomica: z.string(),
    tipoEmpresa: z.string(),
  }),

  // Legal – Nombramiento / Firmante
  legalFirmante: z.object({
    tipoBusqueda: z.string(),
    tipoVerificacion: z.string(),
    tipoIdentificacion: z.string(),
    numeroIdentificacion: z.string(),
    nombres: z.string(),
    apellidos: z.string(),
    nacionalidad: z.string(),
  }),

  // Accionista/Beneficiario Final
  accionistaBeneficiario: z.object({
    tipoBusqueda: z.string(),
    tipoVerificacion: z.string(),
    tipoIdentificacion: z.string(),
    numeroIdentificacion: z.string(),
    compania: z.string().optional(), // Razón Social
    nombres: z.string().optional(),
    apellidos: z.string().optional(),
    nacionalidad: z.string(),
  }),

  // Datos del sistema
  datosDelSistema: z.object({
    usuario: z.string(),
    canal: z.string(),
  }),
});

// RCSA Integration Response
export const RCSAIntegracionResponse = z.object({
  datosDelSistema: z.object({
    tipoIdentificacion: z.string(),
    numeroIdentificacion: z.string(),
    cantidadCoincidencias: z.number(),
    detalleCoincidencias: z.array(z.object({
      tipoLista: z.string(),
      fechaDeteccion: z.string(),
      nivelRiesgo: z.string(),
      estado: z.string(),
      observaciones: z.string().optional(),
      fechaActualizacion: z.string().optional(),
    })),
  }),
});

export type RCSAIntegracionRequest = z.infer<typeof RCSAIntegracionRequest>;
export type RCSAIntegracionResponse = z.infer<typeof RCSAIntegracionResponse>;
