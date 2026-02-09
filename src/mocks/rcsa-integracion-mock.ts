export const mockRcsaCoincidencias: Record<string, any> = {
  "1234567890": {
    tipoIdentificacion: "C",
    numeroIdentificacion: "1234567890",
    cantidadCoincidencias: 2,
    detalleCoincidencias: [
      {
        tipoLista: "PEP",
        fechaDeteccion: "2025-11-20T08:30:00.000Z",
        nivelRiesgo: "ALTO",
        estado: "ACTIVO",
        observaciones: "Persona Expuesta Políticamente - Accionista mayoritario",
        fechaActualizacion: "2026-01-15T14:20:00.000Z",
      },
      {
        tipoLista: "OFAC",
        fechaDeteccion: "2025-12-05T10:15:00.000Z",
        nivelRiesgo: "CRITICO",
        estado: "ACTIVO",
        observaciones: "Lista de sanciones internacionales",
        fechaActualizacion: "2026-02-01T09:45:00.000Z",
      }
    ]
  },
  "9876543210": {
    tipoIdentificacion: "C",
    numeroIdentificacion: "9876543210",
    cantidadCoincidencias: 1,
    detalleCoincidencias: [
      {
        tipoLista: "LAFT",
        fechaDeteccion: "2026-01-10T16:45:00.000Z",
        nivelRiesgo: "MEDIO",
        estado: "EN_REVISION",
        observaciones: "Posible coincidencia en lista de lavado de activos",
        fechaActualizacion: "2026-02-08T11:30:00.000Z",
      }
    ]
  },
  "P123456789": {
    tipoIdentificacion: "P",
    numeroIdentificacion: "P123456789",
    cantidadCoincidencias: 1,
    detalleCoincidencias: [
      {
        tipoLista: "PEP",
        fechaDeteccion: "2025-12-15T12:00:00.000Z",
        nivelRiesgo: "ALTO",
        estado: "ACTIVO",
        observaciones: "Funcionario público extranjero",
        fechaActualizacion: "2026-01-20T10:15:00.000Z",
      }
    ]
  },
  "5555555555": {
    tipoIdentificacion: "C",
    numeroIdentificacion: "5555555555",
    cantidadCoincidencias: 0,
    detalleCoincidencias: []
  }
};
