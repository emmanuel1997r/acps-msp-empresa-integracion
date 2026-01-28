import { ArchivoNegativoIntegracionResponse } from '../fn-rcsa-integracion/schema';

export const mockArchivoNegativo: Record<string, ArchivoNegativoIntegracionResponse> = {
  "12345678": {
    tipoIdentificacion: "CC",
    numeroIdentificacion: "12345678",
    cantidadCoincidencias: 1,
    detalleCoincidencias: [
      {
        tipoArchivo: 'CENTRALES_RIESGO',
        fechaIngreso: '2025-12-15T10:30:00.000Z',
        motivo: 'Mora superior a 90 días',
        estado: 'ACTIVO',
        observaciones: 'Deuda pendiente por $2,500,000',
        fechaVencimiento: '2026-06-15T23:59:59.999Z'
      }
    ]
  },
  "900123456-7": {
    tipoIdentificacion: "NIT",
    numeroIdentificacion: "900123456-7",
    cantidadCoincidencias: 0,
    detalleCoincidencias: []
  }
};
