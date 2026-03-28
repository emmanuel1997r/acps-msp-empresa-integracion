import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import busboy from "busboy";
import { badRequest, okey, serverError } from "../shared/utils/httpResponses";
import { NotificacionClienteRequest } from "../schemas/schemaDocumentosCliente";
import { buildLatiniaRequest, FileAttachment, sendToLatiniaLambda } from "../shared/utils/notificacionLatinia";
import { obtenerToken } from "../shared/utils/authLatinia";

import dotenv from "dotenv";
dotenv.config();


interface ParsedFormData {
  fields: Record<string, string>;
  files: FileAttachment[];
}

const parseFormData = (
  event: APIGatewayProxyEvent
): Promise<ParsedFormData> => {
  return new Promise((resolve, reject) => {
    const contentType =
      event.headers["content-type"] || event.headers["Content-Type"];

    if (!contentType?.includes("multipart/form-data")) {
      reject(new Error("Content-Type debe ser multipart/form-data"));
      return;
    }

    const bb = busboy({
      headers: { "content-type": contentType },
      limits: { fileSize: 10 * 1024 * 1024, files: 10 },
    });

    const fields: Record<string, string> = {};
    const files: FileAttachment[] = [];

    bb.on("field", (name: string, value: string) => {
      fields[name] = value;
    });

    bb.on("file", (name: string, file: any, info: any) => {
      const { filename, mimeType } = info;
      const chunks: Buffer[] = [];

      file.on("data", (chunk: Buffer) => chunks.push(chunk));
      file.on("end", () => {
        files.push({
          nombre: filename || `archivo_${Date.now()}`,
          contenido: Buffer.concat(chunks).toString("base64"),
          tipo: mimeType || "application/octet-stream",
        });
      });
    });

    bb.on("finish", () => resolve({ fields, files }));
    bb.on("error", () => reject(new Error("Error al procesar archivos")));

    const body = event.isBase64Encoded
      ? Buffer.from(event.body || "", "base64")
      : Buffer.from(event.body || "", "utf8");

    bb.write(body);
    bb.end();
  });
};

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const { fields, files } = await parseFormData(event);

    if (files.length === 0) {
      return badRequest("Debe enviar al menos un archivo");
    }
    const latiniaRequest = buildLatiniaRequest(fields, files);
    console.log("Latinia Request:");
    const token = await obtenerToken();
    console.log("valor del token", token);
    const datosSistema = {
      usuario: fields.usuario,
      fecha: fields.fecha || new Date().toISOString().split("T")[0],
      hora: fields.hora || new Date().toTimeString().split(" ")[0],
      canal: fields.canal,
    };

    const requestData = {
      latinia: {
        tipoNotificacion: fields.tipoNotificacion,
        rucCliente: fields.rucCliente,
        correoCliente: fields.correoCliente,
        archivosAdjuntar: files,
        parametrosDinamicos: {
          rucCliente: fields.rucCliente,
          razonSocial: fields.razonSocial,
          tipoCuenta: fields.tipoCuenta,
          documentosPedir: fields.documentosPedir,
        },
      },
      datosSistema,
    };

    const parsed = NotificacionClienteRequest.safeParse(requestData);
    if (!parsed.success) {
      console.error("Validation errors:", parsed.error);
      return badRequest(`Datos inválidos: ${parsed.error.message}`);
    }

    const result = await sendToLatiniaLambda(latiniaRequest, token);

    if (!result.success)
      return serverError("Error al enviar notificación a Latinia");

    return okey("Notificación enviada exitosamente", {
      transactionId: result.transactionId,
      archivos: files.map((f) => ({ nombre: f.nombre, tipo: f.tipo })),
    });
  } catch (error) {
    console.error("Error processing notification:", error);
    return serverError("Error interno del servidor");
  }
};



