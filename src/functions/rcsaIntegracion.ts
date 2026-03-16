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
    
    // const resultado = mockRcsaCoincidencias[data.clienteEmpresa.numeroIdentificacion];
    
    // console.log("Resultado de búsqueda:", resultado);
    
    // return okey("Consulta exitosa", resultado);

  
    // 1. Obtener los IDs de los 3 objetos
    const idsABuscar = [
      data.clienteEmpresa.numeroIdentificacion,
      data.legalFirmante.numeroIdentificacion,
      data.accionistaBeneficiario?.numeroIdentificacion // El ? por si es opcional
    ].filter(Boolean); // Quitamos nulos o vacíos

    // 2. Buscar y consolidar
    let totalCoincidencias = 0;
    let todosLosDetalles: any[] = [];

    console.log("****************************");
    console.log("ARREGLO" , idsABuscar);
    idsABuscar.forEach(id => {
      const hallazgo = mockRcsaCoincidencias[id as string];
      if (hallazgo) {
        totalCoincidencias += hallazgo.cantidadCoincidencias;
        todosLosDetalles = [...todosLosDetalles, ...hallazgo.detalleCoincidencias];
      }
      console.log("******************************************666888*");
      console.log("Los Id del moks: ", hallazgo);
    });


    // 3. Armar la respuesta final según la Matriz de Output
    const respuestaConsolidada = {
      tipoIdentificacion: data.clienteEmpresa.tipoIdentificacion,
      numeroIdentificacion: data.clienteEmpresa.numeroIdentificacion,
      cantidadCoincidencias: totalCoincidencias,
      detalleCoincidencias: todosLosDetalles
    };
    
    // Escenario 2: Existen coincidencias
    //return okey("Consulta exitosa", respuestaConsolidada);
    // Escenario 2: Existen coincidencias
    if (totalCoincidencias > 0) {
      console.log("Trazabilidad: Coincidencias encontradas. Enviando a UDC.");
      return okey("Consulta exitosa", respuestaConsolidada);
    } 
    
    // Escenario 1: No existen coincidencias (Por defecto si llega aquí es 0)
    console.log("Trazabilidad: Sin coincidencias.");
    return okey("Sin coincidencias", { 
      tipoIdentificacion: data.clienteEmpresa.tipoIdentificacion,
        numeroIdentificacion: data.clienteEmpresa.numeroIdentificacion,
        cantidadCoincidencias: 0, 
        detalleCoincidencias: [] 
    });

  } catch (error) {
    console.error("Error:", error);
    return serverError("Error interno del servidor");
  }
};
