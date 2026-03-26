// handler/fnDocumentosMalla.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { badRequest, okey, serverError } from "../shared/utils/httpResponses";
import { VdmCondocalmRequest } from "../schemas/schemaVdmCondocalm";
import { mockMallaDocumentos } from "../mocks/acps-mso-documentos-mock";

// URL del microservicio OnPremise acps-mso-documentos
const MICROSERVICIO_URL = process.env.ACPS_MSO_DOCUMENTOS_URL ?? "";

// Códigos fijos de la malla documental para apertura de cuenta jurídica
const MALLA_CODIGOS = {
  productcode:    process.env.MALLA_PRODUCTCODE    ?? "",
  subproductcode: process.env.MALLA_SUBPRODUCTCODE ?? "",
  docclasscode:   process.env.MALLA_DOCCLASSCODE   ?? "",
  doctypecode:    process.env.MALLA_DOCTYPECODE    ?? "",
  accountid:      process.env.MALLA_ACCOUNTID      ?? "",
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {

    // Validar body
    if (!event.body) {
      return badRequest("Cuerpo de la solicitud vacío");
    }

    // Validar y parsear con Zod
    const parsed = VdmCondocalmRequest.safeParse(JSON.parse(event.body));
    console.log("Parsed Request:", parsed);

    if (!parsed.success) {
      console.error("Trazabilidad: Formato de entrada inválido");
      return badRequest("Datos de entrada inválidos");
    }

    const data = parsed.data;
    const numeroIdentificacion = data.clienteEmpresa.numeroIdentificacion;

    console.log("DATOS DE POWER PLATFORM:", data);
    console.log("Llamando a acps-mso-documentos para:", numeroIdentificacion);

    // ─── MOCK TEMPORAL ───────────────────────────────────────────
    // Comentar cuando se tenga acceso al OnPremise
    const resultadoVdm = mockMallaDocumentos[numeroIdentificacion];

    // ─── LLAMADA REAL AL ONPREMISE ────────────────────────────────
    // Descomentar cuando se tenga acceso al OnPremise
    // const response = await fetch(`${MICROSERVICIO_URL}/consultarMallaDocumentos`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     tipoIdentificacion:   data.clienteEmpresa.tipoIdentificacion,
    //     numeroIdentificacion: numeroIdentificacion,
    //     tipoCompania:         data.clienteEmpresa.tipoCompania,
    //     usuario:              data.datosSistema.usuario,
    //     canal:                data.datosSistema.canal,
    //     productcode:    MALLA_CODIGOS.productcode,
    //     subproductcode: MALLA_CODIGOS.subproductcode,
    //     docclasscode:   MALLA_CODIGOS.docclasscode,
    //     doctypecode:    MALLA_CODIGOS.doctypecode,
    //     accountid:      MALLA_CODIGOS.accountid,
    //   }),
    // });
    // if (!response.ok) {
    //   console.error("Trazabilidad: Error técnico en acps-mso-documentos [Escenario 4]:", response.status);
    //   return serverError("Error técnico del servicio");
    // }
    // const resultadoVdm = await response.json() as VdmCondocalmResponse;
    // ─────────────────────────────────────────────────────────────

    console.log("Respuesta de acps-mso-documentos:", resultadoVdm);

    // Escenario 3: Empresa no existe en VDM
    if (!resultadoVdm || resultadoVdm.cantidadDocumentosVigentes === undefined) {
      console.log("Trazabilidad: Empresa no encontrada en VDM [Escenario 3]");
      return okey("Empresa no existe en VDM", {
        tipoIdentificacion:         data.clienteEmpresa.tipoIdentificacion,
        numeroIdentificacion:       numeroIdentificacion,
        cantidadDocumentosVigentes: 0,
        documentosExistentes:       [],
      });
    }

    // Escenario 2: Empresa existe pero sin documentos vigentes
    if (resultadoVdm.cantidadDocumentosVigentes === 0) {
      console.log("Trazabilidad: Empresa sin documentos vigentes [Escenario 2]");
      return okey("Empresa sin documentos vigentes", {
        tipoIdentificacion:         data.clienteEmpresa.tipoIdentificacion,
        numeroIdentificacion:       numeroIdentificacion,
        cantidadDocumentosVigentes: 0,
        documentosExistentes:       [],
      });
    }

    // Escenario 1: Empresa con documentos vigentes
    console.log("Trazabilidad: Documentos vigentes encontrados [Escenario 1]");
    return okey("Consulta exitosa", {
      tipoIdentificacion:         data.clienteEmpresa.tipoIdentificacion,
      numeroIdentificacion:       numeroIdentificacion,
      cantidadDocumentosVigentes: resultadoVdm.cantidadDocumentosVigentes,
      documentosExistentes:       resultadoVdm.documentosExistentes,
    });

  } catch (error) {
    console.error("Trazabilidad: Error técnico registrado [Escenario 4]:", error);
    return serverError("Error técnico del servicio");
  }
};