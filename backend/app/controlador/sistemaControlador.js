const logger = require('../logger').logger
const path = require('path');
const filename = path.basename(__filename);
const { getMessage, getMessageCategory } = require('../messages');
const usuarioControlador = require('./usuarioControlador');
const sistemaModelo = require('../modelo/sistemaModelo');

async function version(entrada){
    let data = [];
    let codigo = getMessageCategory("proceso", "nivelControlador", "correcto", "codigo");
    let estado = true;
    let mensaje = getMessageCategory("proceso", "nivelControlador", "correcto", "mensaje");
    let respuesta = {data, codigo, estado, mensaje}

    try{
        let sistema = await sistemaModelo.version();

        if (sistema["data"].length == 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "No se encontro la versión del sistema, contactese con el administrador.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - version", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(sistema)});
            return respuesta;
        }

        sistema.data = sistema["data"][0]
        respuesta = sistema;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - version', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

//export
module.exports = {
    version
}