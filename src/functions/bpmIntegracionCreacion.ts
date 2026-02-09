import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { badRequest, okey, serverError } from "../shared/utils/httpResponses";
import { CreacionCasoEmpresaRequest } from "../schemas/schemaBpmIntegracionCreacion";
export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return badRequest("Cuerpo de la solicitud vacío");
    }

    const parsed = CreacionCasoEmpresaRequest.safeParse(JSON.parse(event.body));

    if (!parsed.success) {
      return badRequest("Datos de entrada inválidos");
    }

    return okey("Creacion exitosa");
  } catch (error) {
    console.error("Error:", error);
    return serverError("Error interno del servidor");
  }
};
