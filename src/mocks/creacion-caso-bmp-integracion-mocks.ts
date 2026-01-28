import { CreacionCasoEmpresaRequest, CreacionCasoEmpresaResponse } from '../fn-bpm-integracion-creacion/schema';

// Mock 1: Caso exitoso completo con chequera y firmantes
export const mockCasoExitosoCompleto: {
  request: CreacionCasoEmpresaRequest;
  response: CreacionCasoEmpresaResponse;
} = {
  request: {
    ruc: "20123456789",
    tipoCuenta: "corriente",
    productoBancario: "CUENTA_CORRIENTE_EMPRESARIAL",
    origenCuenta: "NUEVA",
    moneda: "PEN",
    tipoContable: "VISTA",
    categoriaCuenta: "EMPRESARIAL",
    otrasSolicitudes: "Tarjeta de débito empresarial",
    clasificacionEmpresa: "MEDIANA",
    fechaConstitucion: "2020-05-15T00:00:00.000Z",
    firmantes: [
      {
        tipoIdentificacionFirmante: "DNI",
        numeroIdentificacionFirmante: "12345678"
      },
      {
        tipoIdentificacionFirmante: "DNI", 
        numeroIdentificacionFirmante: "87654321"
      }
    ],
    depositoInicial: 500,
    solicitaChequera: true,
    nombreChequera: "TECNOLOGIA Y SOLUCIONES SAC",
    autorizadoRetirarChequera: "GERENTE GENERAL",
    emisorChequera: "BANCO_PRINCIPAL",
    tipoChequera: "EMPRESARIAL",
    oficinaEntrega: "OFICINA_PRINCIPAL_LIMA",
    numeroChequeras: 2,
    numeroCheques: 50,
    envioEstadoCuentaDigital: true,
    correoElectronico: "contabilidad@tecnologiasac.com",
    representanteLegal: {
      poseeDireccionExterior: false
    },
    firmanteDireccionExterior: {
      poseeDireccionExterior: false
    },
    datosDelSistema: {
      usuario: "operador@banco.com",
      canal: "WEB"
    }
  },
  response: {
    datosDelSistema: {
      resultado: "Ok",
      idBPM: "BPM-2026-001234"
    }
  }
};

// Mock 2: Caso exitoso básico sin chequera ni firmantes
export const mockCasoExitosoBasico: {
  request: CreacionCasoEmpresaRequest;
  response: CreacionCasoEmpresaResponse;
} = {
  request: {
    ruc: "20987654321",
    tipoCuenta: "ahorros",
    productoBancario: "CUENTA_AHORROS_EMPRESARIAL",
    origenCuenta: "NUEVA",
    moneda: "USD",
    categoriaCuenta: "PYME",
    clasificacionEmpresa: "PEQUEÑA",
    fechaConstitucion: "2023-01-10T00:00:00.000Z",
    depositoInicial: 1000,
    solicitaChequera: false,
    envioEstadoCuentaDigital: false,
    numeroDireccion: "AV. LIMA 123, SAN ISIDRO",
    representanteLegal: {
      poseeDireccionExterior: false
    },
    firmanteDireccionExterior: {
      poseeDireccionExterior: false
    },
    datosDelSistema: {
      usuario: "asesor@banco.com",
      canal: "MOBILE"
    }
  },
  response: {
    datosDelSistema: {
      resultado: "Ok",
      idBPM: "BPM-2026-001235"
    }
  }
};

// Mock 3: Caso con representante legal en el exterior
export const mockCasoRepresentanteExterior: {
  request: CreacionCasoEmpresaRequest;
  response: CreacionCasoEmpresaResponse;
} = {
  request: {
    ruc: "20555666777",
    tipoCuenta: "corriente",
    productoBancario: "CUENTA_CORRIENTE_INTERNACIONAL",
    origenCuenta: "NUEVA",
    moneda: "USD",
    tipoContable: "VISTA",
    categoriaCuenta: "CORPORATIVA",
    clasificacionEmpresa: "GRANDE",
    fechaConstitucion: "2018-03-20T00:00:00.000Z",
    depositoInicial: 25000,
    solicitaChequera: true,
    nombreChequera: "CORPORACION INTERNACIONAL SAA",
    autorizadoRetirarChequera: "APODERADO",
    emisorChequera: "BANCO_PRINCIPAL",
    tipoChequera: "INTERNACIONAL",
    oficinaEntrega: "OFICINA_MIRAFLORES",
    numeroChequeras: 5,
    numeroCheques: 100,
    envioEstadoCuentaDigital: true,
    correoElectronico: "finanzas@corporacion.com",
    representanteLegal: {
      poseeDireccionExterior: true,
      tipoIdentificacion: "PASAPORTE",
      numeroIdentificacion: "P123456789"
    },
    firmanteDireccionExterior: {
      poseeDireccionExterior: true,
      tipoIdentificacion: "CE",
      numeroIdentificacion: "001234567"
    },
    datosDelSistema: {
      usuario: "ejecutivo@banco.com",
      canal: "API"
    }
  },
  response: {
    datosDelSistema: {
      resultado: "Ok",
      idBPM: "BPM-2026-001236"
    }
  }
};

// Mock 4: Caso con error - RUC duplicado
export const mockCasoErrorRUCDuplicado: {
  request: CreacionCasoEmpresaRequest;
  response: CreacionCasoEmpresaResponse;
} = {
  request: {
    ruc: "20111222333",
    tipoCuenta: "corriente",
    productoBancario: "CUENTA_CORRIENTE_EMPRESARIAL",
    origenCuenta: "NUEVA",
    moneda: "PEN",
    tipoContable: "VISTA",
    categoriaCuenta: "EMPRESARIAL",
    clasificacionEmpresa: "MEDIANA",
    fechaConstitucion: "2021-08-12T00:00:00.000Z",
    depositoInicial: 3000,
    solicitaChequera: false,
    envioEstadoCuentaDigital: true,
    correoElectronico: "admin@empresa.com",
    representanteLegal: {
      poseeDireccionExterior: false
    },
    firmanteDireccionExterior: {
      poseeDireccionExterior: false
    },
    datosDelSistema: {
      usuario: "operador@banco.com",
      canal: "WEB"
    }
  },
  response: {
    datosDelSistema: {
      resultado: "Error",
      codigoError: 409,
      detalleErrores: ["El RUC 20111222333 ya posee una cuenta activa en el sistema"]
    }
  }
};

// Mock 5: Caso con múltiples errores de validación
export const mockCasoErroresValidacion: {
  request: CreacionCasoEmpresaRequest;
  response: CreacionCasoEmpresaResponse;
} = {
  request: {
    ruc: "20444555666",
    tipoCuenta: "corriente",
    productoBancario: "CUENTA_CORRIENTE_EMPRESARIAL",
    origenCuenta: "NUEVA",
    moneda: "PEN",
    tipoContable: "VISTA",
    categoriaCuenta: "EMPRESARIAL",
    clasificacionEmpresa: "PEQUEÑA",
    fechaConstitucion: "2025-12-01T00:00:00.000Z",
    depositoInicial: 100, // Monto insuficiente
    solicitaChequera: true,
    nombreChequera: "EMPRESA DE PRUEBA SAC",
    autorizadoRetirarChequera: "GERENTE",
    emisorChequera: "BANCO_PRINCIPAL",
    tipoChequera: "EMPRESARIAL",
    oficinaEntrega: "OFICINA_CENTRO",
    numeroChequeras: 1,
    numeroCheques: 25,
    envioEstadoCuentaDigital: true,
    correoElectronico: "test@empresa.com",
    representanteLegal: {
      poseeDireccionExterior: false
    },
    firmanteDireccionExterior: {
      poseeDireccionExterior: false
    },
    datosDelSistema: {
      usuario: "test@banco.com",
      canal: "WEB"
    }
  },
  response: {
    datosDelSistema: {
      resultado: "Error",
      codigoError: 400,
      detalleErrores: [
        "El depósito inicial debe ser mayor a S/. 500.00 para cuentas empresariales",
        "La fecha de constitución no puede ser futura",
        "El RUC no está registrado en SUNAT"
      ]
    }
  }
};
