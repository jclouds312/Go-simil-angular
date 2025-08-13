const logger = require('../logger').logger
const path = require('path');
const filename = path.basename(__filename);
const config = require('../../config');
const { getMessage, getMessageCategory } = require('../messages');
const axios = require('axios');

async function iniciarSesion(entrada){
    let data = [];
    let codigo = getMessageCategory("proceso", "nivelControlador", "correcto", "codigo");
    let estado = true;
    let mensaje = getMessageCategory("proceso", "nivelControlador", "correcto", "mensaje");
    let respuesta = {data, codigo, estado, mensaje}

    try{
        const url = config.WHATSAPP_URLBASE + config.WHATSAPP_URL_INICIARSESION;
        const credenciales = {
            auth: {
                username: config.WHATSAPP_USER,
                password: config.WHATSAPP_PASS
            }
        }

        const data = {
            "idUsuario":"1",
            "canal": config.WHATSAPP_CANAL
        }

        await axios.post(url, data, credenciales)
            .then(response => {
                logger.log({
                level: "info",
                label: filename + " - envio header whatsapp",
                message: url + "," + JSON.stringify(credenciales) + "," + JSON.stringify(data) + "," + JSON.stringify(response.data)});

                respuesta = response.data;
            })
            .catch(error => {
                console.log("error" ,error)
                if(error.response.status == 401){
                    return error.response.data;
                }
                if(error.response.status == 500){
                    return error.response.data;
                }

                console.error('Error:', error.response.status);
                console.log('Respuesta Error:', error.response.data);
                //console.error('Error:', error);
                console.error('Error:', error.message);
                respuesta.codigo = "1";
                respuesta.estado = false;
                respuesta.mensaje = "No se pudo Iniciar Sesión por codigo " + error.response.status;
                respuesta.data = [];
                logger.log({
                level: "error",
                label: filename + " - iniciarSesion",
                message: JSON.stringify(entrada) + "," + JSON.stringify(error)});
            });
    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - iniciarSesion', message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}


async function enviarMensajeANumeros(entrada){
    let data = [];
    let codigo = getMessageCategory("proceso", "nivelControlador", "correcto", "codigo");
    let estado = true;
    let mensaje = getMessageCategory("proceso", "nivelControlador", "correcto", "mensaje");
    let respuesta = {data, codigo, estado, mensaje}

    try{
        const url = config.WHATSAPP_URLBASE + config.WHATSAPP_URL_MENSAJEANUMEROS;
        const credenciales = {
            auth: {
                username: config.WHATSAPP_USER,
                password: config.WHATSAPP_PASS
            }
        }

        const data = {
            "idUsuario":"1",
            "canal": config.WHATSAPP_CANAL,
            "numeros": entrada.numeros,
            "mensaje": entrada.mensaje
        }

        await axios.post(url, data, credenciales)
            .then(response => {
                logger.log({
                level: "info",
                label: filename + " - envio header whatsapp",
                message: url + "," + JSON.stringify(credenciales) + "," + JSON.stringify(data) + "," + JSON.stringify(response.data)});

                respuesta = response.data;
            })
            .catch(error => {
                console.log("error" ,error)
                if(error.response.status == 401){
                    return error.response.data;
                }
                if(error.response.status == 500){
                    return error.response.data;
                }

                console.error('Error:', error.response.status);
                console.log('Respuesta Error:', error.response.data);
                //console.error('Error:', error);
                console.error('Error:', error.message);
                respuesta.codigo = "1";
                respuesta.estado = false;
                respuesta.mensaje = "No se pudo enviar el mensaje";
                respuesta.data = [];
                logger.log({
                level: "error",
                label: filename + " - enviarMensajeANumeros",
                message: JSON.stringify(entrada) + "," + JSON.stringify(error)});
            });
    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - enviarMensajeANumeros', message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function enviarPdfANumeros(entrada){
    let data = [];
    let codigo = getMessageCategory("proceso", "nivelControlador", "correcto", "codigo");
    let estado = true;
    let mensaje = getMessageCategory("proceso", "nivelControlador", "correcto", "mensaje");
    let respuesta = {data, codigo, estado, mensaje}

    try{
        const url = config.WHATSAPP_URLBASE + config.WHATSAPP_URL_PDFANUMEROS;
        const credenciales = {
            auth: {
                username: config.WHATSAPP_USER,
                password: config.WHATSAPP_PASS
            }
        }

        const data = {
            "idUsuario":"1",
            "canal": config.WHATSAPP_CANAL,
            "numeros": entrada.numeros,
            "nombrePdf": entrada.nombrePdf,
            "pdfData": entrada.pdfData
        }

        await axios.post(url, data, credenciales)
            .then(response => {
                logger.log({
                level: "info",
                label: filename + " - envio header whatsapp",
                message: url + "," + JSON.stringify(credenciales) + "," + JSON.stringify(data) + "," + JSON.stringify(response.data)});
                
                respuesta = response.data;
            })
            .catch(error => {
                console.log("error" ,error)
                if(error.response.status == 401){
                    return error.response.data;
                }
                if(error.response.status == 500){
                    return error.response.data;
                }

                console.error('Error:', error.response.status);
                console.log('Respuesta Error:', error.response.data);
                //console.error('Error:', error);
                console.error('Error:', error.message);
                respuesta.codigo = "1";
                respuesta.estado = false;
                respuesta.mensaje = "No se pudo enviar el documento";
                respuesta.data = [];
                logger.log({
                level: "error",
                label: filename + " - enviarPdfANumeros",
                message: JSON.stringify(entrada) + "," + JSON.stringify(error)});
            });
    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - enviarPdfANumeros', message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

//export
module.exports = {
    iniciarSesion,
    enviarMensajeANumeros,
    enviarPdfANumeros
}