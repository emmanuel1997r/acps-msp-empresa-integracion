import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  badRequest,
  okey,
  serverError,
} from "../shared/utils/httpResponses";
import { BPMSincronizacionRequest } from "../schemas/schemaBpmSincronizacion";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return badRequest("Cuerpo de la solicitud vacío");
    }

    const parsed = BPMSincronizacionRequest.safeParse(JSON.parse(event.body));

    if (!parsed.success) {
      return badRequest("Datos de entrada inválidos");
    }

    const { trazabilidadBPM } = parsed.data;

    // Simular respuesta exitosa
    const response = {
      datosDelSistema: {
        resultado: "Ok" as const,
        idBPM: trazabilidadBPM.idBPM
      }
    };

    return okey("Sincronización BPM exitosa", response);
  } catch (error) {
    console.error("Error:", error);
    return serverError("Error interno del servidor");
  }
};
