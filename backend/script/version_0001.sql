CREATE DATABASE SistemaADMDev;
USE SistemaADMDev;

CREATE TABLE `sistema` (
  `id` int NOT NULL AUTO_INCREMENT,
  `version` TEXT DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `hora` time DEFAULT NULL,
  `estado` TINYINT(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_spanish2_ci;

CREATE TABLE cronologia (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,  
  idLogin VARCHAR(50) NOT NULL,
  token VARCHAR(50) NOT NULL,
  dispositivo TEXT NOT NULL,
  ip VARCHAR(50) NOT NULL,
  solicitud LONGTEXT,
  respuesta LONGTEXT,
  fecha DATE,
  hora TIME,
  ruta TEXT,
  estado TINYINT(1)
);

CREATE TABLE negocio (
  id VARCHAR(50) PRIMARY KEY NOT NULL,
  nit VARCHAR(11) NULL,
  nombre VARCHAR(100),
  descripcion TEXT,
  celular VARCHAR(10),
  email VARCHAR(40),
  ciudad VARCHAR(15),
  zona VARCHAR(50),
  barrio VARCHAR(50),
  avenida VARCHAR(50),
  calle VARCHAR(50),
  casa VARCHAR(25),
  referencia TEXT,
  latitud VARCHAR(12),
  longitud VARCHAR(12),
  imagen TEXT,
  estado TINYINT(1)
);

CREATE TABLE usuario (
  id VARCHAR(50) PRIMARY KEY NOT NULL,
  idRol VARCHAR(50) NULL,
  ci VARCHAR(11) NULL,
  complemento VARCHAR(11),
  nombre VARCHAR(25),
  appat VARCHAR(20),
  apmat VARCHAR(20),
  fechaNacimiento DATE,
  genero VARCHAR(20),
  celular VARCHAR(15),
  email VARCHAR(40),
  ciudad VARCHAR(15),
  zona VARCHAR(50),
  barrio VARCHAR(50),
  avenida VARCHAR(50),
  calle VARCHAR(50),
  casa VARCHAR(25),
  referencia TEXT,
  latitud VARCHAR(12),
  longitud VARCHAR(12),
  imagen TEXT,
  usuario TEXT,
  password TEXT,
  estado TINYINT(1),
  idNegocio VARCHAR(50) NOT NULL
);

CREATE TABLE rol (
  id VARCHAR(50) NOT NULL PRIMARY KEY,
  nombre VARCHAR(100),
  descripcion TEXT,
  estado TINYINT(1)
);

CREATE TABLE acceso (
  id VARCHAR(50) NOT NULL PRIMARY KEY,
  nombre VARCHAR(100),
  tipo VARCHAR(20),
  estado TINYINT(1)
);

CREATE TABLE rolAcceso (
  id VARCHAR(50) NOT NULL PRIMARY KEY,
  idRol VARCHAR(50),
  idAcceso VARCHAR(50),
  estado TINYINT(1)
);

CREATE TABLE loginUsuario(
  id VARCHAR(50) NOT NULL PRIMARY KEY,
  idUsuario VARCHAR(50),
  dispositivo TEXT,
  observacionInicio TEXT,
  fechaInicio DATE,
  horaInicio TIME,
  observacionFinal text,
  fechaFinal DATE,
  horaFinal TIME,
  estado TINYINT(1)
);

CREATE TABLE loginFallidoUsuario (
  id VARCHAR(50) NOT NULL PRIMARY KEY,
  usuario VARCHAR(50) NOT NULL,
  pass VARCHAR(150) NOT NULL,
  fecha DATE,
  hora TIME,
  estado TINYINT NOT NULL
);

CREATE TABLE seguimientoUsuario (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  idUsuario VARCHAR(50) NOT NULL,
  dispositivo text NOT NULL,
  accion VARCHAR(150) NOT NULL,
  data text NOT NULL,
  fecha DATE,
  hora TIME,
  estado TINYINT NOT NULL
);

CREATE TABLE cliente (
  id VARCHAR(50) PRIMARY KEY NOT NULL,
  codigo VARCHAR(15) NULL,
  ci VARCHAR(15) NULL,
  complemento VARCHAR(11),
  razonSocial VARCHAR(150) NULL,
  tipo VARCHAR(15),
  nombre VARCHAR(25),
  appat VARCHAR(20),
  apmat VARCHAR(20),
  fechaNacimiento DATE,
  genero VARCHAR(20),
  celular VARCHAR(15),
  email VARCHAR(40),
  usuario TEXT,
  password TEXT,
  estado TINYINT(1),
  idNegocio VARCHAR(50)
);

CREATE TABLE clienteOtp (
  id VARCHAR(50) PRIMARY KEY NOT NULL,
  idCliente VARCHAR(50) NULL,
  otpGenerado VARCHAR(5) NULL,
  otpRecibido VARCHAR(5) NULL,
  detalle TEXT NULL,
  fechaGenerado DATE,
  horaGenerado TIME,
  fechaRecibido DATE,
  horaRecibido TIME,
  estado TINYINT(1)
);

CREATE TABLE almacen (
  id VARCHAR(50) PRIMARY KEY NOT NULL,  
  nombre VARCHAR(50),     
  descripcion TEXT,
  imagen TEXT,  
  estado TINYINT(1),
  idNegocio VARCHAR(50) NOT NULL
);

CREATE TABLE producto (
  id VARCHAR(50) PRIMARY KEY NOT NULL,  
  idCategoria VARCHAR(50) NOT NULL,
  codigo VARCHAR(15), 
  nombre VARCHAR(50),     
  descripcion TEXT,
  precio DEC(10,2),
  puntos INT,
  imagen TEXT,  
  estado TINYINT(1),
  idNegocio VARCHAR(50) NOT NULL
);

CREATE TABLE inventarioProducto (
  id VARCHAR(50) PRIMARY KEY NOT NULL,  
  idProducto VARCHAR(50) NOT NULL,
  idAlmacen VARCHAR(50) NOT NULL,
  idCliente VARCHAR(50) NOT NULL,
  fechaVencimiento DATE NOT NULL,
  cantidad DEC(10,2),
  cantidadLiteral TEXT,
  costo decimal(10, 2),
  estado TINYINT(1),
  idNegocio VARCHAR(50) NOT NULL
);

CREATE TABLE inventarioProductoHistorial (
  id VARCHAR(50) PRIMARY KEY NOT NULL,  
  idUsuario VARCHAR(50) NOT NULL,  
  idInventarioProducto VARCHAR(50) NOT NULL,  
  tipo TINYINT(1),
  cantidad DEC(10,2),
  cantidadLiteral TEXT,
  detalle VARCHAR(155),
  observacion TEXT,
  fecha DATE,
  hora TIME,
  estado TINYINT(1)
);

CREATE TABLE compra (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  idUsuario VARCHAR(50) NOT NULL,
  idAlmacen VARCHAR(50) NOT NULL,
  idCuenta VARCHAR(50) NOT NULL,
  fechaCompra DATE,
  horaCompra TIME,
  total DEC(10,2),
  descuento DEC(10,2),
  costoTotal DEC(10,2),
  observacion TEXT,
  credito TINYINT(1),
  pagado TINYINT(1),
  estado TINYINT(1),
  idNegocio VARCHAR(50) NOT NULL
);

CREATE TABLE compraDetalle (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  idCompra VARCHAR(50) NOT NULL,
  idInventario VARCHAR(50) NOT NULL,
  cantidad int,
  cantidadLiteral TEXT,
  costo DEC(10,2),
  subTotal DEC(10,2),
  estado TINYINT(1)
);

CREATE TABLE venta (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  idAlmacenOrigen VARCHAR(50) NOT NULL,
  idClienteOrigen VARCHAR(50) NOT NULL,
  idUsuario VARCHAR(50) NOT NULL,
  idCliente VARCHAR(50) NOT NULL,
  fechaVenta DATE,
  horaVenta TIME,
  total DEC(10,2),
  descuento DEC(10,2),
  precioTotal DEC(10,2),
  observacion TEXT,
  credito TINYINT(1),
  pagado TINYINT(1),
  estado TINYINT(1),
  idNegocio VARCHAR(50) NOT NULL,
  firmado TINYINT(1),
  idClienteOtp VARCHAR(50)
);

CREATE TABLE ventaDetalle (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  idVenta VARCHAR(50) NOT NULL,
  idInventario VARCHAR(50) NOT NULL,
  idPrecioVenta VARCHAR(50) NOT NULL,
  cantidad int,
  cantidadLiteral TEXT,
  puntos int,
  venta DEC(10,2),
  subTotal DEC(10,2),
  estado TINYINT(1),
  devolucion TINYINT(1)
);

CREATE TABLE traspaso (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  idUsuario VARCHAR(50) NOT NULL,
  idAlmacenOrigen VARCHAR(50) NOT NULL,
  idAlmacenDestino VARCHAR(50) NOT NULL,
  idClienteOrigen VARCHAR(50) NOT NULL,
  idClienteDestino VARCHAR(50) NOT NULL,
  fechaTraspaso DATE,
  horaTraspaso TIME,
  total DEC(10,2),
  detalle TEXT,
  pagado TINYINT(1),
  estado TINYINT(1),
  idNegocio VARCHAR(50) NOT NULL,
  firmado TINYINT(1),
  idClienteOtp VARCHAR(50)
);

CREATE TABLE traspasoDetalle (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  idTraspaso VARCHAR(50) NOT NULL,
  idInventarioProductoOrigen VARCHAR(50) NOT NULL,
  idInventarioProductoDestino VARCHAR(50) NOT NULL,
  cantidad int,
  cantidadLiteral TEXT,
  puntos int,
  precio DEC(10,2),
  subTotal DEC(10,2),
  estado TINYINT(1),
  devolucion TINYINT(1)
);

CREATE TABLE cuenta (
  id VARCHAR(50) PRIMARY KEY NOT NULL,
  idNegocio VARCHAR(50) NOT NULL,
  alias VARCHAR(80) NULL,
  banco VARCHAR(40) NULL,
  numeroCuenta VARCHAR(20) NULL,
  saldo DECIMAL(15,2) DEFAULT 0.00,
  estado TINYINT(1)
);

CREATE TABLE cuentaHistorial (
  id VARCHAR(50) PRIMARY KEY NOT NULL,
  idCuenta VARCHAR(50) NOT NULL,
  tipo TINYINT(1),
  monto DECIMAL(15,2) DEFAULT 0.00,
  saldo DECIMAL(15,2) DEFAULT 0.00,
  descripcion VARCHAR(255),
  detalle TEXT,
  fecha DATE,
  hora TIME,
  idUsuario VARCHAR(50) NOT NULL,  
  idNegocio VARCHAR(50) NOT NULL,
  estado TINYINT(1)
);

INSERT INTO sistema(id, version, fecha, hora, estado) VALUES("1", "1.0.0", "2025-01-15", "20:00:00", "1");
INSERT INTO negocio(id, nit, nombre, estado) VALUES("1", "0", "4Life", "1");
INSERT INTO clienteOtp(id, idCliente, otpGenerado, estado) VALUES("1", "1", "0", "2");
INSERT INTO usuario(id, idRol, ci, complemento, nombre, appat, apmat, fechaNacimiento, usuario, password, estado, idNegocio) VALUES("1", "Administrador", "0", "0", "Administrador", "Administrador", "Administrador", "2000-01-01", "Admin", "password", "2", "1");