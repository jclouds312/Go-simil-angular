const { getPool } = require("../config/database");
const logger = require("../logger").logger;
const path = require("path");
const filename = path.basename(__filename);
const { getMessage, getMessageCategory } = require('../messages');

async function agregarVenta(idAlmacenOrigen, idClienteOrigen, idUsuario, idCliente, fechaVenta, horaVenta, total, descuento, precioTotal, observacion, credito, pagado, idNegocio, firmado, idClienteOtp, idSucursal, estadoComision, idReceta) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado
    const values = [idAlmacenOrigen, idClienteOrigen, idUsuario, idCliente, fechaVenta, horaVenta, total, descuento, precioTotal, observacion, credito, pagado, "1", idNegocio, firmado, idClienteOtp, idSucursal, estadoComision, idReceta];

    var sql = `
      INSERT INTO venta(idAlmacenOrigen, idClienteOrigen, idUsuario, idCliente, fechaVenta, horaVenta, total, descuento, precioTotal, observacion, credito, pagado, estado, idNegocio, firmado, idClienteOtp, idSucursal, estadoComision, idReceta)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
    `;

    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]
    respuesta.data["idVenta"] = resultado[0].insertId;

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - agregarVenta', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - agregarVenta', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function agregarVentaDetalle(idVenta, idInventario, idPrecioVenta, cantidad, cantidadLiteral, puntos, venta, subTotal, devolucion, comision, idPagoComision, comisionUsuario, idDescuento, descuento) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado
    const values = [idVenta, idInventario, idPrecioVenta, cantidad, cantidadLiteral, puntos, venta, subTotal, "1", devolucion, comision, idPagoComision, comisionUsuario, idDescuento, descuento];

    var sql = `
      INSERT INTO ventaDetalle(idVenta, idInventario, idPrecioVenta, cantidad, cantidadLiteral, puntos, venta, subTotal, estado, devolucion, comision, idPagoComision, comisionUsuario, idDescuento, descuento)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
    `;

    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - agregarVentaDetalle', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - agregarVentaDetalle', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function agregarVentaCredito(idVenta, idCuenta, idUsuario, fechaCredito, fechaPago, horaPago, monto, pagado, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado
    let idGenerado = Date.now();
    const values = [idGenerado, idVenta, idCuenta, idUsuario, fechaCredito, fechaPago, horaPago, monto, pagado, "1", idNegocio];

    var sql = `
      INSERT INTO ventaCredito(id, idVenta, idCuenta, idUsuario, fechaCredito, fechaPago, horaPago, monto, pagado, estado, idNegocio)
      VALUES(?,?,?,?,?,?,?,?,?,?,?);
    `;

    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - agregarVentaCredito', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - agregarVentaCredito', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function actualizarFirmaById(firmado, idClienteOtp, idVenta) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [firmado, idClienteOtp, idVenta];
    const sql = `
      UPDATE venta
      SET firmado = ?, idClienteOtp = ?
      WHERE id = ?
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - actualizarFirmaById', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - actualizarFirmaById', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function actualizarPagoById(pago, idVenta) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [pago, idVenta];
    const sql = `
      UPDATE venta
      SET pagado = ?
      WHERE id = ?
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - actualizarPagoById', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - actualizarPagoById', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function actualizarCantidadSubtotalById(cantidad, subTotal, idVentaDetalle) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [cantidad, subTotal, idVentaDetalle];
    const sql = `
      UPDATE ventaDetalle
      SET cantidad = ?, subTotal = ?
      WHERE id = ?
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - actualizarCantidadSubtotalById', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - actualizarCantidadSubtotalById', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}


async function actualizarDevolucionById(devolucion, idVentaDetalle) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [devolucion, idVentaDetalle];
    const sql = `
      UPDATE ventaDetalle
      SET devolucion = ?
      WHERE id = ?
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - actualizarDevolucionById', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - actualizarDevolucionById', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function actualizarTotalVentaById(total, precioTotal, idVenta) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [total, precioTotal, idVenta];
    const sql = `
      UPDATE venta
      SET total = ?, precioTotal = ?
      WHERE id = ?
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - actualizarTotalVentaById', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - actualizarTotalVentaById', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function actualizarEstadoComisionById(estadoComision, idVenta) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [estadoComision, idVenta];
    const sql = `
      UPDATE venta
      SET estadoComision = ?
      WHERE id = ?
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - actualizarEstadoComisionById', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - actualizarEstadoComisionById', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function actualizarRecetaById(idReceta, idVenta) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idReceta, idVenta];
    const sql = `
      UPDATE venta
      SET idReceta = ?
      WHERE id = ?
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - actualizarRecetaById', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - actualizarRecetaById', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function ventaById(idVenta, estado) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idVenta, estado];
    const sql = `
      SELECT venta.id as 'idVenta', DATE_FORMAT(fechaVenta, '%d/%m/%Y') AS fechaVenta, horaVenta, total, descuento, precioTotal, observacion, credito, pagado, firmado, estadoComision
      , venta.idAlmacenOrigen, almacenOrigen.nombre AS nombreAlmacenOrigen
      , venta.idSucursal, suc.nombre as 'nombreSucursal'
      , venta.idClienteOrigen, CONCAT(clienteOrigen.nombre, ' ', clienteOrigen.appat, ' ', clienteOrigen.apmat) AS nombreClienteOrigen
      , venta.idCliente, CONCAT(cliente.nombre, " ", cliente.appat, " ", cliente.apmat) as 'cliente'
      , venta.idUsuario, CONCAT(usuario.nombre, " ", usuario.appat, " ", usuario.apmat) as 'usuario', usuario.idRol
      , idClienteOtp, CONCAT(clienteOtp.nombre, ' ', clienteOtp.appat, ' ', clienteOtp.apmat) AS nombreClienteOtp, clienteOtp.celular, co.otpGenerado, DATE_FORMAT(co.fechaRecibido, '%d/%m/%Y') AS fechaRecibidoOtp, co.horaRecibido AS horaRecibidoOtp
      FROM venta
      JOIN usuario ON venta.idUsuario = usuario.id
      LEFT JOIN cliente ON venta.idCliente = cliente.id
      LEFT JOIN almacen AS almacenOrigen ON venta.idAlmacenOrigen = almacenOrigen.id
      LEFT JOIN sucursal AS suc ON venta.idSucursal = suc.id
      LEFT JOIN cliente AS clienteOrigen ON venta.idClienteOrigen != 1 AND venta.idClienteOrigen = clienteOrigen.id
      LEFT JOIN clienteOtp AS co ON venta.idClienteOtp != 1 AND venta.idClienteOtp = co.id
      LEFT JOIN cliente AS clienteOtp ON co.idCliente = clienteOtp.id
      WHERE venta.id = ? and venta.estado = ?;
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - ventaById', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - ventaById', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function ventaDetalleById(idVenta, estado) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idVenta, estado];
    const sql = `
      SELECT ventaDetalle.id as 'idVentaDetalle', idInventario, idPrecioVenta, ventaDetalle.idVenta, cantidad, cantidadLiteral, puntos, venta, subTotal, estado, devolucion, comision, idPagoComision, comisionUsuario, idDescuento, descuento
      FROM ventaDetalle
      WHERE ventaDetalle.id = ? and ventaDetalle.estado = ?;
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - ventaDetalleById', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - ventaDetalleById', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaVentaByEstado(estado, fechaInicio, fechaFin, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [estado, fechaInicio, fechaFin, idNegocio];
    const sql = `
      SELECT venta.id as 'idVenta', idReceta, DATE_FORMAT(fechaVenta, '%d/%m/%Y') AS fechaVenta, horaVenta, total, descuento, precioTotal, observacion, credito, pagado, firmado, estadoComision
      , venta.idAlmacenOrigen, almacenOrigen.nombre AS nombreAlmacenOrigen
      , venta.idClienteOrigen, CONCAT(clienteOrigen.nombre, ' ', clienteOrigen.appat, ' ', clienteOrigen.apmat) AS nombreClienteOrigen
      , venta.idCliente, CONCAT(cliente.nombre, " ", cliente.appat, " ", cliente.apmat) as 'cliente'
      , venta.idUsuario, CONCAT(usuario.nombre, " ", usuario.appat, " ", usuario.apmat) as 'usuario'
      , idClienteOtp, CONCAT(clienteOtp.nombre, ' ', clienteOtp.appat, ' ', clienteOtp.apmat) AS nombreClienteOtp, clienteOtp.celular, co.otpGenerado, DATE_FORMAT(co.fechaRecibido, '%d/%m/%Y') AS fechaRecibidoOtp, co.horaRecibido AS horaRecibidoOtp
      FROM venta
      JOIN usuario ON venta.idUsuario = usuario.id
      LEFT JOIN cliente ON venta.idCliente = cliente.id
      LEFT JOIN almacen AS almacenOrigen ON venta.idAlmacenOrigen = almacenOrigen.id
      LEFT JOIN cliente AS clienteOrigen ON venta.idClienteOrigen != 1 AND venta.idClienteOrigen = clienteOrigen.id
      LEFT JOIN clienteOtp AS co ON venta.idClienteOtp != 1 AND venta.idClienteOtp = co.id
      LEFT JOIN cliente AS clienteOtp ON co.idCliente = clienteOtp.id
      WHERE venta.estado = ? and venta.fechaVenta BETWEEN ? AND ? and venta.idNegocio = ?
      ORDER BY venta.id DESC;
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - listaVentaByEstado', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaVentaByEstado', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaVentaByAlmacenOrigen(idAlmacenOrigen, fechaInicio, fechaFin, estado, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idAlmacenOrigen, fechaInicio, fechaFin, estado, idNegocio];
    const sql = `
      SELECT venta.id as 'idVenta', idReceta, DATE_FORMAT(fechaVenta, '%d/%m/%Y') AS fechaVenta, horaVenta, total, descuento, precioTotal, observacion, credito, pagado, firmado, estadoComision
      , venta.idAlmacenOrigen, almacenOrigen.nombre AS nombreAlmacenOrigen
      , venta.idClienteOrigen, CONCAT(clienteOrigen.nombre, ' ', clienteOrigen.appat, ' ', clienteOrigen.apmat) AS nombreClienteOrigen
      , venta.idCliente, CONCAT(cliente.nombre, " ", cliente.appat, " ", cliente.apmat) as 'cliente'
      , venta.idUsuario, CONCAT(usuario.nombre, " ", usuario.appat, " ", usuario.apmat) as 'usuario'
      , idClienteOtp, CONCAT(clienteOtp.nombre, ' ', clienteOtp.appat, ' ', clienteOtp.apmat) AS nombreClienteOtp, clienteOtp.celular, co.otpGenerado, DATE_FORMAT(co.fechaRecibido, '%d/%m/%Y') AS fechaRecibidoOtp, co.horaRecibido AS horaRecibidoOtp
      FROM venta
      JOIN usuario ON venta.idUsuario = usuario.id
      LEFT JOIN cliente ON venta.idCliente = cliente.id
      LEFT JOIN almacen AS almacenOrigen ON venta.idAlmacenOrigen = almacenOrigen.id
      LEFT JOIN cliente AS clienteOrigen ON venta.idClienteOrigen != 1 AND venta.idClienteOrigen = clienteOrigen.id
      LEFT JOIN clienteOtp AS co ON venta.idClienteOtp != 1 AND venta.idClienteOtp = co.id
      LEFT JOIN cliente AS clienteOtp ON co.idCliente = clienteOtp.id
      WHERE venta.idAlmacenOrigen = ? and venta.fechaVenta BETWEEN ? AND ? and venta.estado = ? and venta.idNegocio = ?
      ORDER BY venta.id DESC;
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - listaVentaByAlmacenOrigen', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaVentaByAlmacenOrigen', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaVentaByClienteOrigen(idClienteOrigen, estado, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idClienteOrigen, estado, idNegocio];
    const sql = `
      SELECT venta.id as 'idVenta', idReceta, DATE_FORMAT(fechaVenta, '%d/%m/%Y') AS fechaVenta, horaVenta, total, descuento, precioTotal, observacion, credito, pagado, firmado, estadoComision
      , venta.idAlmacenOrigen, almacenOrigen.nombre AS nombreAlmacenOrigen
      , venta.idClienteOrigen, CONCAT(clienteOrigen.nombre, ' ', clienteOrigen.appat, ' ', clienteOrigen.apmat) AS nombreClienteOrigen
      , venta.idCliente, CONCAT(cliente.nombre, " ", cliente.appat, " ", cliente.apmat) as 'cliente'
      , venta.idUsuario, CONCAT(usuario.nombre, " ", usuario.appat, " ", usuario.apmat) as 'usuario'
      , idClienteOtp, CONCAT(clienteOtp.nombre, ' ', clienteOtp.appat, ' ', clienteOtp.apmat) AS nombreClienteOtp, clienteOtp.celular, co.otpGenerado, DATE_FORMAT(co.fechaRecibido, '%d/%m/%Y') AS fechaRecibidoOtp, co.horaRecibido AS horaRecibidoOtp
      FROM venta
      JOIN usuario ON venta.idUsuario = usuario.id
      LEFT JOIN cliente ON venta.idCliente = cliente.id
      LEFT JOIN almacen AS almacenOrigen ON venta.idAlmacenOrigen = almacenOrigen.id
      LEFT JOIN cliente AS clienteOrigen ON venta.idClienteOrigen != 1 AND venta.idClienteOrigen = clienteOrigen.id
      LEFT JOIN clienteOtp AS co ON venta.idClienteOtp != 1 AND venta.idClienteOtp = co.id
      LEFT JOIN cliente AS clienteOtp ON co.idCliente = clienteOtp.id
      WHERE venta.idClienteOrigen = ? and venta.estado = ? and venta.idNegocio = ?
      ORDER BY venta.id DESC;
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - listaVentaByClienteOrigen', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaVentaByClienteOrigen', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaVentaByCliente(idCliente, fechaInicio, fechaFin, estado, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idCliente, fechaInicio, fechaFin, estado, idNegocio];
    const sql = `
      SELECT venta.id as 'idVenta', idReceta, DATE_FORMAT(fechaVenta, '%d/%m/%Y') AS fechaVenta, horaVenta, total, descuento, precioTotal, observacion, credito, pagado, firmado, estadoComision
      , venta.idAlmacenOrigen, almacenOrigen.nombre AS nombreAlmacenOrigen
      , venta.idClienteOrigen, CONCAT(clienteOrigen.nombre, ' ', clienteOrigen.appat, ' ', clienteOrigen.apmat) AS nombreClienteOrigen
      , venta.idCliente, CONCAT(cliente.nombre, " ", cliente.appat, " ", cliente.apmat) as 'cliente'
      , venta.idUsuario, CONCAT(usuario.nombre, " ", usuario.appat, " ", usuario.apmat) as 'usuario'
      , idClienteOtp, CONCAT(clienteOtp.nombre, ' ', clienteOtp.appat, ' ', clienteOtp.apmat) AS nombreClienteOtp, clienteOtp.celular, co.otpGenerado, DATE_FORMAT(co.fechaRecibido, '%d/%m/%Y') AS fechaRecibidoOtp, co.horaRecibido AS horaRecibidoOtp
      FROM venta
      JOIN usuario ON venta.idUsuario = usuario.id
      LEFT JOIN cliente ON venta.idCliente = cliente.id
      LEFT JOIN almacen AS almacenOrigen ON venta.idAlmacenOrigen = almacenOrigen.id
      LEFT JOIN cliente AS clienteOrigen ON venta.idClienteOrigen != 1 AND venta.idClienteOrigen = clienteOrigen.id
      LEFT JOIN clienteOtp AS co ON venta.idClienteOtp != 1 AND venta.idClienteOtp = co.id
      LEFT JOIN cliente AS clienteOtp ON co.idCliente = clienteOtp.id
      WHERE venta.idCliente = ? and venta.fechaVenta BETWEEN ? AND ? and venta.estado = ? and venta.idNegocio = ?
      ORDER BY venta.id DESC;
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - listaVentaByClienteOrigen', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaVentaByClienteOrigen', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaVentaBySucursal(idSucursal, fechaInicio, fechaFin, estado, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idSucursal, fechaInicio, fechaFin, estado, idNegocio];
    const sql = `
      SELECT venta.id as 'idVenta', idReceta, DATE_FORMAT(fechaVenta, '%d/%m/%Y') AS fechaVenta, horaVenta, total, descuento, precioTotal, observacion, credito, pagado, firmado, estadoComision
      , venta.idAlmacenOrigen, almacenOrigen.nombre AS nombreAlmacenOrigen
      , venta.idClienteOrigen, CONCAT(clienteOrigen.nombre, ' ', clienteOrigen.appat, ' ', clienteOrigen.apmat) AS nombreClienteOrigen
      , venta.idCliente, CONCAT(cliente.nombre, " ", cliente.appat, " ", cliente.apmat) as 'cliente'
      , venta.idUsuario, CONCAT(usuario.nombre, " ", usuario.appat, " ", usuario.apmat) as 'usuario'
      , idClienteOtp, CONCAT(clienteOtp.nombre, ' ', clienteOtp.appat, ' ', clienteOtp.apmat) AS nombreClienteOtp, clienteOtp.celular, co.otpGenerado, DATE_FORMAT(co.fechaRecibido, '%d/%m/%Y') AS fechaRecibidoOtp, co.horaRecibido AS horaRecibidoOtp
      , venta.idSucursal, sucursal.nombre as 'nombreSucursal'
      FROM venta
      JOIN usuario ON venta.idUsuario = usuario.id
      LEFT JOIN cliente ON venta.idCliente = cliente.id
      LEFT JOIN sucursal AS sucursal ON venta.idSucursal = sucursal.id
      LEFT JOIN almacen AS almacenOrigen ON venta.idAlmacenOrigen = almacenOrigen.id
      LEFT JOIN cliente AS clienteOrigen ON venta.idClienteOrigen != 1 AND venta.idClienteOrigen = clienteOrigen.id
      LEFT JOIN clienteOtp AS co ON venta.idClienteOtp != 1 AND venta.idClienteOtp = co.id
      LEFT JOIN cliente AS clienteOtp ON co.idCliente = clienteOtp.id
      WHERE venta.idSucursal = ? and venta.fechaVenta BETWEEN ? AND ? and venta.estado = ? and venta.idNegocio = ?
      ORDER BY venta.id DESC;
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - listaVentaBySucursal', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaVentaBySucursal', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaVentaBySucursalUsuario(idSucursal, idUsuario, fechaInicio, fechaFin, estado, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idSucursal, idUsuario, fechaInicio, fechaFin, estado, idNegocio];
    const sql = `
      SELECT venta.id as 'idVenta', idReceta, DATE_FORMAT(fechaVenta, '%d/%m/%Y') AS fechaVenta, horaVenta, total, descuento, precioTotal, observacion, credito, pagado, firmado, estadoComision
      , venta.idAlmacenOrigen, almacenOrigen.nombre AS nombreAlmacenOrigen
      , venta.idClienteOrigen, CONCAT(clienteOrigen.nombre, ' ', clienteOrigen.appat, ' ', clienteOrigen.apmat) AS nombreClienteOrigen
      , venta.idCliente, CONCAT(cliente.nombre, " ", cliente.appat, " ", cliente.apmat) as 'cliente'
      , venta.idUsuario, CONCAT(usuario.nombre, " ", usuario.appat, " ", usuario.apmat) as 'usuario'
      , idClienteOtp, CONCAT(clienteOtp.nombre, ' ', clienteOtp.appat, ' ', clienteOtp.apmat) AS nombreClienteOtp, clienteOtp.celular, co.otpGenerado, DATE_FORMAT(co.fechaRecibido, '%d/%m/%Y') AS fechaRecibidoOtp, co.horaRecibido AS horaRecibidoOtp
      , venta.idSucursal, sucursal.nombre as 'nombreSucursal'
      FROM venta
      JOIN usuario ON venta.idUsuario = usuario.id
      LEFT JOIN cliente ON venta.idCliente = cliente.id
      LEFT JOIN sucursal AS sucursal ON venta.idSucursal = sucursal.id
      LEFT JOIN almacen AS almacenOrigen ON venta.idAlmacenOrigen = almacenOrigen.id
      LEFT JOIN cliente AS clienteOrigen ON venta.idClienteOrigen != 1 AND venta.idClienteOrigen = clienteOrigen.id
      LEFT JOIN clienteOtp AS co ON venta.idClienteOtp != 1 AND venta.idClienteOtp = co.id
      LEFT JOIN cliente AS clienteOtp ON co.idCliente = clienteOtp.id
      WHERE venta.idSucursal = ? and venta.idUsuario = ? and venta.fechaVenta BETWEEN ? AND ? and venta.estado = ? and venta.idNegocio = ?
      ORDER BY venta.id DESC;
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - listaVentaBySucursalUsuario', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaVentaBySucursalUsuario', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaVentaUsuarioBySucursalFechas(idSucursal, fechaInicio, fechaFin, estado, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idSucursal, fechaInicio, fechaFin, estado, idNegocio];
    const sql = `
      SELECT v.idUsuario, COUNT(v.total) AS ventas, SUM(v.total) AS totalAcumulado
        , CONCAT(u.nombre, ' ', u.appat, ' ', u.apmat) AS usuario
      FROM venta v
      JOIN usuario u ON v.idUsuario = u.id
      WHERE v.idSucursal = ? and v.fechaVenta BETWEEN ? AND ? and v.estado = ? and v.idNegocio = ?
      GROUP BY v.idUsuario
      ORDER BY totalAcumulado DESC
      LIMIT 1;
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - listaVentaUsuarioBySucursalFechas', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaVentaUsuarioBySucursalFechas', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaVentaDetalleByIdVenta(idVenta, estado) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idVenta, estado];
    const sql = `
      SELECT ventaDetalle.id as 'idVentaDetalle', idVenta, ventaDetalle.cantidad, ventaDetalle.cantidadLiteral, ventaDetalle.puntos, ventaDetalle.venta, ventaDetalle.subTotal, ventaDetalle.devolucion, comision, comisionUsuario, idDescuento, descuento
      , descuento.porcentaje, descuento.multiplo
      , idInventario, producto.nombre, producto.codigo
      FROM ventaDetalle
      JOIN inventarioProducto ON ventaDetalle.idInventario = inventarioProducto.id
      JOIN producto ON inventarioProducto.idProducto = producto.id
      LEFT JOIN descuento ON ventaDetalle.idDescuento = descuento.id
      WHERE ventaDetalle.idVenta = ?
        AND ventaDetalle.estado = ?;
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - listaVentaDetalleByIdVenta', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaVentaDetalleByIdVenta', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaVentaDetalleByIdProductoPagado(idProducto, pagado, devolucion) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idProducto, pagado, devolucion];
    const sql = `
      SELECT ventaDetalle.id as 'idVentaDetalle', idVenta, idPrecioVenta, ventaDetalle.cantidad, ventaDetalle.cantidadLiteral, puntos, ventaDetalle.venta, ventaDetalle.subTotal, devolucion
      , venta.pagado, DATE_FORMAT(fechaVenta, '%d/%m/%Y') AS fechaVenta, horaVenta, total, descuento, precioTotal
      , DATE_FORMAT(inventarioProducto.fechaVencimiento, '%d/%m/%Y') AS fechaVencimiento
      , venta.idCliente, CONCAT(cliente.nombre, " ", cliente.appat, " ", cliente.apmat) as 'cliente'
      , venta.idUsuario, CONCAT(usuario.nombre, " ", usuario.appat, " ", usuario.apmat) as 'usuario'
      , precioVenta.nombre, porcentaje
      FROM ventaDetalle, inventarioProducto, venta, precioVenta, cliente, usuario
      WHERE ventaDetalle.idInventario = inventarioProducto.id and ventaDetalle.idVenta = venta.id and ventaDetalle.idPrecioVenta = precioVenta.id and venta.idCliente = cliente.id and venta.idUsuario = usuario.id
      and inventarioProducto.idProducto = ? and venta.pagado = ? and ventaDetalle.devolucion = ?
      ORDER BY venta.fechaVenta DESC;
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - listaVentaDetalleByIdProductoPagado', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaVentaDetalleByIdProductoPagado', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}


async function listaProductoVentaBySucursalFechas(idSucursal, fechaInicio, fechaFin, estado, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idSucursal, fechaInicio, fechaFin, estado, idNegocio];
    const sql = `
      SELECT producto.id as 'idProducto', producto.nombre, producto.codigo, SUM(ventaDetalle.subTotal) as 'totalAcumulado', SUM(ventaDetalle.cantidad) as 'cantidadAcumulado'
      FROM venta, ventaDetalle, inventarioProducto, producto
      WHERE ventaDetalle.idVenta = venta.id and ventaDetalle.idInventario = inventarioProducto.id and inventarioProducto.idProducto = producto.id
      and venta.idSucursal = ? and venta.fechaVenta BETWEEN ? AND ? and venta.estado = ? and venta.idNegocio = ?
      GROUP BY idProducto
      ORDER BY totalAcumulado DESC
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - listaProductoVentaBySucursalFechas', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaProductoVentaBySucursalFechas', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaVentaCreditoByIdVenta(idVenta, estado) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idVenta, estado];
    const sql = `
      SELECT ventaCredito.id as 'idVentaCredito', idVenta, DATE_FORMAT(fechaCredito, '%d/%m/%Y') AS fechaCredito, DATE_FORMAT(fechaPago, '%d/%m/%Y') AS fechaPago, horaPago, monto, pagado
      , cuenta.alias as 'nombreCuenta'
      , CONCAT(usuario.nombre, ' ', usuario.appat, ' ', usuario.apmat) as 'usuario'
      FROM ventaCredito
      JOIN usuario ON ventaCredito.idUsuario = usuario.id
      LEFT JOIN cuenta ON ventaCredito.idCuenta != 1 AND ventaCredito.idCuenta = cuenta.id
      WHERE ventaCredito.idVenta = ? and ventaCredito.estado = ?;
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - listaVentaCreditoByIdVenta', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaVentaCreditoByIdVenta', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaComisionByUsuario(idUsuario, comision) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idUsuario, comision];
    const sql = `
      SELECT idVenta, comision, comisionUsuario, subTotal, venta.estadoComision, DATE_FORMAT(fechaVenta, '%d/%m/%Y') AS fechaVenta, horaVenta
      , pagoComision.id as 'idPagoComision', meta, porcentaje
      , idCliente, CONCAT(cliente.nombre, ' ', cliente.appat, ' ', cliente.apmat) as 'cliente'
      , idUsuario, CONCAT(usuario.nombre, ' ', usuario.appat, ' ', usuario.apmat) as 'usuario'
      FROM ventaDetalle, venta, pagoComision, cliente, usuario
      WHERE ventaDetalle.idVenta = venta.id and ventaDetalle.idPagoComision = pagoComision.id and venta.idCliente = cliente.id and venta.idUsuario = usuario.id
      and venta.idUsuario = ? and comision = ?
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - listaComisionByUsuario', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaComisionByUsuario', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaComisionBySucursal(idSucursal, comision) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idSucursal, comision];
    const sql = `
      SELECT idVenta, comision, comisionUsuario, subTotal, venta.estadoComision, DATE_FORMAT(fechaVenta, '%d/%m/%Y') AS fechaVenta, horaVenta
      , pagoComision.id as 'idPagoComision', meta, porcentaje
      , idCliente, CONCAT(cliente.nombre, ' ', cliente.appat, ' ', cliente.apmat) as 'cliente'
      , idUsuario, CONCAT(usuario.nombre, ' ', usuario.appat, ' ', usuario.apmat) as 'usuario'
      FROM ventaDetalle, venta, pagoComision, cliente, usuario
      WHERE ventaDetalle.idVenta = venta.id and ventaDetalle.idPagoComision = pagoComision.id and venta.idCliente = cliente.id and venta.idUsuario = usuario.id
      and venta.idSucursal = ? and comision = ?
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - listaComisionByUsuario', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaComisionByUsuario', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

module.exports = {
  agregarVenta,
  agregarVentaDetalle,
  agregarVentaCredito,

  actualizarCantidadSubtotalById,
  actualizarDevolucionById,
  actualizarTotalVentaById,
  actualizarEstadoComisionById,
  actualizarRecetaById,
  actualizarPagoById,
  actualizarFirmaById,
  
  ventaById,
  ventaDetalleById,

  listaVentaByEstado,
  listaVentaByAlmacenOrigen,
  listaVentaByClienteOrigen,
  listaVentaByCliente,
  listaVentaBySucursal,
  listaVentaBySucursalUsuario,
  listaVentaUsuarioBySucursalFechas,
  listaVentaDetalleByIdVenta,
  listaVentaDetalleByIdProductoPagado,
  listaProductoVentaBySucursalFechas,
  listaVentaCreditoByIdVenta,
  listaComisionByUsuario,
  listaComisionBySucursal
};