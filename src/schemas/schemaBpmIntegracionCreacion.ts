import { z } from "zod";

// Creación de Caso de Empresa - Request
export const CreacionCasoEmpresaRequest = z.object({
  // Creación del caso
  ruc: z.string(),
  tipoCuenta: z.string(),
  productoBancario: z.string(),
  origenCuenta: z.string(),
  moneda: z.string(),
  tipoContable: z.string().optional(), // Condicional: Tipo de cuenta=corriente
  categoriaCuenta: z.string(),
  otrasSolicitudes: z.string().optional(),
  clasificacionEmpresa: z.string(),
  fechaConstitucion: z.string(),

  // Registro de firmantes
  firmantes: z.array(z.object({
    tipoIdentificacionFirmante: z.string(),
    numeroIdentificacionFirmante: z.string(),
  })).optional(),

  // Depósito inicial
  depositoInicial: z.number(),

  // Solicitud de chequera
  solicitaChequera: z.boolean(),
  nombreChequera: z.string().optional(),
  autorizadoRetirarChequera: z.string().optional(),
  emisorChequera: z.string().optional(),
  tipoChequera: z.string().optional(),
  oficinaEntrega: z.string().optional(),
  numeroChequeras: z.number().optional(),
  numeroCheques: z.number().optional(),

  // Comunicaciones y Estado de Cuenta
  envioEstadoCuentaDigital: z.boolean(),
  numeroDireccion: z.string().optional(), // Condicional: envioEstadoCuentaDigital = false
  correoElectronico: z.string().optional(), // Condicional: envioEstadoCuentaDigital = true

  // Información de dirección Exterior Representante Legal
  representanteLegal: z.object({
    poseeDireccionExterior: z.boolean(),
    tipoIdentificacion: z.string().optional(),
    numeroIdentificacion: z.string().optional(),
  }),

  // Información de dirección Exterior Firmante
  firmanteDireccionExterior: z.object({
    poseeDireccionExterior: z.boolean(),
    tipoIdentificacion: z.string().optional(),
    numeroIdentificacion: z.string().optional(),
  }),

  // Datos del sistema
  datosDelSistema: z.object({
    usuario: z.string(),
    canal: z.string(),
  }),
});

// Creación de Caso de Empresa - Response
export const CreacionCasoEmpresaResponse = z.object({
  datosDelSistema: z.object({
    resultado: z.enum(['Ok', 'Error']),
    idBPM: z.string().optional(),
    codigoError: z.number().optional(),
    detalleErrores: z.array(z.string()).optional(),
  }),
});

export type CreacionCasoEmpresaRequest = z.infer<typeof CreacionCasoEmpresaRequest>;
export type CreacionCasoEmpresaResponse = z.infer<typeof CreacionCasoEmpresaResponse>;
