const { getPool } = require("../config/database");
const logger = require("../logger").logger;
const path = require("path");
const filename = path.basename(__filename);
const { getMessage, getMessageCategory } = require('../messages');

async function agregarPrecioVenta(nombre, porcentaje, fecha, hora, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado
    let idGenerado = Date.now();
    const values = [idGenerado, nombre, porcentaje, fecha, hora, "1", idNegocio];

    var sql = `
      INSERT INTO precioVenta(id, nombre, porcentaje, fecha, hora, estado, idNegocio)
      VALUES(?,?,?,?,?,?,?);
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
    logger.log({level: 'error', label: filename + ' - agregarPrecioVenta', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - agregarPrecioVenta', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function actualizarEstadoById(estado, idPrecioVenta) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [estado, idPrecioVenta];
    const sql = `
      UPDATE precioVenta
      SET estado = ?
      WHERE id = ?;
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
    logger.log({level: 'error', label: filename + ' - actualizarEstadoById', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - actualizarEstadoById', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function precioVentaByPorcentaje(porcentaje, estado, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [porcentaje, estado, idNegocio];
    const sql = `
      SELECT precioVenta.id as 'idPrecioVenta', nombre, porcentaje, fecha, hora
      FROM precioVenta
      WHERE precioVenta.porcentaje = ? AND precioVenta.estado = ? AND precioVenta.idNegocio = ?;
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
    logger.log({level: 'error', label: filename + ' - precioVentaByPorcentaje', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - precioVentaByPorcentaje', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function precioVentaByNombre(nombre, estado, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [nombre, estado, idNegocio];
    const sql = `
      SELECT precioVenta.id as 'idPrecioVenta', nombre, porcentaje, fecha, hora
      FROM precioVenta
      WHERE precioVenta.nombre = ? AND precioVenta.estado = ? AND precioVenta.idNegocio = ?;
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
    logger.log({level: 'error', label: filename + ' - precioVentaByNombre', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - precioVentaByNombre', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaPrecioVentaByEstado(estado, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [estado, idNegocio];
    const sql = `
      SELECT precioVenta.id as 'idPrecioVenta', nombre, porcentaje, fecha, hora
      FROM precioVenta
      WHERE precioVenta.estado = ? AND precioVenta.idNegocio = ?
      ORDER BY precioVenta.porcentaje ASC;
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
    logger.log({level: 'error', label: filename + ' - listaPrecioVentaByEstado', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaPrecioVentaByEstado', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

module.exports = {
  agregarPrecioVenta,

  actualizarEstadoById,

  precioVentaByPorcentaje,
  precioVentaByNombre,

  listaPrecioVentaByEstado
};