const logger = require('../logger.js').logger
const path = require('path');
const filename = path.basename(__filename);
const libFecha = require('../libreria/libFecha.js');
const { getMessage, getMessageCategory } = require('../messages.js');
const convertir = require('../libreria/convertir.js');
const usuarioControlador = require('./usuarioControlador.js');
const descuentoModelo = require('../modelo/descuentoModelo.js');

async function agregarDescuento(entrada){
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

        let buscarDescuento = await descuentoModelo.descuentoByNombre(entrada.nombre, entrada.idNegocio);
        if (!buscarDescuento.estado) {
            respuesta = buscarDescuento;
            return respuesta;
        }

        if (buscarDescuento["data"].length > 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "El nombre del descuento que acabas de ingresar ya está registrado. Por favor, cambia el nombre.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - agregarDescuento", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(buscarDescuento)});
            return respuesta;
        }

        let nuevoDescuento = await descuentoModelo.agregarDescuento(entrada.nombre, entrada.porcentaje, entrada.multiplo, entrada.idProducto, fecha, hora, entrada.idNegocio);
        if (!nuevoDescuento.estado) {
            respuesta = nuevoDescuento;
            return respuesta;
        }

        respuesta = nuevoDescuento;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - agregarDescuento', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function actualizarEstadoById(entrada){
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

        let buscarDescuento = await descuentoModelo.descuentoById(entrada.idDescuento);
        if (!buscarDescuento.estado) {
            respuesta = buscarDescuento;
            return respuesta;
        }

        if (buscarDescuento["data"].length == 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "No encontré el descuento. Por favor, revisa los datos e inténtalo de nuevo.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - actualizarEstadoById", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(buscarDescuento)});
            return respuesta;
        }

        

        let oDescuento = await descuentoModelo.actualizarEstadoById(entrada.idDescuento, entrada.estado);
        if (!oDescuento.estado) {
            respuesta = oDescuento;
            return respuesta;
        }

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - actualizarEstadoById', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function descuentoById(entrada){
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
        
        let descuentos = await descuentoModelo.descuentoById(entrada.idDescuento);
        if (!descuentos.estado) {
            respuesta = descuentos;
            return respuesta;
        }
        descuentos["data"] = descuentos["data"][0];
        respuesta = descuentos;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - descuentoById', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaDescuentoByEstado(entrada){
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
        
        let descuentos = await descuentoModelo.listaDescuentoByEstado(entrada.estado, entrada.idNegocio);
        if (!descuentos.estado) {
            respuesta = descuentos;
            return respuesta;
        }

        for(let i=0; i<descuentos["data"].length; i++){
            descuentos["data"][i]["codigoLiteral"] = "S/C";
            if(descuentos["data"][i]["codigo"] != ""){
                descuentos["data"][i]["codigoLiteral"] = "#" + descuentos["data"][i]["codigo"];
            }
        }

        respuesta = descuentos;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaDescuentoByEstado', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaDescuentoByProductoEstado(entrada){
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
        
        let descuentos = await descuentoModelo.listaDescuentoByProductoEstado(entrada.idProducto, entrada.estado, entrada.idNegocio);
        if (!descuentos.estado) {
            respuesta = descuentos;
            return respuesta;
        }

        for(let i=0; i<descuentos["data"].length; i++){
            descuentos["data"][i]["codigoLiteral"] = "S/C";
            if(descuentos["data"][i]["codigo"] != ""){
                descuentos["data"][i]["codigoLiteral"] = "#" + descuentos["data"][i]["codigo"];
            }
        }

        respuesta = descuentos;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaDescuentoByProductoEstado', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

//export
module.exports = {
    agregarDescuento,

    actualizarEstadoById,

    descuentoById,

    listaDescuentoByEstado,
    listaDescuentoByProductoEstado
}