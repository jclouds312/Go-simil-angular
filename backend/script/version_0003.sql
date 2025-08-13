USE SistemaADMDev;

CREATE TABLE pagoComision (
  id VARCHAR(50) PRIMARY KEY NOT NULL,
  idCategoria VARCHAR(80), 
  nombre VARCHAR(80),     
  meta DEC(10,2),
  porcentaje DEC(10,2),
  fecha DATE,
  hora TIME,
  estado TINYINT(1),
  idNegocio VARCHAR(50) NOT NULL
);

CREATE TABLE sucursal (
  id VARCHAR(50) PRIMARY KEY NOT NULL,  
  nombre VARCHAR(50),     
  descripcion TEXT,
  imagen TEXT,  
  estado TINYINT(1),
  idNegocio VARCHAR(50) NOT NULL
);

CREATE TABLE categoria (
  id VARCHAR(50) PRIMARY KEY NOT NULL,  
  nombre VARCHAR(50),     
  meta DEC(10,2),
  porcentaje DEC(10,2),
  estado TINYINT(1),
  idNegocio VARCHAR(50) NOT NULL
);

ALTER TABLE venta
ADD COLUMN idSucursal VARCHAR(50) NOT NULL;

ALTER TABLE venta
ADD COLUMN estadoComision VARCHAR(25) NOT NULL;

ALTER TABLE ventaDetalle
ADD COLUMN comision tinyint NOT NULL;

ALTER TABLE ventaDetalle
ADD COLUMN idPagoComision VARCHAR(50) NOT NULL;

ALTER TABLE ventaDetalle
ADD COLUMN comisionUsuario DEC(10,2) NOT NULL;

CREATE TABLE receta (
  id VARCHAR(50) PRIMARY KEY NOT NULL,  
  cilindroDer DEC(10,2),
  esferaDer DEC(10,2),
  ejeDer int,
  cilindroIzq DEC(10,2),
  esferaIzq DEC(10,2),
  ejeIzq int,
  material TEXT,
  tratamiento TEXT,
  idNegocio VARCHAR(50) NOT NULL
);

ALTER TABLE venta
ADD COLUMN idReceta VARCHAR(50) NOT NULL;