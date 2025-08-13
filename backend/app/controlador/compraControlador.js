const logger = require('../logger').logger
const path = require('path');
const filename = path.basename(__filename);
const libFecha = require('../libreria/libFecha');
const { getMessage, getMessageCategory } = require('../messages');
const convertir = require('../libreria/convertir.js');
const usuarioControlador = require('./usuarioControlador');
const compraModelo = require('../modelo/compraModelo');
const cuentaModelo = require('../modelo/cuentaModelo');
const productoModelo = require('../modelo/productoModelo');
const cuentaControlador = require('./cuentaControlador');

async function agregarCompra(entrada){
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

        let oCuentaSaldo = await cuentaModelo.cuentaById(entrada.idCuenta);
        if (!oCuentaSaldo.estado) {
            respuesta = oCuentaSaldo;
            return respuesta;
        }

        if (parseFloat(entrada.total) > parseFloat(oCuentaSaldo["data"][0]["saldo"])) {
            respuesta.codigo = "2";
            respuesta.estado = false;
            respuesta.mensaje ="La cuenta no tiene saldo suficiente para realizar la operacion. verifique e intente nuevamente";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - agregarCuentaHistorial", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(oCuentaSaldo)});
            return respuesta;
        }

        let productos = entrada.productos;

        let nuevaCompra = await compraModelo.agregarCompra(entrada.idUsuario, entrada.idAlmacen, entrada.idCuenta, fecha, hora, entrada.total, entrada.descuento, entrada.costoTotal, entrada.observacion, entrada.credito, "0", entrada.idNegocio);
        if (!nuevaCompra.estado) {
            respuesta = nuevaCompra;
            return respuesta;
        }

        let idCompra = nuevaCompra["data"]["idCompra"]

        for(let i=0; i<productos.length; i++){
            if(productos[i]["fechaVencimiento"] == ""){
                productos[i]["fechaVencimiento"] = "2000-01-01"
            }

            let idInventario = "";
            let oInventario = await productoModelo.inventarioProductoByProductoAlmacenFecVenCosto(productos[i]["idProducto"], entrada.idAlmacen, productos[i]["fechaVencimiento"], productos[i]["costo"], "1", entrada.idNegocio);
            if (!oInventario.estado) {
                respuesta = oInventario;
                return respuesta;
            }

            if(oInventario["data"].length == 0){
                let oAgregarInventario = await productoModelo.agregarInventarioProducto(productos[i]["idProducto"], entrada.idAlmacen, "1", productos[i]["fechaVencimiento"], productos[i]["cantidad"], "", productos[i]["costo"], entrada.idNegocio);
                if (!oAgregarInventario.estado) {
                    respuesta = oAgregarInventario;
                    return respuesta;
                }
                idInventario = oAgregarInventario["data"]["idInventarioProducto"];

            } else {
                idInventario = oInventario["data"][0]["idInventarioProducto"];
                let nuevaCant = parseInt(oInventario["data"][0]["cantidad"]) + parseInt( productos[i]["cantidad"]);

                let oActualizarInventario = await productoModelo.actualizaCantidadByid(nuevaCant, "", idInventario);
                if (!oActualizarInventario.estado) {
                    respuesta = oActualizarInventario;
                    return respuesta;
                }
            }

            let oDetalle = await compraModelo.agregarCompraDetalle(idCompra, idInventario, productos[i]["cantidad"], "", productos[i]["costo"], productos[i]["subTotal"]);
            if (!oDetalle.estado) {
                respuesta = oDetalle;
                return respuesta;
            }

            let mensaje = `Compra Nro: ${idCompra} - Registro de ingreso de producto`
            let oHistorial = await productoModelo.agregarInventarioProductoHistorial(entrada.idUsuario, idInventario, "1", productos[i]["cantidad"], "", mensaje, "", fecha, hora);
            if (!oHistorial.estado) {
                respuesta = oHistorial;
                return respuesta;
            }
        }

        let entradaCuenta = {
            "idLogin": entrada.idLogin,
            "dispositivo": entrada.dispositivo,
            "idCuenta": entrada.idCuenta,
            "tipo": "0",
            "monto": entrada.costoTotal,
            "descripcion": `Compra - Nro. de Compra: ${idCompra}`,
        };
        let oCuenta = await cuentaControlador.agregarCuentaHistorial(entradaCuenta);
        if (!oCuenta.estado) {
            respuesta = oCuenta;
            return respuesta;
        }

        respuesta = nuevaCompra;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - agregarCompra', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaCompraByEstado(entrada){
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
        
        let total = 0;
        let compras = await compraModelo.listaCompraByEstado(entrada.estado, entrada.idNegocio);
        if (!compras.estado) {
            respuesta = compras;
            return respuesta;
        }

        for(let i=0; i<compras["data"].length; i++){
            compras["data"][i]["totalFormato"] = convertir.formatoMoneda(compras["data"][i]["total"]);
            total = total + parseFloat(compras["data"][i]["total"]);
        }

        let data = {
            "compras": compras.data,
            "total": total,
            "totalFormato": convertir.formatoMoneda(total)
        }
        respuesta.data = data;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaCompraByEstado', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaCompraDetalleByIdCompra(entrada){
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
        
        let total = 0;
        let totalPuntos = 0;
        let detalles = await compraModelo.listaCompraDetalleByIdCompra(entrada.idCompra, entrada.estado);
        if (!detalles.estado) {
            respuesta = detalles;
            return respuesta;
        }

        for(let i=0; i<detalles["data"].length; i++){
            detalles["data"][i]["costoFormato"] = convertir.formatoMoneda(detalles["data"][i]["costo"]);
            detalles["data"][i]["subTotalFormato"] = convertir.formatoMoneda(detalles["data"][i]["subTotal"]);
            let puntosSubTotal = parseInt(detalles["data"][i]["cantidad"]) * parseInt(detalles["data"][i]["puntos"])
            detalles["data"][i]["puntosSubTotal"] = puntosSubTotal;
            totalPuntos = totalPuntos + puntosSubTotal;

            total = total + parseFloat(detalles["data"][i]["subTotal"]);
            
            detalles["data"][i]["codigoLiteral"] = "S/C";
            if(detalles["data"][i]["codigo"] != ""){
                detalles["data"][i]["codigoLiteral"] = "#" + detalles["data"][i]["codigo"];
            }
        }

        let data = {
            "detalles": detalles.data,
            "totalPuntos": totalPuntos,
            "total": total,
            "totalFormato": convertir.formatoMoneda(total)
        }
        respuesta.data = data;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaCompraDetalleByIdCompra', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaCompraProductoHistorialByProducto(entrada){
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
        
        let total = 0;
        let totalPuntos = 0;
        let detalles = await compraModelo.listaCompraProductoHistorialByProducto(entrada.idProducto, entrada.estado);
        if (!detalles.estado) {
            respuesta = detalles;
            return respuesta;
        }

        for(let i=0; i<detalles["data"].length; i++){
            detalles["data"][i]["costoFormato"] = convertir.formatoMoneda(detalles["data"][i]["costo"]);
            detalles["data"][i]["subTotalFormato"] = convertir.formatoMoneda(detalles["data"][i]["subTotal"]);
            let puntosSubTotal = parseInt(detalles["data"][i]["cantidad"]) * parseInt(detalles["data"][i]["puntos"])
            detalles["data"][i]["puntosSubTotal"] = puntosSubTotal;
            totalPuntos = totalPuntos + puntosSubTotal;

            total = total + parseFloat(detalles["data"][i]["subTotal"]);
        }

        let data = {
            "detalles": detalles.data,
            "totalPuntos": totalPuntos,
            "total": total,
            "totalFormato": convertir.formatoMoneda(total)
        }
        respuesta.data = data;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaCompraProductoHistorialByProducto', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

//export
module.exports = {
    agregarCompra,

    listaCompraByEstado,
    listaCompraDetalleByIdCompra,
    listaCompraProductoHistorialByProducto
}