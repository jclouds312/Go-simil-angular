USE SistemaADMDev;

CREATE TABLE descuento (
  id VARCHAR(50) PRIMARY KEY NOT NULL,
  nombre VARCHAR(80),     
  porcentaje DEC(10,2),
  multiplo int,
  idProducto VARCHAR(50),
  fecha DATE,
  hora TIME,
  estado TINYINT(1),
  idNegocio VARCHAR(50) NOT NULL
);

CREATE TABLE usuarioSucursal (
  id VARCHAR(50) PRIMARY KEY NOT NULL,
  idUsuario VARCHAR(50),
  idSucursal VARCHAR(50),
  fecha DATE,
  hora TIME,
  estado TINYINT(1),
  idNegocio VARCHAR(50) NOT NULL
);

CREATE TABLE sucursalAlmacen (
  id VARCHAR(50) PRIMARY KEY NOT NULL,
  idAlmacen VARCHAR(50),
  idSucursal VARCHAR(50),
  idUsuario VARCHAR(50),
  fecha DATE,
  hora TIME,
  estado TINYINT(1),
  idNegocio VARCHAR(50) NOT NULL
);

ALTER TABLE cuenta
ADD COLUMN idSucursal VARCHAR(50) NOT NULL;

ALTER TABLE ventaDetalle
ADD COLUMN idDescuento VARCHAR(50) NOT NULL;

ALTER TABLE ventaDetalle
ADD COLUMN descuento DEC(10,2) NOT NULL;

ALTER TABLE receta
ADD COLUMN addDer DEC(10,2) NOT NULL;

ALTER TABLE receta
ADD COLUMN addIzq DEC(10,2) NOT NULL;

ALTER TABLE receta
ADD COLUMN ao DEC(10,2) NOT NULL;

ALTER TABLE receta
ADD COLUMN dip DEC(10,2) NOT NULL;

ALTER TABLE receta
ADD COLUMN armazon varchar(100) NOT NULL;

ALTER TABLE receta
ADD COLUMN bifocal varchar(100) NOT NULL;