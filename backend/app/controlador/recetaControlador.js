const logger = require('../logger').logger
const path = require('path');
const filename = path.basename(__filename);
const libFecha = require('../libreria/libFecha');
const { getMessage, getMessageCategory } = require('../messages');
const convertir = require('../libreria/convertir.js');
const usuarioControlador = require('./usuarioControlador');
const usuarioModelo = require('../modelo/usuarioModelo');
const negocioModelo = require('../modelo/negocioModelo');
const recetaModelo = require('../modelo/recetaModelo');
const ventaModelo = require('../modelo/ventaModelo');

const reporte = require('../reporte/componentes.js');
const recetaDetalleReporte = require('../reporte/recetaDetalleReporte.js');

async function agregarReceta(entrada){
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

        let oAgregar = await recetaModelo.agregarReceta(entrada.cilindroDer, entrada.esferaDer, entrada.ejeDer, entrada.cilindroIzq, entrada.esferaIzq, entrada.ejeIzq, entrada.material, entrada.tratamiento, entrada.idNegocio, entrada.addDer, entrada.addIzq, entrada.ao, entrada.dip, entrada.armazon, entrada.bifocal);
        if (!oAgregar.estado) {
            respuesta = oAgregar;
            return respuesta;
        }

        let idReceta = oAgregar["data"]["idReceta"];

        let oActualizar = await ventaModelo.actualizarRecetaById(idReceta, entrada.idVenta);
        if (!oActualizar.estado) {
            respuesta = oActualizar;
            return respuesta;
        }

        respuesta = oAgregar;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - agregarReceta', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function recetaById(entrada){
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
        
        let receta = await recetaModelo.recetaById(entrada.idReceta, entrada.estado);
        if (!receta.estado) {
            respuesta = receta;
            return respuesta;
        }
        /* APLICA PARA SABER DESCUENTO TOTAL
        let ventaDetalle = await ventaModelo.ventaDetalleById(entrada.idVenta, entrada.estado);
        if (!ventaDetalle.estado) {
            respuesta = ventaDetalle;
            return respuesta;
        }

        let totalDescuento = 0.00;
        for(let i=0; i<ventaDetalle["data"].length; i++){
            if(ventaDetalle["data"][i]["venta"] != "1"){
                let descuento = (parseFloat(ventaDetalle["data"][i]["venta"]) - parseFloat(ventaDetalle["data"][i]["descuento"])) * parseInt(ventaDetalle["data"][i]["cantidad"]);
                totalDescuento = totalDescuento + parseFloat(descuento);
            }
        }*/

        receta["data"] = receta["data"][0]
        receta["data"]["idVenta"] = entrada.idVenta
        respuesta = receta;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - recetaById', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function documentoPdfRecetaById(entrada){
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

        let oData = await recetaById(entrada);
        if (!oData.estado) {
            respuesta = oData;
            return respuesta;
        }
        oData = oData.data

        let documentoData = await recetaDetalleReporte.recetaDetalle(oData);
        if (!documentoData.estado) {
            respuesta = documentoData;
            return respuesta;
        }

        let documentoBase64 = await reporte.generarPdfBase64(documentoData.data);
        let documentoNombre = `reporte_receta_${entrada.idVenta}_${fecha}_${hora.replace(":", "")}.pdf`;

        respuesta.data = {
            "documentoBase64": documentoBase64,
            "documentoNombre": documentoNombre
        };

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - documentoPdfRecetaById', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}


//export
module.exports = {
    agregarReceta,

    recetaById,

    documentoPdfRecetaById
}