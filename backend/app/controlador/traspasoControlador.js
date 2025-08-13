const logger = require('../logger').logger
const path = require('path');
const filename = path.basename(__filename);
const libFecha = require('../libreria/libFecha');
const { getMessage, getMessageCategory } = require('../messages');
const convertir = require('../libreria/convertir.js');
const usuarioControlador = require('./usuarioControlador');
const almacenModelo = require('../modelo/almacenModelo');
const clienteModelo = require('../modelo/clienteModelo');
const traspasoModelo = require('../modelo/traspasoModelo');
const productoModelo = require('../modelo/productoModelo');
const cuentaControlador = require('./cuentaControlador');

const reporte = require('../reporte/componentes.js');
const traspasoDetalleReporte = require('../reporte/traspasoDetalleReporte.js');


async function agregarTraspaso(entrada){
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

        let productos = entrada.productos;
    
        let nombreOrigen = "";
        let nombreDestino = "";
        if(entrada.idAlmacenOrigen != "1"){
            let almacenOrigen = await almacenModelo.almacenById(entrada.idAlmacenOrigen);
            if (!almacenOrigen.estado) {
                respuesta = almacenOrigen;
                return respuesta;
            }
            nombreOrigen = almacenOrigen["data"][0]["nombreAlmacen"]
        }

        if(entrada.idAlmacenDestino != "1"){
            let almacenDestino = await almacenModelo.almacenById(entrada.idAlmacenDestino);
            if (!almacenDestino.estado) {
                respuesta = almacenDestino;
                return respuesta;
            }
            nombreDestino = almacenDestino["data"][0]["nombreAlmacen"]
        }

        if(entrada.idClienteOrigen != "1"){
            let clienteOrigen = await clienteModelo.clienteById(entrada.idClienteOrigen);
            if (!clienteOrigen.estado) {
                respuesta = clienteOrigen;
                return respuesta;
            }
            nombreOrigen = clienteOrigen["data"][0]["cliente"]
        }

        if(entrada.idClienteDestino != "1"){
            let clienteDestino = await clienteModelo.clienteById(entrada.idClienteDestino);
            if (!clienteDestino.estado) {
                respuesta = clienteDestino;
                return respuesta;
            }
            nombreDestino = clienteDestino["data"][0]["cliente"]
        }

        if(entrada.idAlmacenDestino == "1" && entrada.idClienteDestino == "1"){
            nombreDestino = "Sin destino";
        }

        let nuevoTraspaso = await traspasoModelo.agregarTraspaso(entrada.idUsuario, entrada.idAlmacenOrigen, entrada.idAlmacenDestino, entrada.idClienteOrigen, entrada.idClienteDestino, fecha, hora, entrada.total, entrada.detalle, entrada.pagado, entrada.idNegocio, "0", "1");
        if (!nuevoTraspaso.estado) {
            respuesta = nuevoTraspaso;
            return respuesta;
        }

        let idTraspaso = nuevoTraspaso["data"]["idTraspaso"];

        for(let i=0; i<productos.length; i++){
            let oInventario = await productoModelo.inventarioProductoById(productos[i]["idInventarioProducto"]);
            if (!oInventario.estado) {
                respuesta = oInventario;
                return respuesta;
            }

            let cantNecesaria = parseInt(productos[i]["cantidad"]);
            let nuevaCantidadInventario = parseInt(oInventario["data"][0]["cantidad"]) - parseInt(cantNecesaria);
                
            let oActualiza = await productoModelo.actualizaCantidadByid(nuevaCantidadInventario, "", oInventario["data"][0]["idInventarioProducto"]);
            if (!oActualiza.estado) {
                respuesta = oActualiza;
                return respuesta;
            }

            let detalle = "Traspaso - Destino: " + nombreDestino + ". Traspaso Nro.: " + idTraspaso;
            let oHistorial = await productoModelo.agregarInventarioProductoHistorial(entrada.idUsuario, oInventario["data"][0]["idInventarioProducto"], "0", cantNecesaria, "", detalle, "", fecha, hora);
            if (!oHistorial.estado) {
                respuesta = oHistorial;
                return respuesta;
            }

            let idInventarioDestino = "";
            let oInventarioEntrada = await productoModelo.inventarioProductoByProductoAlmacenFecVenCosto(oInventario["data"][0]["idProducto"], entrada.idAlmacenDestino, convertir.fechaDDmmyyyyAYYYYmmdd(oInventario["data"][0]["fechaVencimiento"]), oInventario["data"][0]["costo"], "1", entrada.idNegocio);
            if (!oInventarioEntrada.estado) {
                respuesta = oInventarioEntrada;
                return respuesta;
            }

            if(oInventarioEntrada["data"].length == 0){
                let oAgregarInventario = await productoModelo.agregarInventarioProducto(oInventario["data"][0]["idProducto"], entrada.idAlmacenDestino, "1", convertir.fechaDDmmyyyyAYYYYmmdd(oInventario["data"][0]["fechaVencimiento"]), cantNecesaria, "", oInventario["data"][0]["costo"], entrada.idNegocio);
                if (!oAgregarInventario.estado) {
                    respuesta = oAgregarInventario;
                    return respuesta;
                }
                idInventarioDestino = oAgregarInventario["data"]["idInventarioProducto"];

            } else {
                idInventarioDestino = oInventarioEntrada["data"][0]["idInventarioProducto"];
                let nuevaCant = parseInt(oInventarioEntrada["data"][0]["cantidad"]) + parseInt(cantNecesaria);

                let oActualizarInventario = await productoModelo.actualizaCantidadByid(nuevaCant, "", idInventarioDestino);
                if (!oActualizarInventario.estado) {
                    respuesta = oActualizarInventario;
                    return respuesta;
                }
            }

            detalle = "Trapaso - Origen: " + nombreOrigen + ". Traspaso Nro.: " + idTraspaso;
            let oHistorialEntrada = await productoModelo.agregarInventarioProductoHistorial(entrada.idUsuario, idInventarioDestino, "1", cantNecesaria, "", detalle, "", fecha, hora);
            if (!oHistorialEntrada.estado) {
                respuesta = oHistorialEntrada;
                return respuesta;
            }

            let subtotal = cantNecesaria * parseFloat(productos[i]["precio"]);
            let oDetalle = await traspasoModelo.agregarTraspasoDetalle(idTraspaso, oInventario["data"][0]["idInventarioProducto"], "", cantNecesaria, "", oInventario["data"][0]["puntosProducto"], productos[i]["precio"], subtotal);
            if (!oDetalle.estado) {
                respuesta = oDetalle;
                return respuesta;
            }
        }

        respuesta = nuevoTraspaso;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - agregarTraspaso', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function traspasoById(entrada){
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
        
        let tipoOrigen = "";
        let tipoDestino = "";
        let traspaso = await traspasoModelo.traspasoById(entrada.idTraspaso, entrada.estado);
        if (!traspaso.estado) {
            respuesta = traspaso;
            return respuesta;
        }

        if (traspaso["data"].length == 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "No se encontró el traspaso. Verifica los datos e inténtalo nuevamente.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - traspasoById", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(traspaso)});
            return respuesta;
        }

        if(traspaso["data"][0]["idAlmacenOrigen"] != "1"){
            tipoOrigen = "Almacén"
            if(traspaso["data"][0]["idAlmacenDestino"] != "1"){
                tipoDestino = "Almacén"
            }
            if(traspaso["data"][0]["idClienteDestino"] != "1"){
                tipoDestino = "Cliente"
            }
        }

        if(traspaso["data"][0]["idClienteOrigen"] != "1"){
            tipoOrigen = "Cliente"
            if(traspaso["data"][0]["idAlmacenDestino"] != "1"){
                tipoDestino = "Almacén"
            }
            if(traspaso["data"][0]["idClienteDestino"] != "1"){
                tipoDestino = "Cliente"
            }
        }
        traspaso["data"][0]["tipoOrigen"] = tipoOrigen;
        traspaso["data"][0]["tipoDestino"] = tipoDestino;

        let totalCantidad = 0;
        let totalPrecio = 0.00;
        let totalPuntos = 0.00;
        let detalle = await traspasoModelo.listaTraspasoDetalleByIdTraspaso(entrada.idTraspaso, entrada.estado);
        if (!detalle.estado) {
            respuesta = detalle;
            return respuesta;
        }
        
        for(let i=0; i<detalle["data"].length; i++){
            totalCantidad = totalCantidad + parseInt(detalle["data"][i]["cantidad"]);
            
            detalle["data"][i]["puntosSubTotal"] = parseInt(detalle["data"][i]["cantidad"]) * parseInt(detalle["data"][i]["puntos"])
            totalPuntos = totalPuntos + parseInt( detalle["data"][i]["puntosSubTotal"]);
            
            detalle["data"][i]["codigoLiteral"] = "S/C";
            if(detalle["data"][i]["codigo"] != ""){
                detalle["data"][i]["codigoLiteral"] = "#" + detalle["data"][i]["codigo"];
            }

            detalle["data"][i]["costoFormato"] = convertir.formatoMoneda(detalle["data"][i]["costo"])
            detalle["data"][i]["subTotal"] = parseInt(detalle["data"][i]["cantidad"]) * parseFloat(detalle["data"][i]["costo"]);
            detalle["data"][i]["subTotalFormato"] = convertir.formatoMoneda(detalle["data"][i]["subTotal"])
            totalPrecio = totalPrecio + parseFloat(detalle["data"][i]["subTotal"]);
        }

        respuesta.data = {
            "traspaso": traspaso["data"][0],
            "detalle": detalle["data"],
            "totalCantidad": totalCantidad,
            "totalPrecio": totalPrecio,
            "totalPrecioFormato": convertir.formatoMoneda(totalPrecio),
            "totalPuntos": totalPuntos
        };

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - traspasoById', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaTraspasoByEstado(entrada){
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
        
        let traspasos = await traspasoModelo.listaTraspasoByEstado(entrada.estado, entrada.idNegocio);
        if (!traspasos.estado) {
            respuesta = traspasos;
            return respuesta;
        }

        respuesta = traspasos;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaTraspasoByEstado', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaTraspasoByOrigen(entrada){
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
        
        let traspasos;
        if(entrada.idAlmacenOrigen != "1"){
            traspasos = await traspasoModelo.listaTraspasoByAlmacenOrigen(entrada.idAlmacenOrigen, entrada.estado, entrada.idNegocio);
            if (!traspasos.estado) {
                respuesta = traspasos;
                return respuesta;
            }
        }

        if(entrada.idClienteOrigen != "1"){
            traspasos = await traspasoModelo.listaTraspasoByClienteOrigen(entrada.idClienteOrigen, entrada.estado, entrada.idNegocio);
            if (!traspasos.estado) {
                respuesta = traspasos;
                return respuesta;
            }
        }

        let tipoOrigen = "";
        let tipoDestino = "";
        for (let i = 0; i < traspasos["data"].length; i++) {
            if(traspasos["data"][i]["idAlmacenOrigen"] != "1"){
                tipoOrigen = "Almacén"
                if(traspasos["data"][i]["idAlmacenDestino"] != "1"){
                    tipoDestino = "Almacén"
                }
                if(traspasos["data"][i]["idClienteDestino"] != "1"){
                    tipoDestino = "Cliente"
                }
            }

            if(traspasos["data"][i]["idClienteOrigen"] != "1"){
                tipoOrigen = "Cliente"
                if(traspasos["data"][i]["idAlmacenDestino"] != "1"){
                    tipoDestino = "Almacén"
                }
                if(traspasos["data"][i]["idClienteDestino"] != "1"){
                    tipoDestino = "Cliente"
                }
            }
            traspasos["data"][i]["tipoOrigen"] = tipoOrigen;
            traspasos["data"][i]["tipoDestino"] = tipoDestino;
        }

        respuesta.data = {
            "traspasos": traspasos.data
        };

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaTraspasoByEstado', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function documentoPdfTraspasoById(entrada){
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

        let oData = await traspasoById(entrada);
        if (!oData.estado) {
            respuesta = oData;
            return respuesta;
        }
        oData = oData.data

        let documentoData = await traspasoDetalleReporte.traspasoDetalle(oData);
        if (!documentoData.estado) {
            respuesta = documentoData;
            return respuesta;
        }

        let documentoBase64 = await reporte.generarPdfBase64(documentoData.data);
        let documentoNombre = `reporte_traspaso_${entrada.idTraspaso}_${fecha}_${hora.replace(":", "")}.pdf`;

        respuesta.data = {
            "firmado": oData["traspaso"]["firmado"],
            "documentoBase64": documentoBase64,
            "documentoNombre": documentoNombre
        };

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - documentoPdfTraspasoById', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}


//export
module.exports = {
    agregarTraspaso,

    traspasoById,

    listaTraspasoByEstado,
    listaTraspasoByOrigen,

    documentoPdfTraspasoById
}