const logger = require('../logger').logger
const path = require('path');
const filename = path.basename(__filename);
const libFecha = require('../libreria/libFecha');
const { getMessage, getMessageCategory } = require('../messages');
const usuarioControlador = require('./usuarioControlador');
const almacenModelo = require('../modelo/almacenModelo');

async function agregarAlmacen(entrada){
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

        let buscarAlmacen = await almacenModelo.almacenByNombre(entrada.nombre, entrada.idNegocio);
        if (!buscarAlmacen.estado) {
            respuesta = buscarAlmacen;
            return respuesta;
        }

        if (buscarAlmacen["data"].length > 0) {
            if(buscarAlmacen["data"][0]["estado"] == "0"){
                let oAlmacen = await almacenModelo.actualizarEstadoById(buscarAlmacen["data"][0]["idAlmacen"], "1");

                respuesta.codigo = "1";
                respuesta.estado = false;
                respuesta.mensaje = "El nombre del almacén que acabas de ingresar ya estaba registrado y deshabilitado. Ahora se ha habilitado nuevamente";
                respuesta.data = [];
                logger.log({level: "info", label: filename + " - agregarAlmacen", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(buscarAlmacen)});
                return respuesta;
            }

            if(buscarAlmacen["data"][0]["estado"] == "1"){
                respuesta.codigo = "1";
                respuesta.estado = false;
                respuesta.mensaje = "El nombre del almacén que acabas de ingresar ya está registrado. Por favor, cambia el nombre.";
                respuesta.data = [];
                logger.log({level: "info", label: filename + " - agregarAlmacen", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(buscarAlmacen)});
                return respuesta;
            }
        }

        let nuevoAlmacen = await almacenModelo.agregarAlmacen(entrada.nombre, entrada.descripcion, entrada.idNegocio);
        if (!nuevoAlmacen.estado) {
            respuesta = nuevoAlmacen;
            return respuesta;
        }

        respuesta = nuevoAlmacen;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - agregarAlmacen', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function actualizarAlmacenById(entrada){
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

        let buscarAlmacen = await almacenModelo.almacenById(entrada.idAlmacen);
        if (!buscarAlmacen.estado) {
            respuesta = buscarAlmacen;
            return respuesta;
        }

        if (buscarAlmacen["data"].length == 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "No encontré el almacén. Por favor, revisa los datos e inténtalo de nuevo.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - actualizarAlmacenById", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(buscarAlmacen)});
            return respuesta;
        }

        buscarAlmacen = await almacenModelo.almacenByNombre(entrada.nombre, entrada.idNegocio);
        if (!buscarAlmacen.estado) {
            respuesta = buscarAlmacen;
            return respuesta;
        }

        if (buscarAlmacen["data"].length > 0) {
            respuesta.codigo = "2";
            respuesta.estado = false;
            respuesta.mensaje = "El nombre del almacén que acabas de ingresar ya está registrado. Por favor, cambia el nombre.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - actualizarAlmacenById", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(buscarAlmacen)});
            return respuesta;
        }

        let oAlmacen = await almacenModelo.actualizarAlmacenById(entrada.idAlmacen, entrada.nombre, entrada.descripcion);
        if (!oAlmacen.estado) {
            respuesta = oAlmacen;
            return respuesta;
        }

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - actualizarAlmacenById', message: JSON.stringify(respuesta)});
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

        let buscarAlmacen = await almacenModelo.almacenById(entrada.idAlmacen);
        if (!buscarAlmacen.estado) {
            respuesta = buscarAlmacen;
            return respuesta;
        }

        if (buscarAlmacen["data"].length == 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "No encontré el almacén. Por favor, revisa los datos e inténtalo de nuevo.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - actualizarEstadoById", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(buscarAlmacen)});
            return respuesta;
        }

        

        let oAlmacen = await almacenModelo.actualizarEstadoById(entrada.idAlmacen, entrada.estado);
        if (!oAlmacen.estado) {
            respuesta = oAlmacen;
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

async function almacenById(entrada){
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
        
        let almacenes = await almacenModelo.almacenById(entrada.idAlmacen);
        if (!almacenes.estado) {
            respuesta = almacenes;
            return respuesta;
        }
        almacenes["data"] = almacenes["data"][0];
        respuesta = almacenes;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - almacenById', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaAlmacenByEstado(entrada){
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
        
        let almacenes = await almacenModelo.listaAlmacenByEstado(entrada.estado, entrada.idNegocio);
        if (!almacenes.estado) {
            respuesta = almacenes;
            return respuesta;
        }

        respuesta = almacenes;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaAlmacenByEstado', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

//export
module.exports = {
    agregarAlmacen,

    actualizarAlmacenById,
    actualizarEstadoById,

    almacenById,

    listaAlmacenByEstado
}