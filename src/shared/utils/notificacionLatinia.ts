import dotenv from "dotenv";
dotenv.config();
export interface LatiniaRequest {
  header: {
    id: string;
    refCompany: string;
    refService: string;
    keyValue: string;
    channels: string;
    refMsgLabel: string;
  };
  info: {
    loginEnterprise: string;
    refContract: string;
  };
  data: Record<string, any>;
  addresses: Array<{ className: string; type: string; ref: string }>;
  contents: Array<{
    value: string;
    type: string;
    encoding: string;
    name: string;
  }>;
}

export interface LatiniaResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface FileAttachment {
  nombre: string;
  contenido: string;
  tipo: string;
}

const TIPO_NOTIFICACION_CONFIG: Record<
  string,
  { refService: string; refContract: string }
> = {
  APROBACION: { 
        refService:  process.env.APROBACION_REF_SERVICE || "APROBACION_CTA",
        refContract: process.env.APROBACION_REF_CONTRACT || "APROBACION_CTA" },
  ACTIVACION: { 
        refService: process.env.ACTIVACION_REF_SERVICE || "ACTIVACION_CTA", 
        refContract: process.env.ACTIVACION_REF_CONTRACT || "ACTIVACION_CTA" },
  ENVIO_DOCUMENTOS: { 
    refService: process.env.ENVIO_DOCUMENTOS_REF_SERVICE || "REFAV", 
    refContract: process.env.ENVIO_DOCUMENTOS_REF_CONTRACT || "REFAV" },
};
// Función para generar ID con formato RECYYYYMMDDHHmmss00001
function generarIdUnico(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  // sufijo incremental/aleatorio para evitar colisiones
  const suffix = String(Math.floor(Math.random() * 99999)).padStart(5, "0");

  return `REC${year}${month}${day}${hours}${minutes}${seconds}${suffix}`;
}

export function buildLatiniaRequest(
  fields: Record<string, any>,
  files: FileAttachment[] = []
): LatiniaRequest {
  const {
    tipoNotificacion,
    rucCliente,
    razonSocial,
    tipoCuenta,
    correoCliente,
    usuario,
    fecha,
    hora,
    numeroCuenta,
    depositoInicial,
    documentosPedir,
  } = fields;
  console.log("In buildLatiniaRequest");
  console.log("Fields:", JSON.stringify(fields, null, 2));

  const config = TIPO_NOTIFICACION_CONFIG[tipoNotificacion];
  console.log("SERVICESSSSS: ", config.refService);
  console.log("CONTRACTTTTT: ", config.refContract);
  const data: Record<string, any> = {
    rucCliente,
    razonSocial,
    tipoCuenta,
    email: correoCliente,
    usuario,
    fecha,
    hora,
  };

  if (numeroCuenta) data.numeroCuenta = numeroCuenta;
  if (depositoInicial !== undefined) data.depositoInicial = depositoInicial;
  if (documentosPedir) data.documentosPedir = documentosPedir;

  return {
    header: {
      id: generarIdUnico() || "REC20210506121500000001",
      refCompany: process.env.REF_COMPANY || "BOLIVARIANO",
      refService: config.refService,
      keyValue: "355490",
      channels: fields.canal,
      refMsgLabel: process.env.DEFAULT_MSG_LABEL || "Avisos24",
    },
    info: {
      loginEnterprise: process.env.LOGIN_ENTERPRISE || "BOLIVARIANO",
      refContract: config.refContract,
    },
    data,
    addresses: [{ className: "email", type: "to", ref: correoCliente }],
    contents: files.map((file) => ({
      value: file.contenido,
      type: file.tipo,
      encoding: "base64",
      name: file.nombre.replace(/[^a-zA-Z0-9._-]/g, "_"),
    })),
  };
}

export async function sendToLatiniaLambda(
  latiniaRequest: LatiniaRequest,
  token: any
): Promise<LatiniaResponse> {
  const LATINIA_URL = process.env.LATINIA_URL;
  console.log("latinia url: ", LATINIA_URL);
  console.log("Latinia Request 2:", JSON.stringify(latiniaRequest, null, 2));

  // Simulación en local
  if (!LATINIA_URL || LATINIA_URL.includes("localhost")) {
    console.log("Modo simulación: Envío exitoso a Latinia");
    return { success: true, transactionId: latiniaRequest.header.id };
  }

  try {
    const response = await fetch(LATINIA_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(latiniaRequest),
    });

    if (!response.ok) {
        const errorText = await response.text(); 
            console.error("Error de Lambda Latinia:", response.status, response.statusText);
            console.error("Detalle del error:", errorText); 
    return {
    success: false,
    error: `Error ${response.status}: ${response.statusText} - ${errorText}`,
    };
}

    const data: any = await response.json();
    console.log("Respuesta de Lambda Latinia:", JSON.stringify(data, null, 2));
    return {
      success: true,
      transactionId: data.transactionId || latiniaRequest.header.id,
    };
  } catch (error) {
    console.error("Error al llamar a Lambda Latinia:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
 