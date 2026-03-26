// mocks/acps-mso-documentos-mock.ts
export const mockMallaDocumentos: Record<string, any> = {
  "1201050786001": {
    tipoIdentificacion: "Ruc",
    numeroIdentificacion: "1201050786001",
    cantidadDocumentosVigentes: 2,
    documentosExistentes: [
      {
        tipoDocumento: "CEDULA DE IDENTIDAD",
        mandatorio: "1",
        reqDigitalizar: "0",
        excepcionable: "0",
        digitalizado: "SI",
        fechaDigitalizado: "20260205"
      },
      {
        tipoDocumento: "CERTIFICADO DE VOTACION",
        mandatorio: "0",
        reqDigitalizar: "0",
        excepcionable: "0",
        digitalizado: "NO",
        fechaDigitalizado: ""
      }
    ]
  },
  // Escenario 2 - sin documentos vigentes
  "0926227414": {
    tipoIdentificacion: "Ruc",
    numeroIdentificacion: "0926227414",
    cantidadDocumentosVigentes: 0,
    documentosExistentes: []
  }
};