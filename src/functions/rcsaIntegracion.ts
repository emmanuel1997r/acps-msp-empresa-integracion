import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { badRequest, okey, serverError } from "../shared/utils/httpResponses";
import { RCSAIntegracionRequest } from "../schemas/schemaRcsaIntegracion.ts";
import { mockRcsaCoincidencias } from "../mocks/rcsa-integracion-mock";

export const handler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      return badRequest("Cuerpo de la solicitud vacío");
    }

    const parsed = RCSAIntegracionRequest.safeParse(JSON.parse(event.body));
    console.log("Parsed Request:", parsed);
    if (!parsed.success) {
      return badRequest("Datos de entrada inválidos");
    }
    const data = parsed.data;
    
    const resultado = mockRcsaCoincidencias[data.clienteEmpresa.numeroIdentificacion];
    
    console.log("Resultado de búsqueda:", resultado);
    
    return okey("Consulta exitosa", resultado);
  } catch (error) {
    console.error("Error:", error);
    return serverError("Error interno del servidor");
  }
};
