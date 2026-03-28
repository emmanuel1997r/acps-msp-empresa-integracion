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
      console.error("Trazabilidad: Formato de identificación inválido [Escenario 5]");
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
    let tieneCamposVacios = false;

    console.log("****************************");
    console.log("ARREGLO" , idsABuscar);
    idsABuscar.forEach(id => {
      const hallazgo = mockRcsaCoincidencias[id as string];
      if (hallazgo) {
        totalCoincidencias += hallazgo.cantidadCoincidencias;
        todosLosDetalles = [...todosLosDetalles, ...hallazgo.detalleCoincidencias];

        // Lógica para Escenario 3: Detectar si faltan campos en el detalle
        const incompleto = hallazgo.detalleCoincidencias.some((det: any) => {
          return (
            !det.tipoLista || det.tipoLista.trim() === "" ||
            !det.nivelRiesgo || det.nivelRiesgo.trim() === "" ||
            !det.estado || det.estado.trim() === "" ||
            !det.observaciones || det.observaciones.trim() === ""
          );
        });
        if (incompleto) tieneCamposVacios = true;
      }
      console.log("*******************************************");
      console.log("Los Id del moks: ", hallazgo);
    });


    // 3. Armar la respuesta final según la Matriz de Output
    const respuestaConsolidada = {
      tipoIdentificacion: data.clienteEmpresa.tipoIdentificacion,
      numeroIdentificacion: data.clienteEmpresa.numeroIdentificacion,
      cantidadCoincidencias: totalCoincidencias,
      detalleCoincidencias: todosLosDetalles
    };

    // Escenario 3: Datos incompletos o parciales
    if (tieneCamposVacios) {
      console.log("Trazabilidad: Respuesta parcial detectada [Escenario 3]");
      return okey("Respuesta parcial - Datos incompletos", respuestaConsolidada);
    }
    
    // Escenario 2: Existen coincidencias
    //return okey("Consulta exitosa", respuestaConsolidada);
    // Escenario 2: Existen coincidencias
    if (totalCoincidencias > 0) {
      console.log("Trazabilidad: Coincidencias encontradas. Enviando a UDC. [Escenario 2]");
      return okey("Consulta exitosa", respuestaConsolidada);
    } 
    
    // Escenario 1: No existen coincidencias (Por defecto si llega aquí es 0)
    console.log("Trazabilidad: Sin coincidencias encontradas [Escenario 1].");
    return okey("Sin coincidencias", { 
      tipoIdentificacion: data.clienteEmpresa.tipoIdentificacion,
        numeroIdentificacion: data.clienteEmpresa.numeroIdentificacion,
        cantidadCoincidencias: 0, 
        detalleCoincidencias: [] 
    });

  } catch (error) {
    console.error("Trazabilidad: Error técnico registrado [Escenario 4]:", error);
    return serverError("Error técnico del servicio");
  }
};
