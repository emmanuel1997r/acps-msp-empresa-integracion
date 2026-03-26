import { z } from "zod";

export const NotificacionCab = z.object({
  tipoNotificacion: z.string().min(1),
  ruc: z.string().min(13).max(13),
  correoCliente: z.email(),
  usuario: z.string().min(1),
  fecha: z.string().min(1),
  hora: z.string().min(1),
  canal: z.string().min(1),
});

export const NotificacionTemplateAprobacion = z.object({
  rucCliente: z.string().min(13).max(13),
  razonSocial: z.string().min(1),
  depositoInicial: z.coerce.number().nonnegative(),
  tipoCuenta: z.string().min(1),
  numeroCuenta: z.string().min(1),
});

export const NotificacionTemplateActivacion = z.object({
  rucCliente: z.string().min(13).max(13),
  razonSocial: z.string().min(1),
  tipoCuenta: z.string().min(1),
  numeroCuenta: z.string().min(1),
});

export const NotificacionClienteAprobacionInputSchema = NotificacionCab.extend(
  NotificacionTemplateAprobacion.shape,
);

export const NotificacionClienteActivacionInputSchema = NotificacionCab.extend(
  NotificacionTemplateActivacion.shape,
);

export type NotificacionCab = z.infer<typeof NotificacionCab>;
export type NotificacionTemplate1 = z.infer<
  typeof NotificacionTemplateAprobacion
>;
export type NotificacionClienteAprobacionInput = z.infer<
  typeof NotificacionClienteAprobacionInputSchema
>;

export type NotificacionClienteActivacionInput = z.infer<
  typeof NotificacionClienteActivacionInputSchema
>;
 