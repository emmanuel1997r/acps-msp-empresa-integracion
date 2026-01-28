import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  badRequest,
  notFound,
  okey,
  serverError,
} from "../shared/utils/httpResponses";
import { ArchivoNegativoIntegracionRequest } from "./schema";
import { mockArchivoNegativo } from "../mocks/archivo-negativo-mock";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return badRequest("Cuerpo de la solicitud vacío");
    }

    const parsed = ArchivoNegativoIntegracionRequest.safeParse(JSON.parse(event.body));

    if (!parsed.success) {
      return badRequest("Datos de entrada inválidos");
    }

    const { numeroIdentificacion } = parsed.data;
    const response = mockArchivoNegativo[numeroIdentificacion];

    if (!response) {
      return notFound();
    }

    return okey("Consulta exitosa", response);
  } catch (error) {
    console.error("Error:", error);
    return serverError("Error interno del servidor");
  }
};
