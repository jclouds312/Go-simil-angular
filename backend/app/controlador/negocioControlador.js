const logger = require('../logger.js').logger
const path = require('path');
const filename = path.basename(__filename);
const libFecha = require('../libreria/libFecha.js');
const { getMessage, getMessageCategory } = require('../messages.js');
const convertir = require('../libreria/convertir.js');
const usuarioControlador = require('./usuarioControlador.js');
const whatsappClient = require('../apiclient/whatsappClient.js');

async function whatsappIniciarSesion(entrada){
    let data = [];
    let codigo = getMessageCategory("proceso", "nivelControlador", "correcto", "codigo");
    let estado = true;
    let mensaje = getMessageCategory("proceso", "nivelControlador", "correcto", "mensaje");
    let respuesta = {data, codigo, estado, mensaje}

    try{
        const {fecha , hora} = await libFecha.fechaHoraActualyymmdd();

        entrada.avanzado = true;
        let oLogin = await usuarioControlador.usuarioLoginByIdLogin(entrada);
        if (!oLogin.estado) {
            respuesta = oLogin;
            return respuesta;
        }

        entrada.idNegocio = oLogin["data"]["usuario"]["idNegocio"];
        entrada.idUsuario = oLogin["data"]["usuario"]["idUsuario"];
        
        let intentos = 3;
        let tiempo = 2000;
        let oIniciar;
        for(let i=0; i<intentos; i++){
            oIniciar = await whatsappClient.iniciarSesion({});
            if (oIniciar.estado) {
                break;
            } else {
                await new Promise(resolve => setTimeout(resolve, tiempo));
            }
        }

        respuesta = oIniciar;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - whatsappIniciarSesion', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

//export
module.exports = {
    whatsappIniciarSesion
}