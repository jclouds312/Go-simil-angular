const logger = require('../logger').logger
const path = require('path');
const filename = path.basename(__filename);
const libFecha = require('../libreria/libFecha');
const { getMessage, getMessageCategory } = require('../messages');
const convertir = require('../libreria/convertir.js');
const usuarioControlador = require('./usuarioControlador');
const categoriaModelo = require('../modelo/categoriaModelo');
const ventaModelo = require('../modelo/ventaModelo');
const productoModelo = require('../modelo/productoModelo');
const cuentaControlador = require('./cuentaControlador');

const reporte = require('../reporte/componentes.js');
const ventaDetalleReporte = require('../reporte/ventaDetalleReporte.js');

async function agregarVenta(entrada){
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
        let comisionVenta = "Sin Comision";

        let nuevaVenta = await ventaModelo.agregarVenta(entrada.idAlmacen, entrada.idClienteOrigen, entrada.idUsuario, entrada.idCliente, fecha, hora, entrada.total, entrada.descuento, entrada.precioTotal, entrada.observacion, entrada.credito, entrada.pagado, entrada.idNegocio, "0", "1", entrada.idSucursal, comisionVenta, "1");
        if (!nuevaVenta.estado) {
            respuesta = nuevaVenta;
            return respuesta;
        }

        let idVenta = nuevaVenta["data"]["idVenta"];

        for(let i=0; i<productos.length; i++){
            let oInventario = await productoModelo.inventarioProductoById(productos[i]["idInventarioProducto"]);
            if (!oInventario.estado) {
                respuesta = oInventario;
                return respuesta;
            }

            let oProducto = await productoModelo.productoByInventario(productos[i]["idInventarioProducto"]);
            if (!oProducto.estado) {
                respuesta = oProducto;
                return respuesta;
            }

            let cantNecesaria = parseInt(productos[i]["cantidad"]);
            let cantInventario = parseInt(oInventario["data"][0]["cantidad"]) - parseInt(cantNecesaria);
            let subtotal = cantNecesaria * parseFloat(productos[i]["precioFinal"]);

            let comision = "0";
            let idPagoComision = "1";
            let comisionUsuario = 0.00;
            if(parseFloat(subtotal) >= parseFloat(oProducto["data"][0]["meta"])){
                comisionVenta = "Comision Acumulada";
                comision = "1"; 
                comisionUsuario = parseFloat(subtotal) * (parseFloat(oProducto["data"][0]["porcentaje"]) * 0.01);

                let oPagoComision = await categoriaModelo.pagoComisionByCategoriaMetaPorcentaje(oProducto["data"][0]["idCategoria"], oProducto["data"][0]["meta"], oProducto["data"][0]["porcentaje"]);
                if (!oPagoComision.estado) {
                    respuesta = oPagoComision;
                    return respuesta;
                }

                if(oPagoComision["data"].length > 0){
                    idPagoComision = oPagoComision["data"][0]["idPagoComision"]
                }
            }

            let oDetalle = await ventaModelo.agregarVentaDetalle(idVenta, oInventario["data"][0]["idInventarioProducto"], productos[i]["idPrecioVenta"], cantNecesaria, "", oInventario["data"][0]["puntos"], productos[i]["precio"], subtotal, "0", comision, idPagoComision, comisionUsuario, productos[i]["idDescuento"], productos[i]["descuento"]);
            if (!oDetalle.estado) {
                respuesta = oDetalle;
                return respuesta;
            }

            let oActualiza = await productoModelo.actualizaCantidadByid(cantInventario, "", oInventario["data"][0]["idInventarioProducto"]);
            if (!oActualiza.estado) {
                respuesta = oActualiza;
                return respuesta;
            }

            let oHistorial = await productoModelo.agregarInventarioProductoHistorial(entrada.idUsuario, oInventario["data"][0]["idInventarioProducto"], "0", cantNecesaria, "", "Venta realizada, nro. de venta: " + idVenta, "", fecha, hora);
            if (!oHistorial.estado) {
                respuesta = oHistorial;
                return respuesta;
            }
        }

        let oActualizaEstadoComision = await ventaModelo.actualizarEstadoComisionById(comisionVenta, idVenta);
        if (!oActualizaEstadoComision.estado) {
            respuesta = oActualizaEstadoComision;
            return respuesta;
        }
        

        respuesta = nuevaVenta;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - agregarVenta', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}
/*
//ANTIGUA FORMA QUE DESCUENTA PRODUCTOS EN PILA DEL INVENTARIO
async function agregarVenta(entrada){
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
    
        let nuevaVenta = await ventaModelo.agregarVenta(entrada.idAlmacen, entrada.idClienteOrigen, entrada.idUsuario, entrada.idCliente, fecha, hora, entrada.total, entrada.descuento, entrada.precioTotal, entrada.observacion, entrada.idCuenta, entrada.credito, entrada.pagado, entrada.idNegocio, "0", "1");
        if (!nuevaVenta.estado) {
            respuesta = nuevaVenta;
            return respuesta;
        }

        let idVenta = nuevaVenta["data"]["idVenta"];

        for(let i=0; i<productos.length; i++){
            let oInventario;
            if(entrada.tipoAlmacenOrigen == "almacen"){
                oInventario = await productoModelo.listaInventarioProductoByAlmacenProducto(entrada.idAlmacen, productos[i]["idProducto"], 0, "1", entrada.idNegocio);
                if (!oInventario.estado) {
                    respuesta = oInventario;
                    return respuesta;
                }
            }

            if(entrada.tipoAlmacenOrigen == "cliente"){
                oInventario = await productoModelo.listaInventarioProductoByClienteProducto(entrada.idClienteOrigen, productos[i]["idProducto"], 0, "1", entrada.idNegocio);
                if (!oInventario.estado) {
                    respuesta = oInventario;
                    return respuesta;
                }
            }

            let cantNecesaria = parseInt(productos[i]["cantidad"]);
            for(let j=0; j<oInventario["data"].length; j++){
                let cantEncontrada = 0;
                let cantInventario = 0;
                if(parseInt(oInventario["data"][j]["cantidad"]) >= parseInt(cantNecesaria)){
                    cantInventario = parseInt(oInventario["data"][j]["cantidad"]) - parseInt(cantNecesaria);
                    cantEncontrada = parseInt(cantNecesaria);
                    cantNecesaria = 0;
                }else{
                    cantEncontrada = parseInt(oInventario["data"][j]["cantidad"]);
                    cantNecesaria = parseInt(cantNecesaria) - parseInt(oInventario["data"][j]["cantidad"])
                    cantInventario = 0
                }
                
                let subtotal = cantEncontrada * parseFloat(productos[i]["precio"]);
                let oDetalle = await ventaModelo.agregarVentaDetalle(idVenta, oInventario["data"][j]["idInventarioProducto"], cantEncontrada, "", oInventario["data"][j]["puntosProducto"], productos[i]["precio"], subtotal);
                if (!oDetalle.estado) {
                    respuesta = oDetalle;
                    return respuesta;
                }

                let oActualiza = await productoModelo.actualizaCantidadByid(cantInventario, "", oInventario["data"][j]["idInventarioProducto"]);
                if (!oActualiza.estado) {
                    respuesta = oActualiza;
                    return respuesta;
                }

                let oHistorial = await productoModelo.agregarInventarioProductoHistorial(entrada.idUsuario, oInventario["data"][j]["idInventarioProducto"], "0", cantEncontrada, "", "Venta realizada, nro. de venta: " + idVenta, "", fecha, hora);
                if (!oHistorial.estado) {
                    respuesta = oHistorial;
                    return respuesta;
                }

                if(cantNecesaria == 0){
                    break;
                }
            }
        }

        respuesta = nuevaVenta;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - agregarVenta', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}*/

async function agregarVentaCredito(entrada){
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
        
        let oAgregar = await ventaModelo.agregarVentaCredito(entrada.idVenta, entrada.idCuenta, entrada.idUsuario, entrada.fechaCredito, fecha, hora, entrada.monto, entrada.pagado, entrada.idNegocio);
        if (!oAgregar.estado) {
            respuesta = oAgregar;
            return respuesta;
        }

        if(entrada.pagado == "1"){
            let entradaCuenta = {
                "idLogin": entrada.idLogin,
                "dispositivo": entrada.dispositivo,
                "idCuenta": entrada.idCuenta,
                "tipo": "1",
                "monto": entrada.monto,
                "descripcion": "Pago de la Venta Nro.: " + entrada.idVenta,
            };
            let oCuenta = await cuentaControlador.agregarCuentaHistorial(entradaCuenta);
            if (!oCuenta.estado) {
                respuesta = oCuenta;
                return respuesta;
            }
        }
        

        let credito = await ventaModelo.listaVentaCreditoByIdVenta(entrada.idVenta, "1");
        if (!credito.estado) {
            respuesta = credito;
            return respuesta;
        }

        let totalCredito = 0.00;
        for (let i = 0; i < credito.data.length; i++) {
            if (credito.data[i].pagado == 1) {
                totalCredito += parseFloat(credito.data[i].monto);
            }
        }

        let venta = await ventaModelo.ventaById(entrada.idVenta, "1");
        if (!venta.estado) {
            respuesta = venta;
            return respuesta;
        }

        if(totalCredito >= parseFloat(venta["data"][0]["total"])){
            let oActualizar = await ventaModelo.actualizarPagoById("1", entrada.idVenta);
            if (!oActualizar.estado) {
                respuesta = oActualizar;
                return respuesta;
            } 
        }

        if(venta["data"][0]["estadoComision"] == "Comision Acumulada"){
            let oActualizaEstadoComision = await ventaModelo.actualizarEstadoComisionById("Comision Por Pagar", entrada.idVenta);
            if (!oActualizaEstadoComision.estado) {
                respuesta = oActualizaEstadoComision;
                return respuesta;
            }
        }
        

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - agregarVentaCredito', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function agregarDevolucionVentaDetalleById(entrada){
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
        
        let detalle = await ventaModelo.ventaDetalleById(entrada.idVentaDetalle, "1");
        if (!detalle.estado) {
            respuesta = detalle;
            return respuesta;
        }

        let venta = await ventaModelo.ventaById(detalle["data"][0]["idVenta"], "1");
        if (!venta.estado) {
            respuesta = venta;
            return respuesta;
        }

        let subTotalDevolucion = parseInt(entrada.cantidad) * parseFloat(detalle["data"][0]["venta"])
        if(parseInt(detalle["data"][0]["cantidad"]) == parseInt(entrada.cantidad)){
            let oActualizar = await ventaModelo.actualizarDevolucionById("1", entrada.idVentaDetalle);
            if (!oActualizar.estado) {
                respuesta = oActualizar;
                return respuesta;
            }
        } else {
            let nuevaCantidad = parseInt(detalle["data"][0]["cantidad"]) - parseInt(entrada.cantidad);
            let subTotal = parseInt(nuevaCantidad) * parseFloat(detalle["data"][0]["venta"])
            let oActualizar = await ventaModelo.actualizarCantidadSubtotalById(nuevaCantidad, subTotal, entrada.idVentaDetalle);
            if (!oActualizar.estado) {
                respuesta = oActualizar;
                return respuesta;
            }

            let oDetalle = await ventaModelo.agregarVentaDetalle(detalle["data"][0]["idVenta"], detalle["data"][0]["idInventario"], detalle["data"][0]["idPrecioVenta"], entrada.cantidad, "", detalle["data"][0]["puntos"], detalle["data"][0]["venta"], subTotalDevolucion, "1", detalle["data"][0]["comision"], detalle["data"][0]["idPagoComision"], detalle["data"][0]["comisionUsuario"], detalle["data"][0]["idDescuento"], detalle["data"][0]["descuento"]);
            if (!oDetalle.estado) {
                respuesta = oDetalle;
                return respuesta;
            }
        }

        let nuevoTotal = parseFloat(venta["data"][0]["total"]) - parseFloat(subTotalDevolucion);
        let oActualizaInv = await ventaModelo.actualizarTotalVentaById(nuevoTotal, nuevoTotal, detalle["data"][0]["idVenta"]);
        if (!oActualizaInv.estado) {
            respuesta = oActualizaInv;
            return respuesta;
        }

        let oInventario = await productoModelo.inventarioProductoById(detalle["data"][0]["idInventario"]);
        if (!oInventario.estado) {
            respuesta = oInventario;
            return respuesta;
        }

        let cantInventario = parseInt(oInventario["data"][0]["cantidad"]) + parseInt(entrada.cantidad);
        oActualizaInv = await productoModelo.actualizaCantidadByid(cantInventario, "", detalle["data"][0]["idInventario"]);
        if (!oActualizaInv.estado) {
            respuesta = oActualizaInv;
            return respuesta;
        }

        let mensaje = `Venta Nro.: ${detalle["data"][0]["idVenta"]} - Devolución de producto`
        let oHistorial = await productoModelo.agregarInventarioProductoHistorial(entrada.idUsuario, detalle["data"][0]["idInventario"], "1", entrada.cantidad, "", mensaje, "", fecha, hora);
        if (!oHistorial.estado) {
            respuesta = oHistorial;
            return respuesta;
        }

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - agregarDevolucionVentaDetalleById', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function actualizarEstadoComisionById(entrada){
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

        let ventas = await ventaModelo.actualizarEstadoComisionById(entrada.estadoComision, entrada.idVenta);
        if (!ventas.estado) {
            respuesta = ventas;
            return respuesta;
        }

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - actualizarEstadoComisionById', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function ventaById(entrada){
    let data = [];
    let codigo = getMessageCategory("proceso", "nivelControlador", "correcto", "codigo");
    let estado = true;
    let mensaje = getMessageCategory("proceso", "nivelControlador", "correcto", "mensaje");
    let respuesta = {data, codigo, estado, mensaje}

    try{
        const {fecha , hora} = await libFecha.fechaHoraActualyymmdd();

        if(entrada.idLogin !== undefined && entrada.idLogin !== null){
            entrada.avanzado = true;
            let oLogin = await usuarioControlador.usuarioLoginByIdLogin(entrada);
            if (!oLogin.estado) {
                respuesta = oLogin;
                return respuesta;
            }

            entrada.idNegocio = oLogin["data"]["usuario"]["idNegocio"];
            entrada.idUsuario = oLogin["data"]["usuario"]["idUsuario"];
        }

        let venta = await ventaModelo.ventaById(entrada.idVenta, entrada.estado);
        if (!venta.estado) {
            respuesta = venta;
            return respuesta;
        }

        if (venta["data"].length == 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "No se encontró la venta. Verifica los datos e inténtalo nuevamente.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - ventaById", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(venta)});
            return respuesta;
        }

        let tipoOrigen = "";
        let tipoDestino = "Cliente";
        if(venta["data"][0]["idAlmacenOrigen"] != "1"){
            tipoOrigen = "Almacén"
        }

        if(venta["data"][0]["idClienteOrigen"] != "1"){
            tipoOrigen = "Cliente"
        }
        venta["data"][0]["tipoOrigen"] = tipoOrigen;
        venta["data"][0]["tipoDestino"] = tipoDestino;

        let totalCantidad = 0;
        let totalPrecio = 0.00;
        let totalDescuento = 0.00;
        let totalPuntos = 0.00;
        let detalle = await ventaModelo.listaVentaDetalleByIdVenta(entrada.idVenta, entrada.estado);
        if (!detalle.estado) {
            respuesta = detalle;
            return respuesta;
        }

        for(let i=0; i<detalle["data"].length; i++){
            if(detalle["data"][i]["devolucion"] == "0"){
                totalCantidad = totalCantidad + parseInt(detalle["data"][i]["cantidad"]);
                detalle["data"][i]["puntosSubTotal"] = parseInt(detalle["data"][i]["cantidad"]) * parseInt(detalle["data"][i]["puntos"])
                totalPuntos = totalPuntos + parseInt( detalle["data"][i]["puntosSubTotal"]);
                totalPrecio = totalPrecio + parseFloat(detalle["data"][i]["subTotal"]);
            }
            
            detalle["data"][i]["codigoLiteral"] = "S/C";
            if(detalle["data"][i]["codigo"] != ""){
                detalle["data"][i]["codigoLiteral"] = "#" + detalle["data"][i]["codigo"];
            }

            detalle["data"][i]["ventaFormato"] = convertir.formatoMoneda(detalle["data"][i]["venta"])
            detalle["data"][i]["precioFinal"] = (parseFloat(detalle["data"][i]["venta"]) - parseFloat(detalle["data"][i]["descuento"])).toFixed(2)
            detalle["data"][i]["precioFinalFormato"] = convertir.formatoMoneda(detalle["data"][i]["precioFinal"])
            detalle["data"][i]["subTotalFormato"] = convertir.formatoMoneda(detalle["data"][i]["subTotal"])
            
            totalDescuento = totalDescuento + (parseFloat(detalle["data"][i]["descuento"]) * parseInt(detalle["data"][i]["cantidad"])).toFixed(2)
        }

        let credito = await ventaModelo.listaVentaCreditoByIdVenta(entrada.idVenta, entrada.estado);
        if (!credito.estado) {
            respuesta = credito;
            return respuesta;
        }

        let totalCredito = 0.00;
        let totalSaldo = 0.00;
        for (let i = 0; i < credito.data.length; i++) {
            totalCredito += parseFloat(credito.data[i].monto);
            credito["data"][i]["montoFormato"] = convertir.formatoMoneda(credito["data"][i]["monto"]);
        }
        totalSaldo = totalPrecio - totalCredito;
        let totalSinDescuento = parseFloat(totalDescuento) + parseFloat(totalPrecio);

        respuesta.data = {
            "venta": venta["data"][0],
            "detalle": detalle["data"],
            "credito": credito["data"],
            "totalCantidad": totalCantidad,
            "totalSaldo": totalSaldo,
            "totalCredito": totalCredito,
            "totalPrecio": totalPrecio,
            "totalDescuento": totalDescuento,
            "totalSinDescuento": totalSinDescuento,
            "totalSinDescuentoFormato": convertir.formatoMoneda(totalSinDescuento),
            "totalDescuentoFormato": convertir.formatoMoneda(totalDescuento),
            "totalSaldoFormato": convertir.formatoMoneda(totalSaldo),
            "totalCreditoFormato": convertir.formatoMoneda(totalCredito),
            "totalPrecioFormato": convertir.formatoMoneda(totalPrecio),
            "totalPuntos": totalPuntos
        };

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - ventaById', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    

    return respuesta;
}

async function listaVentaByEstado(entrada){
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

        let ventas = await ventaModelo.listaVentaByEstado(entrada.estado, entrada.fechaInicio, entrada.fechaFin, entrada.idNegocio);
        if (!ventas.estado) {
            respuesta = ventas;
            return respuesta;
        }
        
        let tipoOrigen = "";
        let tipoDestino = "Cliente";
        for (let i = 0; i < ventas["data"].length; i++) {
            if(ventas["data"][i]["idAlmacenOrigen"] != "1"){
                tipoOrigen = "Almacén"
            }

            if(ventas["data"][i]["idClienteOrigen"] != "1"){
                tipoOrigen = "Cliente"
            }
            ventas["data"][i]["tipoOrigen"] = tipoOrigen;
            ventas["data"][i]["tipoDestino"] = tipoDestino;
        }

        respuesta.data = {
            "ventas": ventas.data
        };

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaVentaByEstado', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaVentaByOrigen(entrada){
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
        
        let ventas = await ventaModelo.listaVentaByAlmacenOrigen(entrada.idAlmacenOrigen, entrada.fechaInicio, entrada.fechaFin, entrada.estado, entrada.idNegocio);
        if (!ventas.estado) {
            respuesta = ventas;
            return respuesta;
        }
        
        let tipoOrigen = "";
        let tipoDestino = "Cliente";
        for (let i = 0; i < ventas["data"].length; i++) {
            if(ventas["data"][i]["idAlmacenOrigen"] != "1"){
                tipoOrigen = "Almacén"
            }

            if(ventas["data"][i]["idClienteOrigen"] != "1"){
                tipoOrigen = "Cliente"
            }
            ventas["data"][i]["tipoOrigen"] = tipoOrigen;
            ventas["data"][i]["tipoDestino"] = tipoDestino;
        }

        respuesta.data = {
            "ventas": ventas.data
        };

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaVentaByOrigen', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaVentaByCliente(entrada){
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
        console.log(entrada.idCliente)
        let ventas = await ventaModelo.listaVentaByCliente(entrada.idCliente, entrada.fechaInicio, entrada.fechaFin, entrada.estado, entrada.idNegocio);
        if (!ventas.estado) {
            respuesta = ventas;
            return respuesta;
        }
        
        let tipoOrigen = "";
        let tipoDestino = "Cliente";
        for (let i = 0; i < ventas["data"].length; i++) {
            if(ventas["data"][i]["idAlmacenOrigen"] != "1"){
                tipoOrigen = "Almacén"
            }

            if(ventas["data"][i]["idClienteOrigen"] != "1"){
                tipoOrigen = "Cliente"
            }
            ventas["data"][i]["tipoOrigen"] = tipoOrigen;
            ventas["data"][i]["tipoDestino"] = tipoDestino;
        }

        respuesta.data = {
            "ventas": ventas.data
        };

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaVentaByCliente', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaVentaBySucursal(entrada){
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

        let ventas = await ventaModelo.listaVentaBySucursal(entrada.idSucursal, entrada.fechaInicio, entrada.fechaFin, entrada.estado, entrada.idNegocio);
        if (!ventas.estado) {
            respuesta = ventas;
            return respuesta;
        }
        console.log(ventas)
        let tipoOrigen = "";
        let tipoDestino = "Cliente";
        for (let i = 0; i < ventas["data"].length; i++) {
            if(ventas["data"][i]["idAlmacenOrigen"] != "1"){
                tipoOrigen = "Almacén"
            }

            if(ventas["data"][i]["idClienteOrigen"] != "1"){
                tipoOrigen = "Cliente"
            }
            ventas["data"][i]["tipoOrigen"] = tipoOrigen;
            ventas["data"][i]["tipoDestino"] = tipoDestino;
        }

        respuesta.data = {
            "ventas": ventas.data
        };

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaVentaBySucursal', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaVentaBySucursalUsuario(entrada){
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

        let ventas = await ventaModelo.listaVentaBySucursalUsuario(entrada.idSucursal, entrada.idUsuario, entrada.fechaInicio, entrada.fechaFin, entrada.estado, entrada.idNegocio);
        if (!ventas.estado) {
            respuesta = ventas;
            return respuesta;
        }
        console.log(ventas)
        let tipoOrigen = "";
        let tipoDestino = "Cliente";
        for (let i = 0; i < ventas["data"].length; i++) {
            if(ventas["data"][i]["idAlmacenOrigen"] != "1"){
                tipoOrigen = "Almacén"
            }

            if(ventas["data"][i]["idClienteOrigen"] != "1"){
                tipoOrigen = "Cliente"
            }
            ventas["data"][i]["tipoOrigen"] = tipoOrigen;
            ventas["data"][i]["tipoDestino"] = tipoDestino;
        }

        respuesta.data = {
            "ventas": ventas.data
        };

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaVentaBySucursal', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaVentaUsuarioBySucursalFechas(entrada){
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

        let ventas = await ventaModelo.listaVentaUsuarioBySucursalFechas(entrada.idSucursal, entrada.fechaInicio, entrada.fechaFin, entrada.estado, entrada.idNegocio);
        if (!ventas.estado) {
            respuesta = ventas;
            return respuesta;
        }

        for (let i = 0; i < ventas["data"].length; i++) {
            ventas["data"][i]["totalAcumuladoFormato"] = convertir.formatoMoneda(ventas["data"][i]["totalAcumulado"]);
        }

        respuesta.data = {
            "ventas": ventas.data
        };

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaVentaUsuarioBySucursalFechas', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaVentaDetalleByIdProductoPagado(entrada){
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
        
        let venta = await ventaModelo.ventaById(entrada.idVenta, "1");
        if (!venta.estado) {
            respuesta = venta;
            return respuesta;
        }

        let producto = await ventaModelo.listaVentaDetalleByIdProductoPagado(entrada.idProducto, entrada.pagado, entrada.devolucion);
        if (!producto.estado) {
            respuesta = producto;
            return respuesta;
        }

        for (let i = 0; i < producto.data.length; i++) {
            producto["data"][i]["ventaFormato"] = convertir.formatoMoneda(producto["data"][i]["venta"]);
            producto["data"][i]["subTotalFormato"] = convertir.formatoMoneda(producto["data"][i]["subTotal"]);
        }

        respuesta = producto;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaVentaDetalleByIdProductoPagado', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaProductoVentaBySucursalFechas(entrada){
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

        let ventas = await ventaModelo.listaProductoVentaBySucursalFechas(entrada.idSucursal, entrada.fechaInicio, entrada.fechaFin, entrada.estado, entrada.idNegocio);
        if (!ventas.estado) {
            respuesta = ventas;
            return respuesta;
        }

        for (let i = 0; i < ventas["data"].length; i++) {
            ventas["data"][i]["codigoLiteral"] = "S/C";
            if(ventas["data"][i]["codigo"] != ""){
                ventas["data"][i]["codigoLiteral"] = "#" + ventas["data"][i]["codigo"];
            }

            ventas["data"][i]["totalAcumuladoFormato"] = convertir.formatoMoneda(ventas["data"][i]["totalAcumulado"]);
        }

        respuesta.data = {
            "ventas": ventas.data
        };

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaProductoVentaBySucursalFechas', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaVentaCreditoByIdVenta(entrada){
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
        
        let venta = await ventaModelo.ventaById(entrada.idVenta, "1");
        if (!venta.estado) {
            respuesta = venta;
            return respuesta;
        }

        let credito = await ventaModelo.listaVentaCreditoByIdVenta(entrada.idVenta, "1");
        if (!credito.estado) {
            respuesta = credito;
            return respuesta;
        }

        let totalCredito = 0.00;
        let totalSaldo = 0.00;
        for (let i = 0; i < credito.data.length; i++) {
            if (credito.pagado == "1") {
                totalCredito += parseFloat(credito.data[i].monto);
            }

            credito["data"][i]["montoFormato"] = convertir.formatoMoneda(credito["data"][i]["monto"]);
        }

        totalSaldo = parseFloat(venta["data"][0]["total"]) - totalCredito;
        if(totalCredito >= parseFloat(venta["data"][0]["total"])){
            totalSaldo = 0.00;
        }
        

        respuesta.data = {
            "credito": credito.data,
            "totalCredito": convertir.formatoMoneda(totalCredito),
            "totalVenta": convertir.formatoMoneda(venta["data"][0]["total"]),
            "totalSaldo": convertir.formatoMoneda(totalSaldo)
        };

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaVentaCreditoByIdVenta', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaComisionByComision(entrada){
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
        
        if(entrada.idUsuario == "1"){
            entrada.idUsuario = oLogin["data"]["usuario"]["idUsuario"];
        }
        
        let comision;

        if(entrada.idSucursal == "1"){
            comision = await ventaModelo.listaComisionByUsuario(entrada.idUsuario, entrada.comision);
            if (!comision.estado) {
                respuesta = comision;
                return respuesta;
            }
        } else {
            comision = await ventaModelo.listaComisionBySucursal(entrada.idSucursal, entrada.comision);
            if (!comision.estado) {
                respuesta = comision;
                return respuesta;
            }
        }
        
        respuesta = comision;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaVentaCreditoByIdVenta', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function documentoPdfVentaById(entrada){
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

        let oData = await ventaById(entrada);
        if (!oData.estado) {
            respuesta = oData;
            return respuesta;
        }
        oData = oData.data

        let documentoData = await ventaDetalleReporte.ventaDetalle(oData);
        if (!documentoData.estado) {
            respuesta = documentoData;
            return respuesta;
        }

        let documentoBase64 = await reporte.generarPdfBase64(documentoData.data);
        let documentoNombre = `reporte_venta_${entrada.idVenta}_${fecha}_${hora.replace(":", "")}.pdf`;

        respuesta.data = {
            "firmado": oData["venta"]["firmado"],
            "documentoBase64": documentoBase64,
            "documentoNombre": documentoNombre
        };

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - documentoPdfVentaById', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

//export
module.exports = {
    agregarVenta,
    agregarVentaCredito,
    agregarDevolucionVentaDetalleById,

    actualizarEstadoComisionById,
    ventaById,

    listaVentaByEstado,
    listaVentaByOrigen,
    listaVentaByCliente,
    listaVentaBySucursal,
    listaVentaBySucursalUsuario,
    listaVentaUsuarioBySucursalFechas,
    listaVentaDetalleByIdProductoPagado,
    listaProductoVentaBySucursalFechas,
    listaVentaCreditoByIdVenta,
    listaComisionByComision,

    documentoPdfVentaById
}