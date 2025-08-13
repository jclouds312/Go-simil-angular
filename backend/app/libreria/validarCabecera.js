const logger = require('../logger').logger
const path = require('path');
const filename = path.basename(__filename);
const { getMessage, getMessageCategory } = require('../messages');

function validar(token, dispositivoInformacion, ip){
  let data = [];
  let codigo = "0";
  let mensaje = "Proceso correcto";
  let estado = true;
  let respuesta = {data, codigo, estado, mensaje}


  if(token == undefined){
    respuesta.codigo = "-100";
    respuesta.estado = false;
    respuesta.mensaje = "Token incorrecto";
    respuesta.data = [];
    logger.log({level: "info", label: filename + " - validar", message: " || Request:" + JSON.stringify(token) + " || Response:" + JSON.stringify(respuesta)});
    return respuesta;
  }

  if (ip == null || ip === undefined || ip === "") {
    respuesta.codigo = "-100";
    respuesta.estado = false;
    respuesta.mensaje = "La IP de la solicitud es incorrecta.";
    respuesta.data = [];
    logger.log({level: "info", label: filename + " - validar", message: " || Request:" + JSON.stringify(ip) + " || Response:" + JSON.stringify(respuesta)});
    return respuesta;
  }

  const dispositivo = dispositivoInformacion.getResult();

  respuesta.data = {
    "dispositivo": `navegador:${dispositivo.browser.name}||versiónNavegador:${dispositivo.browser.version}||sistemaOperativo:${dispositivo.os.name}||tipoDispositivo:${dispositivo.device.type || 'Desktop'}||modeloDispositivo:${dispositivo.device.model}|cpu:${dispositivo.cpu.architecture}`
  }
  return (respuesta); 
}

module.exports = {
  validar
}