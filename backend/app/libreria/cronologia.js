const { getPool } = require("../config/database");
const logger = require("../logger").logger;
const path = require("path");
const filename = path.basename(__filename);
const { getMessage, getMessageCategory } = require('../messages');

async function agregarCronologia(idLogin, token, dispositivo, ip, solicitud, resp, ruta) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let date = new Date();
    const solicitudString = JSON.stringify(solicitud); // Convertir solicitud a cadena de texto
    const respuestaString = JSON.stringify(resp); // Convertir respuesta a cadena de texto
    const fecha = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    const hora = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    const values = [ idLogin, token, dispositivo, ip, solicitudString, respuestaString, fecha, hora, ruta, 1];
    const sql = `
      INSERT INTO cronologia(idLogin, token, dispositivo, ip, solicitud, respuesta, fecha, hora, ruta, estado)
      VALUES(?,?,?,?,?,?,?,?,?,?);
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
    logger.log({level: 'error', label: filename + ' - agregarCronologia', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - agregarCronologia', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

module.exports = {
  agregarCronologia,
};
