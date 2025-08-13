const logger = require('../logger').logger
const path = require('path');
const filename = path.basename(__filename);
const libFecha = require('../libreria/libFecha');
const { getMessage, getMessageCategory } = require('../messages');
const convertir = require('../libreria/convertir.js');
const usuarioControlador = require('./usuarioControlador');
const categoriaModelo = require('../modelo/categoriaModelo');

async function agregarCategoria(entrada){
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

        let buscarCategoria = await categoriaModelo.categoriaByNombre(entrada.nombre, entrada.idNegocio);
        if (!buscarCategoria.estado) {
            respuesta = buscarCategoria;
            return respuesta;
        }

        if (buscarCategoria["data"].length > 0) {
            if(buscarCategoria["data"][0]["estado"] == "0"){
                let oCategoria = await categoriaModelo.actualizarEstadoById(buscarCategoria["data"][0]["idCategoria"], "1");

                respuesta.codigo = "1";
                respuesta.estado = false;
                respuesta.mensaje = "El nombre del almacén que acabas de ingresar ya estaba registrado y deshabilitado. Ahora se ha habilitado nuevamente";
                respuesta.data = [];
                logger.log({level: "info", label: filename + " - agregarCategoria", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(buscarCategoria)});
                return respuesta;
            }

            if(buscarCategoria["data"][0]["estado"] == "1"){
                respuesta.codigo = "1";
                respuesta.estado = false;
                respuesta.mensaje = "El nombre del almacén que acabas de ingresar ya está registrado. Por favor, cambia el nombre.";
                respuesta.data = [];
                logger.log({level: "info", label: filename + " - agregarCategoria", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(buscarCategoria)});
                return respuesta;
            }
        }

        let nuevoCategoria = await categoriaModelo.agregarCategoria(entrada.nombre, entrada.meta, entrada.porcentaje, entrada.idNegocio);
        if (!nuevoCategoria.estado) {
            respuesta = nuevoCategoria;
            return respuesta;
        }

        let oPagoComision = await categoriaModelo.agregarPagoComision(nuevoCategoria["data"]["idCategoria"], entrada.meta, entrada.porcentaje, fecha, hora, entrada.idNegocio);
        if (!oPagoComision.estado) {
            respuesta = oPagoComision;
            return respuesta;
        }

        respuesta = nuevoCategoria;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - agregarCategoria', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function actualizarCategoriaById(entrada){
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

        let buscarCategoria = await categoriaModelo.categoriaById(entrada.idCategoria);
        if (!buscarCategoria.estado) {
            respuesta = buscarCategoria;
            return respuesta;
        }

        if (buscarCategoria["data"].length == 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "No encontré el almacén. Por favor, revisa los datos e inténtalo de nuevo.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - actualizarCategoriaById", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(buscarCategoria)});
            return respuesta;
        }

        let oCategoria = await categoriaModelo.actualizarCategoriaById(entrada.idCategoria, entrada.nombre, entrada.meta, entrada.porcentaje);
        if (!oCategoria.estado) {
            respuesta = oCategoria;
            return respuesta;
        }

        let oPagoComision = await categoriaModelo.agregarPagoComision(entrada.idCategoria, entrada.meta, entrada.porcentaje, fecha, hora, entrada.idNegocio);
        if (!oPagoComision.estado) {
            respuesta = oPagoComision;
            return respuesta;
        }

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - actualizarCategoriaById', message: JSON.stringify(respuesta)});
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

        let buscarCategoria = await categoriaModelo.categoriaById(entrada.idCategoria);
        if (!buscarCategoria.estado) {
            respuesta = buscarCategoria;
            return respuesta;
        }

        if (buscarCategoria["data"].length == 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "No encontré el almacén. Por favor, revisa los datos e inténtalo de nuevo.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - actualizarEstadoById", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(buscarCategoria)});
            return respuesta;
        }

        

        let oCategoria = await categoriaModelo.actualizarEstadoById(entrada.idCategoria, entrada.estado);
        if (!oCategoria.estado) {
            respuesta = oCategoria;
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

async function categoriaById(entrada){
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
        
        let categorias = await categoriaModelo.categoriaById(entrada.idCategoria);
        if (!categorias.estado) {
            respuesta = categorias;
            return respuesta;
        }
        categorias["data"] = categorias["data"][0];
        respuesta = categorias;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - categoriaById', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaCategoriaByEstado(entrada){
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
        
        let categorias = await categoriaModelo.listaCategoriaByEstado(entrada.estado, entrada.idNegocio);
        if (!categorias.estado) {
            respuesta = categorias;
            return respuesta;
        }

        for(let i=0; i<categorias["data"].length; i++){
            categorias["data"][i]["metaFormato"] = convertir.formatoMoneda(categorias["data"][i]["meta"])
            
        }

        respuesta = categorias;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaCategoriaByEstado', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

//export
module.exports = {
    agregarCategoria,

    actualizarCategoriaById,
    actualizarEstadoById,

    categoriaById,

    listaCategoriaByEstado
}