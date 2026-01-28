import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { badRequest, okey, serverError } from "../shared/utils/httpResponses";
import { RCSAIntegracionRequest } from "./schema";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return badRequest("Cuerpo de la solicitud vacío");
    }

    const parsed = RCSAIntegracionRequest.safeParse(JSON.parse(event.body));

    if (!parsed.success) {
      return badRequest("Datos de entrada inválidos");
    }

    return okey("Consulta exitosa");
  } catch (error) {
    console.error("Error:", error);
    return serverError("Error interno del servidor");
  }
};
