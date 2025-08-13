const logger = require('../logger').logger
const path = require('path');
const filename = path.basename(__filename);
const libFecha = require('../libreria/libFecha');
const { getMessage, getMessageCategory } = require('../messages');
const usuarioModelo = require('../modelo/usuarioModelo');
const negocioModelo = require('../modelo/negocioModelo');

async function agregarUsuario(entrada){
    let data = [];
    let codigo = getMessageCategory("proceso", "nivelControlador", "correcto", "codigo");
    let estado = true;
    let mensaje = getMessageCategory("proceso", "nivelControlador", "correcto", "mensaje");
    let respuesta = {data, codigo, estado, mensaje}

    try{
        const {fecha , hora} = await libFecha.fechaHoraActualyymmdd();

        entrada.avanzado = true;
        let oLogin = await usuarioLoginByIdLogin(entrada);
        if (!oLogin.estado) {
            respuesta = oLogin;
            return respuesta;
        }

        entrada.idNegocio = oLogin["data"]["usuario"]["idNegocio"];
        entrada.idUsuarioLogin = oLogin["data"]["usuario"]["idUsuario"];

        let oCi = await usuarioModelo.usuarioByCi(entrada.ci, entrada.idNegocio);
        if (!oCi.estado) {
            respuesta = oCi;
            return respuesta;
        }

        if (oCi["data"].length > 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "Ya existe un usuario con el C.I. registrado, verifique e intente nuevamente.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - agregarUsuario", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(oCi)});
            return respuesta;
        }

        let oUsuario = await usuarioModelo.usuarioByUsuario(entrada.usuario, entrada.idNegocio);
        if (!oUsuario.estado) {
            respuesta = oUsuario;
            return respuesta;
        }

        if (oUsuario["data"].length > 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "Ya existe un usuario con el USUARIO registrado, verifique e intente nuevamente.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - agregarUsuario", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(oUsuario)});
            return respuesta;
        }

        let oAgregar = await usuarioModelo.agregarUsuario(entrada.idRol, entrada.ci, entrada.complemento, entrada.nombre, entrada.appat, entrada.apmat, entrada.fechaNacimiento, entrada.genero, entrada.celular, entrada.email, entrada.usuario, entrada.password, entrada.idNegocio);
        if (!oAgregar.estado) {
            respuesta = oAgregar;
            return respuesta;
        }

        respuesta.data = {
            "idUsuario": oAgregar["data"]["idUsuario"]
        }

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - agregarUsuario', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function agregarUsuarioSucursal(entrada){
    let data = [];
    let codigo = getMessageCategory("proceso", "nivelControlador", "correcto", "codigo");
    let estado = true;
    let mensaje = getMessageCategory("proceso", "nivelControlador", "correcto", "mensaje");
    let respuesta = {data, codigo, estado, mensaje}

    try{
        const {fecha , hora} = await libFecha.fechaHoraActualyymmdd();

        entrada.avanzado = true;
        let oLogin = await usuarioLoginByIdLogin(entrada);
        if (!oLogin.estado) {
            respuesta = oLogin;
            return respuesta;
        }

        entrada.idNegocio = oLogin["data"]["usuario"]["idNegocio"];
        entrada.idUsuarioLogin = oLogin["data"]["usuario"]["idUsuario"];

        let oUsuario = await usuarioModelo.usuarioSucursalByUsuarioSucursal(entrada.idUsuario, entrada.idSucursal, "1");
        if (!oUsuario.estado) {
            respuesta = oUsuario;
            return respuesta;
        }

        if (oUsuario["data"].length > 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "Ya existe el usuario asignado a la sucursal, verifique e intente nuevamente.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - agregarUsuario", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(oUsuario)});
            return respuesta;
        }

        let oAgregar = await usuarioModelo.agregarUsuarioSucursal(entrada.idUsuario, entrada.idSucursal, fecha, hora, entrada.idNegocio);
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
        logger.log({level: 'error', label: filename + ' - agregarUsuarioSucursal', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}


async function actualizarUsuarioById(entrada){
    let data = [];
    let codigo = getMessageCategory("proceso", "nivelControlador", "correcto", "codigo");
    let estado = true;
    let mensaje = getMessageCategory("proceso", "nivelControlador", "correcto", "mensaje");
    let respuesta = {data, codigo, estado, mensaje}

    try{
        const {fecha , hora} = await libFecha.fechaHoraActualyymmdd();

        entrada.avanzado = true;
        let oLogin = await usuarioLoginByIdLogin(entrada);
        if (!oLogin.estado) {
            respuesta = oLogin;
            return respuesta;
        }

        entrada.idNegocio = oLogin["data"]["usuario"]["idNegocio"];
        entrada.idUsuarioLogin = oLogin["data"]["usuario"]["idUsuario"];
        
        let oUsuario = await usuarioModelo.usuarioById(entrada.idUsuario);
        if (!oUsuario.estado) {
            respuesta = oUsuario;
            return respuesta;
        }

        if (oUsuario["data"].length == 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "No existe el usuario el que se busca, verifique e intente nuevamente.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - agregarUsuario", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(oUsuario)});
            return respuesta;
        }

        let oCi = await usuarioModelo.usuarioByCi(entrada.ci, entrada.idNegocio);
        if (!oCi.estado) {
            respuesta = oCi;
            return respuesta;
        }

        if(oUsuario["data"][0]["ci"] != entrada.ci){
            if (oCi["data"].length > 0) {
                respuesta.codigo = "2";
                respuesta.estado = false;
                respuesta.mensaje = "Ya existe un usuario con el C.I. registrado, verifique e intente nuevamente.";
                respuesta.data = [];
                logger.log({level: "info", label: filename + " - agregarUsuario", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(oCi)});
                return respuesta;
            }
        }

        let usuario = await usuarioModelo.actualizarUsuarioById(entrada.ci, entrada.complemento, entrada.nombre, entrada.appat, entrada.apmat, entrada.fechaNacimiento, entrada.genero, entrada.celular, entrada.email, entrada.idUsuario);
        if (!usuario.estado) {
            respuesta = usuario;
            return respuesta;
        }

        respuesta = usuario;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - actualizarUsuarioById', message: JSON.stringify(respuesta)});
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
        let oLogin = await usuarioLoginByIdLogin(entrada);
        if (!oLogin.estado) {
            respuesta = oLogin;
            return respuesta;
        }

        entrada.idNegocio = oLogin["data"]["usuario"]["idNegocio"];
        entrada.idUsuarioLogin = oLogin["data"]["usuario"]["idUsuario"];

        let oUsuario = await usuarioModelo.usuarioById(entrada.idUsuario);
        if (!oUsuario.estado) {
            respuesta = oUsuario;
            return respuesta;
        }

        if (oUsuario["data"].length == 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "No existe el usuario el que se busca, verifique e intente nuevamente.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - actualizarEstadoById", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(oUsuario)});
            return respuesta;
        }

        let usuario = await usuarioModelo.actualizarEstadoById(entrada.estado, entrada.idUsuario);
        if (!usuario.estado) {
            respuesta = usuario;
            return respuesta;
        }

        respuesta = usuario;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - actualizarUsuarioById', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function actualizarSucursalEstadoById(entrada){
    let data = [];
    let codigo = getMessageCategory("proceso", "nivelControlador", "correcto", "codigo");
    let estado = true;
    let mensaje = getMessageCategory("proceso", "nivelControlador", "correcto", "mensaje");
    let respuesta = {data, codigo, estado, mensaje}

    try{
        const {fecha , hora} = await libFecha.fechaHoraActualyymmdd();

        entrada.avanzado = true;
        let oLogin = await usuarioLoginByIdLogin(entrada);
        if (!oLogin.estado) {
            respuesta = oLogin;
            return respuesta;
        }

        entrada.idNegocio = oLogin["data"]["usuario"]["idNegocio"];
        entrada.idUsuarioLogin = oLogin["data"]["usuario"]["idUsuario"];

        let usuario = await usuarioModelo.actualizarSucursalEstadoById(entrada.estado, entrada.idUsuarioSucursal);
        if (!usuario.estado) {
            respuesta = usuario;
            return respuesta;
        }

        respuesta = usuario;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - actualizarSucursalEstadoById', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function actualizarPasswordById(entrada){
    let data = [];
    let codigo = getMessageCategory("proceso", "nivelControlador", "correcto", "codigo");
    let estado = true;
    let mensaje = getMessageCategory("proceso", "nivelControlador", "correcto", "mensaje");
    let respuesta = {data, codigo, estado, mensaje}

    try{
        const {fecha , hora} = await libFecha.fechaHoraActualyymmdd();

        entrada.avanzado = true;
        let oLogin = await usuarioLoginByIdLogin(entrada);
        if (!oLogin.estado) {
            respuesta = oLogin;
            return respuesta;
        }

        entrada.idNegocio = oLogin["data"]["usuario"]["idNegocio"];
        entrada.idUsuarioLogin = oLogin["data"]["usuario"]["idUsuario"];

        let oUsuario = await usuarioModelo.usuarioById(entrada.idUsuario);
        if (!oUsuario.estado) {
            respuesta = oUsuario;
            return respuesta;
        }

        if (oUsuario["data"].length == 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "No existe el usuario el que se busca, verifique e intente nuevamente.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - actualizarPasswordById", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(oUsuario)});
            return respuesta;
        }

        
        
        if (oUsuario["data"][0]["password"] != entrada.password) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "La contraseña actual no es la misma que ingreso, verifique e intente nuevamente.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - actualizarPasswordById", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(oUsuario)});
            return respuesta;
        }

        let usuario = await usuarioModelo.actualizarPasswordById(entrada.passwordNuevo, entrada.idUsuario);
        if (!usuario.estado) {
            respuesta = usuario;
            return respuesta;
        }

        respuesta = usuario;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - actualizarUsuarioById', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function actualizarUsuarioLoginById(entrada){
    let data = [];
    let codigo = getMessageCategory("proceso", "nivelControlador", "correcto", "codigo");
    let estado = true;
    let mensaje = getMessageCategory("proceso", "nivelControlador", "correcto", "mensaje");
    let respuesta = {data, codigo, estado, mensaje}

    try{
        const {fecha , hora} = await libFecha.fechaHoraActualyymmdd();

        entrada.avanzado = true;
        let oLogin = await usuarioLoginByIdLogin(entrada);
        if (!oLogin.estado) {
            respuesta = oLogin;
            return respuesta;
        }

        entrada.idNegocio = oLogin["data"]["usuario"]["idNegocio"];
        entrada.idUsuarioLogin = oLogin["data"]["usuario"]["idUsuario"];

        let oUsuario = await usuarioModelo.usuarioById(entrada.idUsuario);
        if (!oUsuario.estado) {
            respuesta = oUsuario;
            return respuesta;
        }

        if (oUsuario["data"].length > 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "No existe el usuario el que se busca, verifique e intente nuevamente.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - actualizarUsuarioLoginById", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(oUsuario)});
            return respuesta;
        }

        let oUser = await usuarioModelo.usuarioByUsuario(entrada.usuario, entrada.idNegocio);
        if (!oUser.estado) {
            respuesta = oUser;
            return respuesta;
        }

        if (oUser["data"].length > 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "Ya existe un usuario con el USUARIO registrado, verifique e intente nuevamente.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - actualizarUsuarioLoginById", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(oUsuario)});
            return respuesta;
        }

        let usuario = await usuarioModelo.actualizarUsuarioLoginById(entrada.usuario, entrada.idUsuario);
        if (!usuario.estado) {
            respuesta = usuario;
            return respuesta;
        }

        respuesta = usuario;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - actualizarUsuarioById', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function usuarioByUsuarioPassword(entrada){
    let data = [];
    let codigo = getMessageCategory("proceso", "nivelControlador", "correcto", "codigo");
    let estado = true;
    let mensaje = getMessageCategory("proceso", "nivelControlador", "correcto", "mensaje");
    let respuesta = {data, codigo, estado, mensaje}

    try{
        const {fecha , hora} = await libFecha.fechaHoraActualyymmdd();

        let usuario = await usuarioModelo.usuarioByUsuarioPassword(entrada.usuario, entrada.password);
        if (!usuario.estado) {
            respuesta = usuario;
            return respuesta;
        }

        if (usuario["data"].length == 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "Usuario o contraseña incorrectos. Verifica e inténtalo de nuevo.";
            respuesta.data = [];
            let oSeguimiento = await usuarioModelo.agregarLoginFallidoUsuario(entrada.usuario, entrada.password, fecha, hora);
            logger.log({level: "info", label: filename + " - usuarioByUsuarioPass", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(usuario)});
            return respuesta;
        }

        if (usuario["data"][0]["estadoUsuario"] == "0") {
            respuesta.codigo = "2";
            respuesta.estado = false;
            respuesta.mensaje = "Tu usuario no está habilitado. Por favor, contacta al administrador del sistema.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - usuarioByUsuarioPass", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(usuario)});
            return respuesta;
        }

        if (usuario["data"][0]["estadoNegocio"] == "0") {
            respuesta.codigo = "3";
            respuesta.estado = false;
            respuesta.mensaje = "El negocio no está habilitado. Por favor, contacta al administrador del sistema.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - usuarioByUsuarioPass", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(usuario)});
            return respuesta;
        }

        let login = await usuarioModelo.agregarLoginUsuario(usuario["data"][0]["idUsuario"], entrada.dispositivo, "Inicio sessión", fecha, hora);
        if (!login.estado) {
            return resolve(login);
        }
        
        respuesta.data = {
            "idLogin": login["data"]["idLogin"] + "",
            "idRol": usuario["data"][0]["idRol"]
        };
        
        let oSeguimiento = await usuarioModelo.agregarSeguimientoUsuario(usuario["data"][0]["idUsuario"], entrada.dispositivo, "ingresoUsuarioPass", "{}", fecha, hora);

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - usuarioByUsuarioPass', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function usuarioLoginByIdLogin(entrada){
    let data = [];
    let codigo = getMessageCategory("proceso", "nivelControlador", "correcto", "codigo");
    let estado = true;
    let mensaje = getMessageCategory("proceso", "nivelControlador", "correcto", "mensaje");
    let respuesta = {data, codigo, estado, mensaje}

    try{
        const {fecha , hora} = await libFecha.fechaHoraActualyymmdd();

        let usuario = await usuarioModelo.usuarioLoginByIdLogin(entrada.idLogin);
        if (!usuario.estado) {
            respuesta = usuario;
            return respuesta;
        }

        if (usuario["data"].length == 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "No se encontró el usuario (sesión activa). Verifica los datos e inténtalo nuevamente.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - usuarioLoginByIdLogin", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(usuario)});
            return respuesta;
        }

        if (usuario["data"][0]["estadoLogin"] == "0") {
            respuesta.codigo = "2";
            respuesta.estado = false;
            respuesta.mensaje = "Tu sesión ha finalizado. Por favor, inicia sesión nuevamente.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - usuarioLoginByIdLogin", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(usuario)});
            return respuesta;
        }

        if (usuario["data"][0]["estadoUsuario"] == "0") {
            respuesta.codigo = "3";
            respuesta.estado = false;
            respuesta.mensaje = "Tu usuario no está habilitado. Por favor, contacta al administrador del sistema.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - usuarioLoginByIdLogin", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(usuario)});
            return respuesta;
        }

        if (usuario["data"][0]["estadoNegocio"] == "0") {
            respuesta.codigo = "4";
            respuesta.estado = false;
            respuesta.mensaje = "Tu negocio no está habilitado. Por favor, contacta al administrador del sistema.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - usuarioLoginByIdLogin", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(usuario)});
            return respuesta;
        }

        let negocio = await negocioModelo.negocioBasicoById(usuario["data"][0]["idNegocio"]);
        if (!negocio.estado) {
            respuesta = negocio;
            return respuesta;
        }
        

        usuario["data"][0]["idLogin"] = entrada.idLogin + "";
        respuesta.data = {
            usuario: {
                "apmatUsuario": usuario["data"][0]["apmatUsuario"],
                "appatUsuario": usuario["data"][0]["appatUsuario"],
                "nombreUsuario": usuario["data"][0]["nombreUsuario"],
                "estadoLogin": usuario["data"][0]["estadoLogin"],
                "estadoUsuario": usuario["data"][0]["estadoUsuario"],
                "celularUsuario": usuario["data"][0]["celularUsuario"],
                "imagenUsuario": usuario["data"][0]["imagenUsuario"],
                "idRolUsuario": usuario["data"][0]["idRol"]
            },
            negocio: {
                "nombre": negocio["data"][0]["nombre"],
                "imagenNegocio": negocio["data"][0]["imagenNegocio"],
                "noestadoNegociombre": negocio["data"][0]["estadoNegocio"]
            },
            idLogin: entrada.idLogin,
            modulos: {}
        };

        if(entrada.avanzado == true){
            respuesta.data = {
                usuario: usuario["data"][0],
                negocio: negocio["data"][0],
                modulos: {}
            };
        }
        
        let oSeguimiento = await usuarioModelo.agregarSeguimientoUsuario(usuario["data"][0]["idUsuario"], entrada.dispositivo, "ingresoLoginActivo", "{}", fecha, hora);

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - usuarioLoginByIdLogin', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaUsuariosByEstado(entrada){
    let data = [];
    let codigo = getMessageCategory("proceso", "nivelControlador", "correcto", "codigo");
    let estado = true;
    let mensaje = getMessageCategory("proceso", "nivelControlador", "correcto", "mensaje");
    let respuesta = {data, codigo, estado, mensaje}

    try{
        const {fecha , hora} = await libFecha.fechaHoraActualyymmdd();

        entrada.avanzado = true;
        let oLogin = await usuarioLoginByIdLogin(entrada);
        if (!oLogin.estado) {
            respuesta = oLogin;
            return respuesta;
        }

        entrada.idNegocio = oLogin["data"]["usuario"]["idNegocio"];
        entrada.idUsuarioLogin = oLogin["data"]["usuario"]["idUsuario"];
        
        let usuarios = await usuarioModelo.listaUsuariosByEstado(entrada.idNegocio, entrada.estado);
        if (!usuarios.estado) {
            respuesta = usuarios;
            return respuesta;
        }

        respuesta = usuarios;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaUsuariosByEstado', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaSucursalByUsuario(entrada){
    let data = [];
    let codigo = getMessageCategory("proceso", "nivelControlador", "correcto", "codigo");
    let estado = true;
    let mensaje = getMessageCategory("proceso", "nivelControlador", "correcto", "mensaje");
    let respuesta = {data, codigo, estado, mensaje}

    try{
        const {fecha , hora} = await libFecha.fechaHoraActualyymmdd();

        entrada.avanzado = true;
        let oLogin = await usuarioLoginByIdLogin(entrada);
        if (!oLogin.estado) {
            respuesta = oLogin;
            return respuesta;
        }

        entrada.idNegocio = oLogin["data"]["usuario"]["idNegocio"];
        entrada.idUsuarioLogin = oLogin["data"]["usuario"]["idUsuario"];
        
        if(entrada.idUsuario == undefined || entrada.idUsuario == null){
            entrada.idUsuario = entrada.idUsuarioLogin;
        }

        let sucursales = await usuarioModelo.listaSucursalByUsuario(entrada.idUsuario, entrada.estado);
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
        logger.log({level: 'error', label: filename + ' - listaSucursalByUsuario', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

//export
module.exports = {
    agregarUsuario,
    agregarUsuarioSucursal,

    actualizarUsuarioById,
    actualizarSucursalEstadoById,
    actualizarEstadoById,
    actualizarPasswordById,
    actualizarUsuarioLoginById,

    usuarioByUsuarioPassword,
    usuarioLoginByIdLogin,
    
    listaUsuariosByEstado,
    listaSucursalByUsuario
}