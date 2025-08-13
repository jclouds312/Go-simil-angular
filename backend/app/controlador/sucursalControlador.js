const logger = require('../logger').logger
const path = require('path');
const filename = path.basename(__filename);
const libFecha = require('../libreria/libFecha');
const { getMessage, getMessageCategory } = require('../messages');
const usuarioControlador = require('./usuarioControlador');
const sucursalModelo = require('../modelo/sucursalModelo');

async function agregarSucursal(entrada){
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

        let buscarSucursal = await sucursalModelo.sucursalByNombre(entrada.nombre, entrada.idNegocio);
        if (!buscarSucursal.estado) {
            respuesta = buscarSucursal;
            return respuesta;
        }

        if (buscarSucursal["data"].length > 0) {
            if(buscarSucursal["data"][0]["estado"] == "0"){
                let oSucursal = await sucursalModelo.actualizarEstadoById(buscarSucursal["data"][0]["idSucursal"], "1");

                respuesta.codigo = "1";
                respuesta.estado = false;
                respuesta.mensaje = "El nombre del almacén que acabas de ingresar ya estaba registrado y deshabilitado. Ahora se ha habilitado nuevamente";
                respuesta.data = [];
                logger.log({level: "info", label: filename + " - agregarSucursal", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(buscarSucursal)});
                return respuesta;
            }

            if(buscarSucursal["data"][0]["estado"] == "1"){
                respuesta.codigo = "1";
                respuesta.estado = false;
                respuesta.mensaje = "El nombre del almacén que acabas de ingresar ya está registrado. Por favor, cambia el nombre.";
                respuesta.data = [];
                logger.log({level: "info", label: filename + " - agregarSucursal", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(buscarSucursal)});
                return respuesta;
            }
        }

        let nuevoSucursal = await sucursalModelo.agregarSucursal(entrada.nombre, entrada.descripcion, entrada.idNegocio);
        if (!nuevoSucursal.estado) {
            respuesta = nuevoSucursal;
            return respuesta;
        }

        respuesta = nuevoSucursal;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - agregarSucursal', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function agregarSucursalAlmacen(entrada){
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

        let oAlmacen = await sucursalModelo.sucursalAlmacenByAlmacenSucursal(entrada.idAlmacen, entrada.idSucursal, "1");
        if (!oAlmacen.estado) {
            respuesta = oAlmacen;
            return respuesta;
        }

        if (oAlmacen["data"].length > 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "Ya existe el almacén asignado a la sucursal, verifique e intente nuevamente.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - agregarSucursalAlmacen", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(oAlmacen)});
            return respuesta;
        }

        let oAgregar = await sucursalModelo.agregarSucursalAlmacen(entrada.idAlmacen, entrada.idSucursal, entrada.idUsuario, fecha, hora, entrada.idNegocio);
        if (!oAgregar.estado) {
            respuesta = oAgregar;
            return respuesta;
        }

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - agregarSucursalAlmacen', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function actualizarSucursalById(entrada){
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

        let buscarSucursal = await sucursalModelo.sucursalById(entrada.idSucursal);
        if (!buscarSucursal.estado) {
            respuesta = buscarSucursal;
            return respuesta;
        }

        if (buscarSucursal["data"].length == 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "No encontré el almacén. Por favor, revisa los datos e inténtalo de nuevo.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - actualizarSucursalById", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(buscarSucursal)});
            return respuesta;
        }

        buscarSucursal = await sucursalModelo.sucursalByNombre(entrada.nombre, entrada.idNegocio);
        if (!buscarSucursal.estado) {
            respuesta = buscarSucursal;
            return respuesta;
        }

        if (buscarSucursal["data"].length > 0) {
            respuesta.codigo = "2";
            respuesta.estado = false;
            respuesta.mensaje = "El nombre del almacén que acabas de ingresar ya está registrado. Por favor, cambia el nombre.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - actualizarSucursalById", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(buscarSucursal)});
            return respuesta;
        }

        let oSucursal = await sucursalModelo.actualizarSucursalById(entrada.idSucursal, entrada.nombre, entrada.descripcion);
        if (!oSucursal.estado) {
            respuesta = oSucursal;
            return respuesta;
        }

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - actualizarSucursalById', message: JSON.stringify(respuesta)});
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

        let buscarSucursal = await sucursalModelo.sucursalById(entrada.idSucursal);
        if (!buscarSucursal.estado) {
            respuesta = buscarSucursal;
            return respuesta;
        }

        if (buscarSucursal["data"].length == 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "No encontré el almacén. Por favor, revisa los datos e inténtalo de nuevo.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - actualizarEstadoById", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(buscarSucursal)});
            return respuesta;
        }

        

        let oSucursal = await sucursalModelo.actualizarEstadoById(entrada.idSucursal, entrada.estado);
        if (!oSucursal.estado) {
            respuesta = oSucursal;
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

async function actualizarAlmacenEstadoById(entrada){
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

        let almacen = await sucursalModelo.actualizarAlmacenEstadoById(entrada.estado, entrada.idSucursalAlmacen);
        if (!almacen.estado) {
            respuesta = almacen;
            return respuesta;
        }

        respuesta = almacen;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - actualizarAlmacenEstadoById', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function sucursalById(entrada){
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
        
        let sucursales = await sucursalModelo.sucursalById(entrada.idSucursal);
        if (!sucursales.estado) {
            respuesta = sucursales;
            return respuesta;
        }
        sucursales["data"] = sucursales["data"][0];
        respuesta = sucursales;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - sucursalById', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaSucursalByEstado(entrada){
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
        
        let sucursales = await sucursalModelo.listaSucursalByEstado(entrada.estado, entrada.idNegocio);
        if (!sucursales.estado) {
            respuesta = sucursales;
            return respuesta;
        }

        respuesta = sucursales;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaSucursalByEstado', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaAlmacenBySucursal(entrada){
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
        
        if(entrada.idUsuario == undefined || entrada.idUsuario == null){
            entrada.idUsuario = entrada.idUsuarioLogin;
        }

        let almacenes = await sucursalModelo.listaAlmacenBySucursal(entrada.idSucursal, entrada.estado);
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
        logger.log({level: 'error', label: filename + ' - listaAlmacenBySucursal', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

//export
module.exports = {
    agregarSucursal,
    agregarSucursalAlmacen,

    actualizarSucursalById,
    actualizarEstadoById,
    actualizarAlmacenEstadoById,

    sucursalById,

    listaSucursalByEstado,
    listaAlmacenBySucursal
}