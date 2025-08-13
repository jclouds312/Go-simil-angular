const logger = require('../logger').logger
const path = require('path');
const filename = path.basename(__filename);
const libFecha = require('../libreria/libFecha');
const { getMessage, getMessageCategory } = require('../messages');
const convertir = require('../libreria/convertir.js');
const usuarioControlador = require('./usuarioControlador');
const precioVentaModelo = require('../modelo/precioVentaModelo');

async function agregarPrecioVenta(entrada){
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

        let oPrecioVenta = await precioVentaModelo.precioVentaByNombre(entrada.nombre, "1", entrada.idNegocio);
        if (!oPrecioVenta.estado) {
            respuesta = oPrecioVenta;
            return respuesta;
        }

        if (oPrecioVenta["data"].length > 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "Ya existe un precio de venta con el nombre registrado, verifique e intente nuevamente.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - agregarUsuario", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(oPrecioVenta)});
            return respuesta;
        }

        oPrecioVenta = await precioVentaModelo.precioVentaByPorcentaje(entrada.porcentaje, "1", entrada.idNegocio);
        if (!oPrecioVenta.estado) {
            respuesta = oPrecioVenta;
            return respuesta;
        }

        if (oPrecioVenta["data"].length > 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "Ya existe un precio de venta con el porcentaje registrado, verifique e intente nuevamente.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - agregarUsuario", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(oPrecioVenta)});
            return respuesta;
        }

        oPrecioVenta = await precioVentaModelo.agregarPrecioVenta(entrada.nombre, entrada.porcentaje, fecha, hora, entrada.idNegocio);
        if (!oPrecioVenta.estado) {
            respuesta = oPrecioVenta;
            return respuesta;
        }
        
        respuesta = oPrecioVenta;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - agregarPrecioVenta', message: JSON.stringify(respuesta)});
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
        
        let oActualizar = await precioVentaModelo.actualizarEstadoById(entrada.estado, entrada.idPrecioVenta);
        if (!oActualizar.estado) {
            respuesta = oActualizar;
            return respuesta;
        }

        respuesta = oActualizar;
        

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

async function listaPrecioVentaByEstado(entrada){
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
        
        let precioVenta = await precioVentaModelo.listaPrecioVentaByEstado(entrada.estado, entrada.idNegocio);
        if (!precioVenta.estado) {
            respuesta = precioVenta;
            return respuesta;
        }

        respuesta.data = precioVenta.data;
        

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaPrecioVentaByEstado', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaPrecioVentaByCostoEstado(entrada){
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
        
        let precioVenta = await precioVentaModelo.listaPrecioVentaByEstado(entrada.estado, entrada.idNegocio);
        if (!precioVenta.estado) {
            respuesta = precioVenta;
            return respuesta;
        }

        for (let i = 0; i < precioVenta.data.length; i++) {
            precioVenta["data"][i]["precioVenta"] = (parseFloat(entrada.costo) + ((parseInt(precioVenta["data"][i]["porcentaje"]) * 0.01) * parseFloat(entrada.costo))).toFixed(2)
            precioVenta["data"][i]["precioVentaFormato"] = convertir.formatoMoneda(precioVenta["data"][i]["precioVenta"]);
        }

        respuesta.data = precioVenta.data;
        

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaPrecioVentaByCostoEstado', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

//export
module.exports = {
    agregarPrecioVenta,

    actualizarEstadoById,

    listaPrecioVentaByEstado,
    listaPrecioVentaByCostoEstado
}