import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  badRequest,
  okey,
  serverError,
} from "../shared/utils/httpResponses";
import { BPMSincronizacionRequest } from "../schemas/schemaBpmSincronizacion";
import { mockBpmSincronizacion } from "../mocks/bpm-sincronizacion-mock";

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

    const resultado = mockBpmSincronizacion[trazabilidadBPM.idBPM] || {
      resultado: "Error",
      codigoError: 404,
      detalleErrores: ["El ID BPM no fue encontrado"]
    };

    console.log("Resultado de sincronización:", resultado);

    if (resultado.resultado === "Error") {
      return {
        statusCode: resultado.codigoError,
        body: JSON.stringify({
          code: resultado.codigoError,
          description: "Error en sincronización",
          data: { datosDelSistema: resultado }
        })
      };
    }

    return okey("Sincronización BPM exitosa", { datosDelSistema: resultado });
  } catch (error) {
    console.error("Error:", error);
    return serverError("Error interno del servidor");
  }
};
