const logger = require('../logger').logger
const path = require('path');
const filename = path.basename(__filename);
const libFecha = require('../libreria/libFecha');
const { getMessage, getMessageCategory } = require('../messages');
const convertir = require('../libreria/convertir.js');
const usuarioControlador = require('./usuarioControlador');
const productoModelo = require('../modelo/productoModelo');

async function agregarProducto(entrada){
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

        let nuevoProducto = await productoModelo.agregarProducto(entrada.idCategoria, entrada.codigo, entrada.nombre, entrada.descripcion, entrada.precio, entrada.puntos, entrada.idNegocio);
        if (!nuevoProducto.estado) {
            respuesta = nuevoProducto;
            return respuesta;
        }

        respuesta = nuevoProducto;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - agregarProducto', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function actualizarDatosProductodByid(entrada){
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
        
        let producto = await productoModelo.productoById(entrada.idProducto);
        if (!producto.estado) {
            respuesta = producto;
            return respuesta;
        }

        if (producto["data"][0]["estadoUsuario"] == "0") {
            respuesta.codigo = "3";
            respuesta.estado = false;
            respuesta.mensaje = "No se encontró el producto. Verifica los datos e inténtalo nuevamente..";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - actualizarDatosProductodByid", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(producto)});
            return respuesta;
        }

        let oActualizar = await productoModelo.actualizarDatosProductodByid(entrada.codigo, entrada.nombre, entrada.descripcion, entrada.precio, entrada.idCategoria, entrada.idProducto);
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
        logger.log({level: 'error', label: filename + ' - actualizarDatosProductodByid', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function actualizarPrecioPuntosdByid(entrada){
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
        
        let producto = await productoModelo.productoById(entrada.idProducto);
        if (!producto.estado) {
            respuesta = producto;
            return respuesta;
        }

        if (producto["data"][0]["estadoUsuario"] == "0") {
            respuesta.codigo = "3";
            respuesta.estado = false;
            respuesta.mensaje = "No se encontró el producto. Verifica los datos e inténtalo nuevamente..";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - actualizarPrecioPuntosdByid", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(producto)});
            return respuesta;
        }

        let oActualizar = await productoModelo.actualizarPrecioPuntosdByid(entrada.precio, entrada.puntos, entrada.idProducto);
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
        logger.log({level: 'error', label: filename + ' - actualizarDatosProductodByid', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaProductoByEstado(entrada){
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
        
        let productos = await productoModelo.listaProductoByEstado(entrada.estado, entrada.idNegocio);
        if (!productos.estado) {
            respuesta = productos;
            return respuesta;
        }

        for(let i=0; i<productos["data"].length; i++){
            productos["data"][i]["precioFormato"] = convertir.formatoMoneda(productos["data"][i]["precio"]);
            
            productos["data"][i]["codigoLiteral"] = "S/C";
            if(productos["data"][i]["codigo"] != ""){
                productos["data"][i]["codigoLiteral"] = "#" + productos["data"][i]["codigo"];
            }
        }

        respuesta = productos;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaProductoByEstado', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaInventarioProductoByAlmacen(entrada){
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
        
        let productos;
        if(entrada.tipoAlmacen == "almacen"){
            productos = await productoModelo.listaInventarioProductoByAlmacen(entrada.idAlmacen, entrada.estado, entrada.idNegocio);
            if (!productos.estado) {
                respuesta = productos;
                return respuesta;
            }
        }

        if(entrada.tipoAlmacen == "cliente"){
            productos = await productoModelo.listaInventarioProductoByCliente(entrada.idCliente, entrada.estado, entrada.idNegocio);
            if (!productos.estado) {
                respuesta = productos;
                return respuesta;
            }
        }

        if (productos === undefined) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "No se encontro registros del almacén o el cliente seleccionado";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - usuarioLoginByIdLogin", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(usuario)});
            return respuesta;
        }

        let productosNuevos = [];
        let totalPuntos = 0;
        let totalCosto = 0;
        let totalCantidad = 0;
        let idProductoAnt = "";
        for(let i=0;i<productos["data"].length; i++){
            totalPuntos = totalPuntos + (parseInt(productos["data"][i]["puntosProducto"]) * parseInt(productos["data"][i]["cantidad"]));
            totalCosto = totalCosto + (parseFloat(productos["data"][i]["costo"]) * parseInt(productos["data"][i]["cantidad"]));
            totalCantidad = totalCantidad + parseInt(productos["data"][i]["cantidad"]);

            if(productos["data"][i]["idProducto"] == idProductoAnt){
                let cant = parseInt(productos["data"][i]["cantidad"]) + parseInt(productosNuevos[productosNuevos.length-1]["cantidad"])
                productosNuevos[productosNuevos.length-1]["cantidad"] = cant;
            } else {
                productos["data"][i]["codigoLiteral"] = "S/C";
                if(productos["data"][i]["codigoProducto"] != ""){
                    productos["data"][i]["codigoLiteral"] = "#" + productos["data"][i]["codigoProducto"];
                }
                productosNuevos.push({
                    "idProducto": productos["data"][i]["idProducto"],
                    "nombreCategoria": productos["data"][i]["nombreCategoria"],
                    "nombreProducto": productos["data"][i]["nombreProducto"],
                    "codigoProducto": productos["data"][i]["codigoProducto"],
                    "codigoLiteral": productos["data"][i]["codigoLiteral"],
                    "descripcionProducto": productos["data"][i]["descripcionProducto"],
                    "precioProducto": productos["data"][i]["precioProducto"],
                    "precioFormato": convertir.formatoMoneda(productos["data"][i]["precioProducto"]),
                    "puntosProducto": productos["data"][i]["puntosProducto"],
                    "cantidad": productos["data"][i]["cantidad"]
                })

                idProductoAnt = productos["data"][i]["idProducto"]
            }
        }

        let data = {
            "productos": productosNuevos,
            "totalCosto": convertir.formatoMoneda(totalCosto),
            "totalPuntos": totalPuntos,
            "totalCantidad": totalCantidad
        }

        respuesta.data = data;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaInventarioProductoByAlmacen', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaInventarioProductoByAlmacenProducto(entrada){
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
        
        let productos;
        if(entrada.tipoAlmacen == "almacen"){
            productos = await productoModelo.listaInventarioProductoByAlmacenProducto(entrada.idAlmacen, entrada.idProducto, entrada.cantidad, entrada.estado, entrada.idNegocio);
            if (!productos.estado) {
                respuesta = productos;
                return respuesta;
            }
        }

        if(entrada.tipoAlmacen == "cliente"){
            productos = await productoModelo.listaInventarioProductoByClienteProducto(entrada.idCliente, entrada.idProducto, entrada.cantidad, entrada.estado, entrada.idNegocio);
            if (!productos.estado) {
                respuesta = productos;
                return respuesta;
            }
        }

        if (productos === undefined) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "No se encontro registros del almacén o el cliente seleccionado";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - usuarioLoginByIdLogin", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(productos)});
            return respuesta;
        }
        
        let totalCantidad = 0;
        let totalCosto = 0.00;
        let totalPuntos = 0.00;
        for(let i=0; i<productos["data"].length; i++){
            productos["data"][i]["codigoLiteral"] = "S/C";
            if(productos["data"][i]["codigoProducto"] != ""){
                productos["data"][i]["codigoLiteral"] = "#" + productos["data"][i]["codigoProducto"];
            }

            totalCantidad = totalCantidad + parseInt(productos["data"][i]["cantidad"]);
            
            productos["data"][i]["puntosSubTotal"] = parseInt(productos["data"][i]["cantidad"]) * parseInt(productos["data"][i]["puntosProducto"])
            totalPuntos = totalPuntos + parseInt( productos["data"][i]["puntosSubTotal"]);
            
            productos["data"][i]["precioProductoFormato"] = convertir.formatoMoneda(productos["data"][i]["precioProducto"])
            productos["data"][i]["costoFormato"] = convertir.formatoMoneda(productos["data"][i]["costo"])
            productos["data"][i]["costoSubTotal"] = parseInt(productos["data"][i]["cantidad"]) * parseFloat(productos["data"][i]["costo"])
            productos["data"][i]["costoSubTotalFormato"] = convertir.formatoMoneda(productos["data"][i]["costoSubTotal"])
            totalCosto = totalCosto + parseFloat( productos["data"][i]["costoSubTotal"]);
        }

        let data = {
            "productos": productos["data"],
            "totalCantidad": totalCantidad,
            "totalCosto": totalCosto,
            "totalCostoFormato": convertir.formatoMoneda(totalCosto),
            "totalPuntos": totalPuntos
        }

        respuesta.data = data;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaInventarioProductoByAlmacenProducto', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaInventarioProductoByProducto(entrada){
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
        
        let productos = await productoModelo.listaInventarioProductoByProducto(entrada.idProducto, entrada.cantidad, entrada.estado, entrada.idNegocio);
        if (!productos.estado) {
            respuesta = productos;
            return respuesta;
        }

        if (productos === undefined) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "No se encontro registros del producto seleccionado";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - listaInventarioProductoByProducto", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(productos)});
            return respuesta;
        }
        
        let totalCantidad = 0;
        let totalCosto = 0.00;
        let totalPuntos = 0.00;
        for(let i=0; i<productos["data"].length; i++){
            totalCantidad = totalCantidad + parseInt(productos["data"][i]["cantidad"]);
            
            productos["data"][i]["puntosSubTotal"] = parseInt(productos["data"][i]["cantidad"]) * parseInt(productos["data"][i]["puntosProducto"])
            totalPuntos = totalPuntos + parseInt( productos["data"][i]["puntosSubTotal"]);
            
            productos["data"][i]["costoFormato"] = convertir.formatoMoneda(productos["data"][i]["costo"])
            productos["data"][i]["costoSubTotal"] = parseInt(productos["data"][i]["cantidad"]) * parseFloat(productos["data"][i]["costo"])
            productos["data"][i]["costoSubTotalFormato"] = convertir.formatoMoneda(productos["data"][i]["costoSubTotal"])
            totalCosto = totalCosto + parseFloat( productos["data"][i]["costoSubTotal"]);
        }

        let data = {
            "productos": productos["data"],
            "totalCantidad": totalCantidad,
            "totalCosto": totalCosto,
            "totalCostoFormato": convertir.formatoMoneda(totalCosto),
            "totalPuntos": totalPuntos
        }

        respuesta.data = data;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaInventarioProductoByProducto', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaInventarioHistorialByInventario(entrada){
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
        
        let historial = await productoModelo.listaInventarioHistorialByInventario(entrada.idInventario, entrada.estado);
        if (!historial.estado) {
            respuesta = historial;
            return respuesta;
        }

        for(let i=0; i<historial["data"].length; i++){
            historial["data"][i]["tipoLiteral"] = "Salida";
            if(historial["data"][i]["tipo"] == "1"){
                historial["data"][i]["tipoLiteral"] = "Entrada";
            }
        }

        respuesta.data = historial["data"];

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaInventarioHistorialByInventario', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaInventarioHistorialByAlmacenProducto(entrada){
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
        
        let historial;
        if(entrada.tipoAlmacen == "almacen"){
            historial = await productoModelo.listaInventarioHistorialByAlmacenProducto(entrada.idAlmacen, entrada.idProducto, entrada.estado);
            if (!historial.estado) {
                respuesta = historial;
                return respuesta;
            }
        }

        if(entrada.tipoAlmacen == "cliente"){
            historial = await productoModelo.listaInventarioHistorialByClienteProducto(entrada.idCliente, entrada.idProducto, entrada.estado);
            if (!historial.estado) {
                respuesta = historial;
                return respuesta;
            }
        }

        if (historial === undefined) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "No se encontro registros del almacén o el cliente seleccionado";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - usuarioLoginByIdLogin", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(usuario)});
            return respuesta;
        }

        for(let i=0; i<historial["data"].length; i++){
            historial["data"][i]["tipoLiteral"] = "Salida";
            if(historial["data"][i]["tipo"] == "1"){
                historial["data"][i]["tipoLiteral"] = "Entrada";
            }
        }

        respuesta.data = historial["data"];

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaInventarioHistorialByAlmacenProducto', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

//export
module.exports = {
    agregarProducto,

    actualizarDatosProductodByid,
    actualizarPrecioPuntosdByid,

    listaProductoByEstado,
    listaInventarioProductoByAlmacen,
    listaInventarioProductoByAlmacenProducto,
    listaInventarioProductoByProducto,
    listaInventarioHistorialByInventario,
    listaInventarioHistorialByAlmacenProducto
}