const { getPool } = require("../config/database");
const logger = require("../logger").logger;
const path = require("path");
const filename = path.basename(__filename);
const { getMessage, getMessageCategory } = require('../messages');

async function agregarReceta(cilindroDer, esferaDer, ejeDer, cilindroIzq, esferaIzq, ejeIzq, material, tratamiento, idNegocio, addDer, addIzq, ao, dip, armazon, bifocal) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado
    let idGenerado = Date.now();
    const values = [idGenerado, cilindroDer, esferaDer, ejeDer, cilindroIzq, esferaIzq, ejeIzq, material, tratamiento, idNegocio, addDer, addIzq, ao, dip, armazon, bifocal];

    var sql = `
      INSERT INTO receta(id, cilindroDer, esferaDer, ejeDer, cilindroIzq, esferaIzq, ejeIzq, material, tratamiento, idNegocio, addDer, addIzq, ao, dip, armazon, bifocal)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
    `;

    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]
    respuesta.data["idReceta"] = idGenerado;

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - agregarReceta', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - agregarReceta', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function recetaById(idReceta, estado) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idReceta, estado];
    const sql = `
      SELECT cilindroDer, esferaDer, ejeDer, cilindroIzq, esferaIzq, ejeIzq, material, tratamiento, addDer, addIzq, ao, dip, armazon, bifocal
      , sucursal.nombre as 'nombreSucursal'
      , CONCAT(cliente.nombre, ' ', cliente.appat, ' ', cliente.apmat) as 'cliente'
      ,CONCAT(usuario.nombre, ' ', usuario.appat, ' ', usuario.apmat) as 'usuario'
      FROM receta, venta, sucursal, cliente, usuario
      WHERE receta.id = venta.idReceta and venta.idSucursal = sucursal.id and venta.idCliente = cliente.id and venta.idUsuario = usuario.id
      and receta.id = ?;
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
    logger.log({level: 'error', label: filename + ' - recetaById', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - recetaById', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}
module.exports = {
  agregarReceta,
  recetaById
};