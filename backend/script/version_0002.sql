USE SistemaADMDev;

CREATE TABLE precioVenta (
  id VARCHAR(50) PRIMARY KEY NOT NULL,
  nombre VARCHAR(30) NOT NULL,
  porcentaje int NULL,
  fecha DATE,
  hora TIME,
  estado TINYINT(1),
  idNegocio VARCHAR(50) NOT NULL
);

CREATE TABLE ventaCredito (
  id VARCHAR(50) PRIMARY KEY NOT NULL,
  idVenta VARCHAR(50) NOT NULL,
  idCuenta VARCHAR(50) NOT NULL,
  idUsuario VARCHAR(50) NOT NULL,
  fechaCredito DATE,
  fechaPago DATE,
  horaPago TIME,
  monto DEC(10,2),
  pagado TINYINT(1),
  estado TINYINT(1),
  idNegocio VARCHAR(50) NOT NULL
);