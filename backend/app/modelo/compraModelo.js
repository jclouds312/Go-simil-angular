const { getPool } = require("../config/database");
const logger = require("../logger").logger;
const path = require("path");
const filename = path.basename(__filename);
const { getMessage, getMessageCategory } = require('../messages');

async function agregarCompra(idUsuario, idAlmacen, idCuenta, fechaCompra, horaCompra, total, descuento, costoTotal, observacion, credito, pagado, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado
    const values = [idUsuario, idAlmacen, idCuenta, fechaCompra, horaCompra, total, descuento, costoTotal, observacion, credito, pagado, "1", idNegocio];

    var sql = `
      INSERT INTO compra(idUsuario, idAlmacen, idCuenta, fechaCompra, horaCompra, total, descuento, costoTotal, observacion, credito, pagado, estado, idNegocio)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?);
    `;

    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]
    respuesta.data["idCompra"] = resultado[0].insertId;

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - agregarCompra', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - agregarCompra', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function agregarCompraDetalle(idCompra, idInventario, cantidad, cantidadLiteral, costo, subTotal) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado
    const values = [idCompra, idInventario, cantidad, cantidadLiteral, costo, subTotal, "1",];

    var sql = `
      INSERT INTO compraDetalle(idCompra, idInventario, cantidad, cantidadLiteral, costo, subTotal, estado)
      VALUES(?,?,?,?,?,?,?);
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
    logger.log({level: 'error', label: filename + ' - agregarCompraDetalle', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - agregarCompraDetalle', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaCompraByEstado(estado, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [estado, idNegocio];
    const sql = `
      SELECT compra.id as 'idCompra', DATE_FORMAT(fechaCompra, '%d/%m/%Y') as 'fechaCompra', horaCompra, total, descuento, costoTotal
      , CONCAT(usuario.nombre, ' ', usuario.appat, ' ', usuario.apmat) as 'usuario'
      , almacen.nombre as 'nombreAlmacen'
      , cuenta.alias as 'nombreCuenta'
      FROM compra, usuario, almacen, cuenta
      WHERE compra.idUsuario = usuario.id and compra.idAlmacen = almacen.id and compra.idCuenta = cuenta.id
      and compra.estado = ? and compra.idNegocio = ?
      ORDER BY compra.id DESC;
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
    logger.log({level: 'error', label: filename + ' - listaCompraByEstado', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaCompraByEstado', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaCompraDetalleByIdCompra(idCompra, estado) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idCompra, estado];
    const sql = `
      SELECT compraDetalle.id as 'idCompraDetalle', compraDetalle.cantidad, compraDetalle.costo, compraDetalle.subTotal
      , producto.nombre as 'nombreProducto', producto.codigo, producto.puntos
      FROM  compraDetalle, inventarioProducto, producto
      WHERE compraDetalle.idInventario = inventarioProducto.id and inventarioProducto.idProducto = producto.id
      and compraDetalle.idCompra = ? and compraDetalle.estado = ?
      ORDER BY compraDetalle.id DESC;
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
    logger.log({level: 'error', label: filename + ' - listaCompraDetalleByIdCompra', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaCompraDetalleByIdCompra', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaCompraProductoHistorialByProducto(idProcucto, estado) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idProcucto, estado];
    const sql = `
      SELECT compraDetalle.id as 'idCompraDetalle', idCompra, compraDetalle.cantidad, compraDetalle.costo, compraDetalle.subTotal
      , DATE_FORMAT(compra.fechaCompra, '%d/%m/%Y') as 'fechaCompra', compra.horaCompra
      FROM compra, compraDetalle, inventarioProducto
      WHERE compraDetalle.idInventario = inventarioProducto.id and compraDetalle.idCompra = compra.id
      and inventarioProducto.idProducto = ? and compraDetalle.estado = ?
      ORDER BY compraDetalle.id DESC;
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
    logger.log({level: 'error', label: filename + ' - listaCompraProductoHistorialByProducto', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaCompraProductoHistorialByProducto', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

module.exports = {
  agregarCompra,
  agregarCompraDetalle,

  listaCompraByEstado,
  listaCompraDetalleByIdCompra,
  listaCompraProductoHistorialByProducto
};