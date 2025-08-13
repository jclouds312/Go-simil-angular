const { getPool } = require("../config/database");
const logger = require("../logger").logger;
const path = require("path");
const filename = path.basename(__filename);
const { getMessage, getMessageCategory } = require('../messages');

async function agregarTraspaso(idUsuario, idAlmacenOrigen, idAlmacenDestino, idClienteOrigen, idClienteDestino, fechaTraspaso, horaTraspaso, total, detalle, pagado, idNegocio, firmado, idClienteOtp) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado
    const values = [idUsuario, idAlmacenOrigen, idAlmacenDestino, idClienteOrigen, idClienteDestino, fechaTraspaso, horaTraspaso, total, detalle, pagado, "1", idNegocio, firmado, idClienteOtp];

    var sql = `
      INSERT INTO traspaso(idUsuario, idAlmacenOrigen, idAlmacenDestino, idClienteOrigen, idClienteDestino, fechaTraspaso, horaTraspaso, total, detalle, pagado, estado, idNegocio, firmado, idClienteOtp)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?);
    `;

    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]
    respuesta.data["idTraspaso"] = resultado[0].insertId;

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - agregarTraspaso', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - agregarTraspaso', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function agregarTraspasoDetalle(idTraspaso, idInventarioProductoOrigen, idInventarioProductoDestino, cantidad, cantidadLiteral, puntos, precio, subTotal) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado
    const values = [idTraspaso, idInventarioProductoOrigen, idInventarioProductoDestino, cantidad, cantidadLiteral, puntos, precio, subTotal, "1"];

    var sql = `
      INSERT INTO traspasoDetalle(idTraspaso, idInventarioProductoOrigen, idInventarioProductoDestino, cantidad, cantidadLiteral, puntos, precio, subTotal, estado)
      VALUES(?,?,?,?,?,?,?,?,?);
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
    logger.log({level: 'error', label: filename + ' - agregarTraspasoDetalle', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - agregarTraspasoDetalle', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function actualizarFirmaById(firmado, idClienteOtp, idTraspaso) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [firmado, idClienteOtp, idTraspaso];
    const sql = `
      UPDATE traspaso
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

async function traspasoById(idTraspaso, estado) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idTraspaso, estado];
    const sql = `
      SELECT  traspaso.id AS 'idTraspaso', idUsuario, DATE_FORMAT(fechaTraspaso, '%d/%m/%Y') AS fechaTraspaso, horaTraspaso, total, traspaso.detalle, pagado, firmado
      , CONCAT(usuario.nombre, ' ', usuario.appat, ' ', usuario.apmat) AS usuario
      , traspaso.idAlmacenOrigen, almacenOrigen.nombre AS nombreAlmacenOrigen, traspaso.idAlmacenDestino, almacenDestino.nombre AS nombreAlmacenDestino
      , traspaso.idClienteOrigen, CONCAT(clienteOrigen.nombre, ' ', clienteOrigen.appat, ' ', clienteOrigen.apmat) AS nombreClienteOrigen, traspaso.idClienteDestino, CONCAT(clienteDestino.nombre, ' ', clienteDestino.appat, ' ', clienteDestino.apmat) AS nombreClienteDestino
      , idClienteOtp, CONCAT(clienteOtp.nombre, ' ', clienteOtp.appat, ' ', clienteOtp.apmat) AS nombreClienteOtp, clienteOtp.celular, co.otpGenerado, DATE_FORMAT(co.fechaRecibido, '%d/%m/%Y') AS fechaRecibidoOtp, co.horaRecibido AS horaRecibidoOtp
      FROM traspaso
      JOIN usuario ON traspaso.idUsuario = usuario.id
      LEFT JOIN almacen AS almacenOrigen ON traspaso.idAlmacenOrigen = almacenOrigen.id
      LEFT JOIN almacen AS almacenDestino ON traspaso.idAlmacenDestino = almacenDestino.id
      LEFT JOIN cliente AS clienteOrigen ON traspaso.idClienteOrigen != 1 AND traspaso.idClienteOrigen = clienteOrigen.id
      LEFT JOIN cliente AS clienteDestino ON traspaso.idClienteDestino != 1 AND traspaso.idClienteDestino = clienteDestino.id
      LEFT JOIN clienteOtp AS co ON traspaso.idClienteOtp != 1 AND traspaso.idClienteOtp = co.id
      LEFT JOIN cliente AS clienteOtp ON co.idCliente = clienteOtp.id
      WHERE traspaso.id = ? AND traspaso.estado = ?
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
    logger.log({level: 'error', label: filename + ' - traspasoById', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - traspasoById', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaTraspasoByEstado(estado, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [estado, idNegocio];
    const sql = `
      SELECT  traspaso.id AS 'idTraspaso', idUsuario, DATE_FORMAT(fechaTraspaso, '%d/%m/%Y') AS fechaTraspaso, horaTraspaso, total, traspaso.detalle, pagado, firmado
      , CONCAT(usuario.nombre, ' ', usuario.appat, ' ', usuario.apmat) AS usuario
      , traspaso.idAlmacenOrigen, almacenOrigen.nombre AS nombreAlmacenOrigen, traspaso.idAlmacenDestino, almacenDestino.nombre AS nombreAlmacenDestino
      , traspaso.idClienteOrigen, CONCAT(clienteOrigen.nombre, ' ', clienteOrigen.appat, ' ', clienteOrigen.apmat) AS nombreClienteOrigen, traspaso.idClienteDestino, CONCAT(clienteDestino.nombre, ' ', clienteDestino.appat, ' ', clienteDestino.apmat) AS nombreClienteDestino
      , idClienteOtp, CONCAT(clienteOtp.nombre, ' ', clienteOtp.appat, ' ', clienteOtp.apmat) AS nombreClienteOtp, clienteOtp.celular, co.otpGenerado, DATE_FORMAT(co.fechaRecibido, '%d/%m/%Y') AS fechaRecibidoOtp, co.horaRecibido AS horaRecibidoOtp
      FROM traspaso
      JOIN usuario ON traspaso.idUsuario = usuario.id
      LEFT JOIN almacen AS almacenOrigen ON traspaso.idAlmacenOrigen = almacenOrigen.id
      LEFT JOIN almacen AS almacenDestino ON traspaso.idAlmacenDestino = almacenDestino.id
      LEFT JOIN cliente AS clienteOrigen ON traspaso.idClienteOrigen != 1 AND traspaso.idClienteOrigen = clienteOrigen.id
      LEFT JOIN cliente AS clienteDestino ON traspaso.idClienteDestino != 1 AND traspaso.idClienteDestino = clienteDestino.id
      LEFT JOIN clienteOtp AS co ON traspaso.idClienteOtp != 1 AND traspaso.idClienteOtp = co.id
      LEFT JOIN cliente AS clienteOtp ON co.idCliente = clienteOtp.id
      WHERE traspaso.estado = ? AND traspaso.idNegocio = ?
      ORDER BY traspaso.id DESC
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
    logger.log({level: 'error', label: filename + ' - listaTraspasoByEstado', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaTraspasoByEstado', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaTraspasoByAlmacenOrigen(idAlmacenOrigen, estado, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idAlmacenOrigen, estado, idNegocio];
    const sql = `
      SELECT  traspaso.id AS 'idTraspaso', idUsuario, DATE_FORMAT(fechaTraspaso, '%d/%m/%Y') AS fechaTraspaso, horaTraspaso, total, traspaso.detalle, pagado, firmado
      , CONCAT(usuario.nombre, ' ', usuario.appat, ' ', usuario.apmat) AS usuario
      , traspaso.idAlmacenOrigen, almacenOrigen.nombre AS nombreAlmacenOrigen, traspaso.idAlmacenDestino, almacenDestino.nombre AS nombreAlmacenDestino
      , traspaso.idClienteOrigen, CONCAT(clienteOrigen.nombre, ' ', clienteOrigen.appat, ' ', clienteOrigen.apmat) AS nombreClienteOrigen, traspaso.idClienteDestino, CONCAT(clienteDestino.nombre, ' ', clienteDestino.appat, ' ', clienteDestino.apmat) AS nombreClienteDestino
      , idClienteOtp, CONCAT(clienteOtp.nombre, ' ', clienteOtp.appat, ' ', clienteOtp.apmat) AS nombreClienteOtp, clienteOtp.celular, co.otpGenerado, DATE_FORMAT(co.fechaRecibido, '%d/%m/%Y') AS fechaRecibidoOtp, co.horaRecibido AS horaRecibidoOtp
      FROM traspaso
      JOIN usuario ON traspaso.idUsuario = usuario.id
      LEFT JOIN almacen AS almacenOrigen ON traspaso.idAlmacenOrigen = almacenOrigen.id
      LEFT JOIN almacen AS almacenDestino ON traspaso.idAlmacenDestino = almacenDestino.id
      LEFT JOIN cliente AS clienteOrigen ON traspaso.idClienteOrigen != 1 AND traspaso.idClienteOrigen = clienteOrigen.id
      LEFT JOIN cliente AS clienteDestino ON traspaso.idClienteDestino != 1 AND traspaso.idClienteDestino = clienteDestino.id
      LEFT JOIN clienteOtp AS co ON traspaso.idClienteOtp != 1 AND traspaso.idClienteOtp = co.id
      LEFT JOIN cliente AS clienteOtp ON co.idCliente = clienteOtp.id
      WHERE traspaso.idAlmacenOrigen = ? AND traspaso.estado = ? AND traspaso.idNegocio = ?
      ORDER BY traspaso.id DESC
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
    logger.log({level: 'error', label: filename + ' - listaTraspasoByAlmacenOrigen', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaTraspasoByAlmacenOrigen', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaTraspasoByClienteOrigen(idClienteOrigen, estado, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idClienteOrigen, estado, idNegocio];
    const sql = `
      SELECT  traspaso.id AS 'idTraspaso', idUsuario, DATE_FORMAT(fechaTraspaso, '%d/%m/%Y') AS fechaTraspaso, horaTraspaso, total, traspaso.detalle, pagado, firmado
      , CONCAT(usuario.nombre, ' ', usuario.appat, ' ', usuario.apmat) AS usuario
      , traspaso.idAlmacenOrigen, almacenOrigen.nombre AS nombreAlmacenOrigen, traspaso.idAlmacenDestino, almacenDestino.nombre AS nombreAlmacenDestino
      , traspaso.idClienteOrigen, CONCAT(clienteOrigen.nombre, ' ', clienteOrigen.appat, ' ', clienteOrigen.apmat) AS nombreClienteOrigen, traspaso.idClienteDestino, CONCAT(clienteDestino.nombre, ' ', clienteDestino.appat, ' ', clienteDestino.apmat) AS nombreClienteDestino
      , idClienteOtp, CONCAT(clienteOtp.nombre, ' ', clienteOtp.appat, ' ', clienteOtp.apmat) AS nombreClienteOtp, clienteOtp.celular, co.otpGenerado, DATE_FORMAT(co.fechaRecibido, '%d/%m/%Y') AS fechaRecibidoOtp, co.horaRecibido AS horaRecibidoOtp
      FROM traspaso
      JOIN usuario ON traspaso.idUsuario = usuario.id
      LEFT JOIN almacen AS almacenOrigen ON traspaso.idAlmacenOrigen = almacenOrigen.id
      LEFT JOIN almacen AS almacenDestino ON traspaso.idAlmacenDestino = almacenDestino.id
      LEFT JOIN cliente AS clienteOrigen ON traspaso.idClienteOrigen != 1 AND traspaso.idClienteOrigen = clienteOrigen.id
      LEFT JOIN cliente AS clienteDestino ON traspaso.idClienteDestino != 1 AND traspaso.idClienteDestino = clienteDestino.id
      LEFT JOIN clienteOtp AS co ON traspaso.idClienteOtp != 1 AND traspaso.idClienteOtp = co.id
      LEFT JOIN cliente AS clienteOtp ON co.idCliente = clienteOtp.id
      WHERE traspaso.idClienteOrigen = ? AND traspaso.estado = ? AND traspaso.idNegocio = ?
      ORDER BY traspaso.id DESC
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
    logger.log({level: 'error', label: filename + ' - listaTraspasoByClienteOrigen', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaTraspasoByClienteOrigen', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaTraspasoDetalleByIdTraspaso(idTraspaso, estado) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idTraspaso, estado];
    const sql = `
      SELECT traspasoDetalle.id as 'idTraspasoDetalle', idTraspaso, traspasoDetalle.cantidad, traspasoDetalle.cantidadLiteral, traspasoDetalle.puntos, traspasoDetalle.precio, traspasoDetalle.subTotal
      , idInventarioProductoOrigen, producto.nombre, producto.codigo, producto.puntos, inventarioProducto.costo
      , idInventarioProductoDestino
      FROM traspasoDetalle, inventarioProducto, producto
      WHERE traspasoDetalle.idInventarioProductoOrigen = inventarioProducto.id and inventarioProducto.idProducto = producto.id
      and traspasoDetalle.idTraspaso = ? and traspasoDetalle.estado = ?;
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
    logger.log({level: 'error', label: filename + ' - listaTraspasoDetalleByIdTraspaso', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaTraspasoDetalleByIdTraspaso', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}


module.exports = {
  agregarTraspaso,
  agregarTraspasoDetalle,

  actualizarFirmaById,

  traspasoById,

  listaTraspasoByEstado,
  listaTraspasoByAlmacenOrigen,
  listaTraspasoByClienteOrigen,

  listaTraspasoDetalleByIdTraspaso
};