const logger = require('../logger').logger
const path = require('path');
const filename = path.basename(__filename);
const libFecha = require('../libreria/libFecha');
const { getMessage, getMessageCategory } = require('../messages');
const convertir = require('../libreria/convertir.js');
const usuarioControlador = require('./usuarioControlador');
const cuentaModelo = require('../modelo/cuentaModelo');

async function agregarCuenta(entrada){
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

        let oCuentas = await cuentaModelo.cuentaByNombre(entrada.nombre, entrada.idNegocio);
        if (!oCuentas.estado) {
            respuesta = oCuentas;
            return respuesta;
        }

        if (oCuentas["data"].length > 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "El nombre alias de la cuenta que acaba de ingresar ya se tiene registrado. Cambie de nombre";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - agregarCuenta", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(oCuentas)});
            return respuesta;
        }

        let nuevaCuenta = await cuentaModelo.agregarCuenta(entrada.idNegocio, entrada.alias, entrada.banco, entrada.numeroCuenta, "0.00", "1", entrada.idSucursal);
        if (!nuevaCuenta.estado) {
            respuesta = nuevaCuenta;
            return respuesta;
        }

        let idCuenta = nuevaCuenta["data"]["idCuenta"];

        let oApertura = await cuentaModelo.agregarCuentaHistorial(idCuenta, "1", "0.00", "0.00", "Apertura de Cuenta", "Apertura de Cuenta", fecha, hora, entrada.idUsuario, entrada.idNegocio, "1");
        if (!oApertura.estado) {
            respuesta = oApertura;
            return respuesta;
        }

        respuesta = nuevaCuenta;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - agregarCuenta', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function agregarCuentaHistorial(entrada){
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

        let oCuenta = await cuentaModelo.cuentaById(entrada.idCuenta);
        if (!oCuenta.estado) {
            respuesta = oCuenta;
            return respuesta;
        }

        if (oCuenta["data"].length == 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "La cuenta seleccionada no existe. verifique e intente nuevamente";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - agregarCuentaHistorial", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(oCuenta)});
            return respuesta;
        }

        if (parseInt(entrada.tipo) == 0) {
            if (parseFloat(entrada.monto) > parseFloat(oCuenta["data"][0]["saldo"])) {
                respuesta.codigo = "2";
                respuesta.estado = false;
                respuesta.mensaje ="La cuenta no tiene saldo suficiente para realizar la operacion. verifique e intente nuevamente";
                respuesta.data = [];
                logger.log({level: "info", label: filename + " - agregarCuentaHistorial", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(oCuenta)});
                return respuesta;
            }
        }

        let saldo = parseFloat(oCuenta["data"][0]["saldo"]);
        let nuevoSaldo = 0.00;
        if(entrada.tipo == "1"){
            nuevoSaldo = saldo + parseFloat(entrada.monto)
        } else {
            nuevoSaldo = saldo - parseFloat(entrada.monto)
        }

        let oHistorial = await cuentaModelo.agregarCuentaHistorial(entrada.idCuenta, entrada.tipo, entrada.monto, nuevoSaldo, entrada.descripcion, "", fecha, hora, entrada.idUsuario, entrada.idNegocio, "1");
        if (!oHistorial.estado) {
            respuesta = oHistorial;
            return respuesta;
        }

        let oSaldo = await cuentaModelo.actualizarSaldoById(entrada.idCuenta, nuevoSaldo);
        if (!oSaldo.estado) {
            respuesta = oSaldo;
            return respuesta;
        }

        respuesta = oHistorial;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - agregarCuentaHistorial', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function transferirSaldoCuentaByCuenta(entrada){
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

        let oCuentaOrigen = await cuentaModelo.cuentaById(entrada.idCuentaOrigen);
        if (!oCuentaOrigen.estado) {
            respuesta = oCuentaOrigen;
            return respuesta;
        }

        if (oCuentaOrigen["data"].length == 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "La cuenta de origen no existe. verifique e intente nuevamente";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - agregarCuentaHistorial", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(oCuentaOrigen)});
            return respuesta;
        }

        if (parseFloat(entrada.monto) > parseFloat(oCuentaOrigen["data"][0]["saldo"])) {
            respuesta.codigo = "2";
            respuesta.estado = false;
            respuesta.mensaje ="La cuenta de origen no tiene saldo suficiente para realizar la operacion. verifique e intente nuevamente";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - agregarCuentaHistorial", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(oCuentaOrigen)});
            return respuesta;
        }

        let oCuentaDestino = await cuentaModelo.cuentaById(entrada.idCuentaDestino);
        if (!oCuentaDestino.estado) {
            respuesta = oCuentaDestino;
            return respuesta;
        }

        if (oCuentaDestino["data"].length == 0) {
            respuesta.codigo = "3";
            respuesta.estado = false;
            respuesta.mensaje = "La cuenta de origen no existe. verifique e intente nuevamente";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - agregarCuentaHistorial", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(oCuentaDestino)});
            return respuesta;
        }

        let saldoNuevoOrigen = parseFloat(oCuentaOrigen["data"][0]["saldo"]) - parseFloat(entrada.monto);
        let saldoNuevoDestino = parseFloat(oCuentaDestino["data"][0]["saldo"]) + parseFloat(entrada.monto);

        entrada.descripcion = `Transferencia - Cuenta Destino: ${oCuentaDestino["data"][0]["alias"]} - ${entrada.descripcion}`;
        let oHistorialOrigen = await cuentaModelo.agregarCuentaHistorial(entrada.idCuentaOrigen, "0", entrada.monto, saldoNuevoOrigen, entrada.descripcion, "", fecha, hora, entrada.idUsuario, entrada.idNegocio, "1");
        if (!oHistorialOrigen.estado) {
            respuesta = oHistorialOrigen;
            return respuesta;
        }

        let oSaldo = await cuentaModelo.actualizarSaldoById(entrada.idCuentaOrigen, saldoNuevoOrigen);
        if (!oSaldo.estado) {
            respuesta = oSaldo;
            return respuesta;
        }

        entrada.descripcion = `Transferencia - Cuenta Origen: ${oCuentaOrigen["data"][0]["alias"]} - ${entrada.descripcion}`;
        let oHistorialDestino = await cuentaModelo.agregarCuentaHistorial(entrada.idCuentaDestino, "1", entrada.monto, saldoNuevoDestino, entrada.descripcion, "", fecha, hora, entrada.idUsuario, entrada.idNegocio, "1");
        if (!oHistorialDestino.estado) {
            respuesta = oHistorialDestino;
            return respuesta;
        }

        let oSaldoDestino = await cuentaModelo.actualizarSaldoById(entrada.idCuentaDestino, saldoNuevoDestino);
        if (!oSaldoDestino.estado) {
            respuesta = oSaldoDestino;
            return respuesta;
        }

        respuesta = oHistorialDestino;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - agregarCuentaHistorial', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaCuentaByEstado(entrada){
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

        let cuentas = await cuentaModelo.listaCuentaByEstado(entrada.estado, entrada.idNegocio);
        if (!cuentas.estado) {
            respuesta = cuentas;
            return respuesta;
        }

        respuesta = cuentas;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaCuentaByEstado', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaCuentaBySucursalEstado(entrada){
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

        let cuentas = await cuentaModelo.listaCuentaBySucursalEstado(entrada.idSucursal, entrada.estado, entrada.idNegocio);
        if (!cuentas.estado) {
            respuesta = cuentas;
            return respuesta;
        }

        respuesta = cuentas;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaCuentaBySucursalEstado', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaCuentaHistorialByIdCuenta(entrada){
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
        
        let oCuenta = await cuentaModelo.cuentaById(entrada.idCuenta);
        if (!oCuenta.estado) {
            respuesta = oCuenta;
            return respuesta;
        }

        if (oCuenta["data"].length == 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "La cuenta seleccionada no existe. verifique e intente nuevamente";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - listaCuentaHistorialByIdCuenta", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(oCuenta)});
            return respuesta;
        }

        let historial = await cuentaModelo.listaCuentaHistorialByIdCuenta(entrada.idCuenta, "1");
        if (!historial.estado) {
            respuesta = historial;
            return respuesta;
        }

        let totalIngreso = 0.00;
        let totalEgreso = 0.00;
        let totalSaldo = 0.00;
        for(let i=0; i<historial["data"].length; i++){
            historial["data"][i]["tipoLiteral"] = "Ingreso"
            if(historial["data"][i]["tipo"] == "0"){
                historial["data"][i]["tipoLiteral"] = "Egreso"
                historial["data"][i]["monto"] = parseFloat(historial["data"][i]["monto"])*-1;
                historial["data"][i]["montoEgreso"] = historial["data"][i]["monto"];
                historial["data"][i]["montoEgresoFormato"] = convertir.formatoMoneda(historial["data"][i]["monto"]);
                historial["data"][i]["montoIngreso"] = "0.00";
                historial["data"][i]["montoIngresoFormato"] = "";
                totalEgreso = totalEgreso + parseFloat(historial["data"][i]["monto"]);
            }else{
                historial["data"][i]["montoIngreso"] = historial["data"][i]["monto"];
                historial["data"][i]["montoIngresoFormato"] = convertir.formatoMoneda(historial["data"][i]["monto"]);
                historial["data"][i]["montoEgreso"] = "0.00";
                historial["data"][i]["montoEgresoFormato"] = "";
                totalIngreso = totalIngreso + parseFloat(historial["data"][i]["monto"]);
            }

            totalSaldo = totalSaldo + parseFloat(historial["data"][i]["monto"]);
            historial["data"][i]["saldoFormato"] = convertir.formatoMoneda(historial["data"][i]["saldo"]);
            historial["data"][i]["montoFormato"] = convertir.formatoMoneda(historial["data"][i]["monto"]);
        }

        let data = {
            "cuenta": oCuenta["data"][0],
            "historial": historial["data"],
            "totalIngreso": totalIngreso,
            "totalIngresoFormato": convertir.formatoMoneda(totalIngreso),
            "totalEgreso": totalEgreso,
            "totalEgresoFormato": convertir.formatoMoneda(totalEgreso),
            "totalSaldo": totalSaldo,
            "totalSaldoFormato": convertir.formatoMoneda(totalSaldo)
        }

        respuesta.data = data;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaCuentaHistorialByIdCuenta', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaCuentaHistorialByInCuentas(entrada){
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

        let cuentas = [];
        for (let i = 0; i < entrada.idCuentas.length; i++) {
            let oCuenta = await cuentaModelo.cuentaById(entrada.idCuentas[i]);
            if (!oCuenta.estado) {
                respuesta = oCuenta;
                return respuesta;
            }
            cuentas.push(oCuenta.data[0]);
        }

        let historial = await cuentaModelo.listaCuentaHistorialByInCuentasFechas(entrada.idCuentas, entrada.fechaInicio, entrada.fechaFin, "1");
        if (!historial.estado) {
            respuesta = historial;
            return respuesta;
        }

        let totalIngreso = 0.00;
        let totalEgreso = 0.00;
        let totalSaldo = 0.00;
        for(let i=0; i<historial["data"].length; i++){
            historial["data"][i]["tipoLiteral"] = "Ingreso"
            if(historial["data"][i]["tipo"] == "0"){
                historial["data"][i]["tipoLiteral"] = "Egreso"
                historial["data"][i]["monto"] = parseFloat(historial["data"][i]["monto"])*-1;
                historial["data"][i]["montoEgreso"] = historial["data"][i]["monto"];
                historial["data"][i]["montoEgresoFormato"] = convertir.formatoMoneda(historial["data"][i]["monto"]);
                historial["data"][i]["montoIngreso"] = "0.00";
                historial["data"][i]["montoIngresoFormato"] = "";
                totalEgreso = totalEgreso + parseFloat(historial["data"][i]["monto"]);
            }else{
                historial["data"][i]["montoIngreso"] = historial["data"][i]["monto"];
                historial["data"][i]["montoIngresoFormato"] = convertir.formatoMoneda(historial["data"][i]["monto"]);
                historial["data"][i]["montoEgreso"] = "0.00";
                historial["data"][i]["montoEgresoFormato"] = "";
                totalIngreso = totalIngreso + parseFloat(historial["data"][i]["monto"]);
            }

            totalSaldo = totalSaldo + parseFloat(historial["data"][i]["monto"]);
            historial["data"][i]["saldo"] = totalSaldo;
            historial["data"][i]["saldoFormato"] = convertir.formatoMoneda(historial["data"][i]["saldo"]);
            historial["data"][i]["montoFormato"] = convertir.formatoMoneda(historial["data"][i]["monto"]);
        }

        let data = {
            "cuentas": cuentas,
            "historial": historial["data"],
            "totalIngreso": totalIngreso,
            "totalIngresoFormato": convertir.formatoMoneda(totalIngreso),
            "totalEgreso": totalEgreso,
            "totalEgresoFormato": convertir.formatoMoneda(totalEgreso),
            "totalSaldo": totalSaldo,
            "totalSaldoFormato": convertir.formatoMoneda(totalSaldo)
        }

        respuesta.data = data;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaCuentaHistorialByInCuentas', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

//export
module.exports = {
    agregarCuenta,
    agregarCuentaHistorial,
    transferirSaldoCuentaByCuenta,

    listaCuentaByEstado,
    listaCuentaBySucursalEstado,
    listaCuentaHistorialByIdCuenta,
    listaCuentaHistorialByInCuentas
}