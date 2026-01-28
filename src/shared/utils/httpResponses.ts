export interface HttpResponse {
  statusCode: number;
  body: string;
}

const jsonResponse = (
  statusCode: number,
  description: string,
  message?: string,
  data?: any
): HttpResponse => ({
  statusCode,
  body: JSON.stringify({
    code: statusCode,
    description,
    ...(message && { message }),
    ...(data && { data }),
  }),
});


export const okey = (message?: string, data?: any) =>
  jsonResponse(200, "Solicitud exitosa", message, data);

export const badRequest = (message?: string) =>
  jsonResponse(400, "Solicitud inválida", message);

export const notFound = (message?: string) =>
  jsonResponse(404, "Recurso no encontrado", message);

export const serverError = (message?: string) =>
  jsonResponse(500, "Error interno del servidor", message);
