export const mockBpmSincronizacion: Record<string, any> = {
  "BPM-2026-001234": {
    resultado: "Ok",
    idBPM: "BPM-2026-001234"
  },
  "BPM-2026-001235": {
    resultado: "Ok",
    idBPM: "BPM-2026-001235"
  },
  "BPM-2026-001236": {
    resultado: "Ok",
    idBPM: "BPM-2026-001236"
  },
  "BPM-2026-999999": {
    resultado: "Error",
    codigoError: 404,
    detalleErrores: ["El ID BPM no existe en el sistema"]
  },
  "BPM-2026-000001": {
    resultado: "Error",
    codigoError: 409,
    detalleErrores: ["El caso ya fue procesado anteriormente", "No se permiten actualizaciones"]
  }
};
