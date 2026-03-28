import { APIGatewayProxyEventV2 } from "aws-lambda";
import {
  badRequest,
  notFound,
  okey,
  serverError,
} from "../shared/utils/httpResponses";
import { validRucRegex } from "../shared/utils/validateId";
import {
  buildLatiniaRequest,
  sendToLatiniaLambda,
} from "../shared/utils/notificacionLatinia";

import { z } from "zod";
import { obtenerToken } from "../shared/utils/authLatinia";
import { NotificacionClienteActivacionInputSchema, NotificacionClienteAprobacionInputSchema } from "../schemas/schemaNotificacion-cliente";
import dotenv from "dotenv";
dotenv.config();

const schemaByTipo: Record<string, z.ZodSchema> = {
  APROBACION: NotificacionClienteAprobacionInputSchema,
  ACTIVACION: NotificacionClienteActivacionInputSchema,
};

export const handler = async (event: APIGatewayProxyEventV2) => {
  try {
    if (!event.body) return badRequest("Cuerpo de la solicitud vacío");

    const rawRequest = JSON.parse(event.body);
    const { tipoNotificacion, ruc, rucCliente } = rawRequest;

    if (!tipoNotificacion)
      return notFound("Adjuntar un tipo de notificación válido");

    const schema = schemaByTipo[tipoNotificacion];
    if (!schema) return notFound("Tipo de notificación no soportado");

    if (!validRucRegex.test(ruc) || !validRucRegex.test(rucCliente))
      return badRequest("RUC inválido");

    const parsed = schema.safeParse(rawRequest);
    if (!parsed.success) return badRequest("Datos de entrada inválidos");

    const latiniaRequest = buildLatiniaRequest(rawRequest);
    console.log("Latinia Request:", JSON.stringify(latiniaRequest, null, 2));
    console.log("EL SCOPE ES: ", process.env.SCOPE);
    const token = await obtenerToken();
    const result = await sendToLatiniaLambda(latiniaRequest, token);

    if (!result.success)
      return serverError("Error al enviar notificación a Latinia");

    return okey("Envío exitoso", { transactionId: result.transactionId });
  } catch (error) {
    console.error("Error:", error);
    return serverError("Error al procesar la notificación");
  }
};
 