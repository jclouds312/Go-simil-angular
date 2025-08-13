const logger = require('../logger').logger
const path = require('path');
const filename = path.basename(__filename);
const PdfPrinter = require('pdfmake');
const fonts = require('../libreria/fonts');
const libFecha = require('../libreria/libFecha');
const { getMessage, getMessageCategory } = require('../messages');
const otp = require('../libreria/otp.js');
const config = require('../../config.js');
const usuarioControlador = require('./usuarioControlador');
const whatsappClient = require('../apiclient/whatsappClient.js');
const clienteModelo = require('../modelo/clienteModelo');
const traspasoModelo = require('../modelo/traspasoModelo.js');
const ventaModelo = require('../modelo/ventaModelo.js');
const traspasoControlador = require('../controlador/traspasoControlador.js');
const ventaControlador = require('../controlador/ventaControlador.js');

async function agregarCliente(entrada){
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

        let oCelular = await clienteModelo.clienteByCelular(entrada.celular);
        if (!oCelular.estado) {
            respuesta = oCelular;
            return respuesta;
        }

        if (oCelular["data"].length > 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "Ya existe un cliente con el celular registrado, verifique e intente nuevamente.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - agregarCliente", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(oCelular)});
            return respuesta;
        }

        let oCliente = await clienteModelo.agregarCliente(entrada.codigo, entrada.ci, entrada.complemento, entrada.tipo, entrada.nombre, entrada.appat, entrada.apmat, entrada.fechaNacimiento, entrada.genero, entrada.celular, entrada.email, entrada.usuario, entrada.password, entrada.idNegocio);
        if (!oCliente.estado) {
            respuesta = oCliente;
            return respuesta;
        }

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - agregarCliente', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function enviarDocumentoYOtpTraspasoById(entrada){
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

        let cliente = await clienteModelo.clienteById(entrada.idCliente);
        if (!cliente.estado) {
            respuesta = cliente;
            return respuesta;
        }

        if (cliente["data"].length == 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "No se encontró el cliente. Verifica los datos e inténtalo nuevamente.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - enviarDocumentoYOtpTraspasoById", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(cliente)});
            return respuesta;
        }

        let documento = await traspasoControlador.documentoPdfTraspasoById(entrada);
        if (!documento.estado) {
            respuesta = documento;
            return respuesta;
        }

        let param;
        let oEnvio;
        let mensaje = ""
        let codigoGenerado = "";
        let link = `${config.OTP_CLIENTE_URL}/cliente/otp/traspaso/${entrada.idCliente}/${entrada.idTraspaso}`;
        let numeros = [];
        numeros.push(parseInt(cliente["data"][0]["celular"]));

        if(documento["data"]["firmado"] == "0"){
            let codigoGenerado = otp.generaCodigoOtp();

            let oOtp = await clienteModelo.agregarClienteOtp(entrada.idCliente, codigoGenerado, "0000", entrada.detalle, fecha, hora);
            if (!oOtp.estado) {
                respuesta = oOtp;
                return respuesta;
            }

            mensaje = "*CODIGO OTP 4LIFE*" 
            + "\n"
            + "Su codigo de OTP para confirmar el traspaso es: *" + codigoGenerado + "*. "
            + "Porfavor ingrese al siguiente link " + link + " e introzca el codigo OTP recibido.";+ "\n"
            param = {
                "numeros": numeros,
                "mensaje": mensaje
            }
            oEnvio = await whatsappClient.enviarMensajeANumeros(param);
            if (!oEnvio.estado) {
                respuesta = oEnvio;
                return respuesta;
            }


            mensaje = "_Es necesario que ingrese el codigo OTP para confirmar la recepción de los productos_"
            param = {
                "numeros": numeros,
                "mensaje": mensaje
            }
            oEnvio = await whatsappClient.enviarMensajeANumeros(param);
            if (!oEnvio.estado) {
                respuesta = oEnvio;
                return respuesta;
            }
        }

        mensaje = "*DOCUMENTO DE TRASPASO - NRO.: " + entrada.idTraspaso +"*"
        param = {
            "numeros": numeros,
            "mensaje": mensaje
        }
        oEnvio = await whatsappClient.enviarMensajeANumeros(param);
        if (!oEnvio.estado) {
            respuesta = oEnvio;
            return respuesta;
        }

        param = {
            "numeros": numeros,
            "nombrePdf": documento["data"]["documentoNombre"],
            "pdfData": documento["data"]["documentoBase64"]
        }
        oEnvio = await whatsappClient.enviarPdfANumeros(param);
        if (!oEnvio.estado) {
            respuesta = oEnvio;
            return respuesta;
        }
        respuesta.data = {
            "otp": codigoGenerado
        }

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - enviarDocumentoYOtpTraspasoById', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function enviarDocumentoYOtpVentaById(entrada){
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

        let cliente = await clienteModelo.clienteById(entrada.idCliente);
        if (!cliente.estado) {
            respuesta = cliente;
            return respuesta;
        }

        if (cliente["data"].length == 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "No se encontró el cliente. Verifica los datos e inténtalo nuevamente.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - enviarDocumentoYOtpVentaById", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(cliente)});
            return respuesta;
        }

        let documento = await ventaControlador.documentoPdfVentaById(entrada);
        if (!documento.estado) {
            respuesta = documento;
            return respuesta;
        }

        let param;
        let oEnvio;
        let mensaje = ""
        let codigoGenerado = "";
        let link = `${config.OTP_CLIENTE_URL}/cliente/otp/venta/${entrada.idCliente}/${entrada.idVenta}`;
        let numeros = [];
        let numerosCopia = [];
        numeros.push(parseInt(cliente["data"][0]["celular"]));
        numerosCopia.push(parseInt(oLogin["data"]["usuario"]["celularUsuario"]));

        if(documento["data"]["firmado"] == "0"){
            let codigoGenerado = otp.generaCodigoOtp();

            let oOtp = await clienteModelo.agregarClienteOtp(entrada.idCliente, codigoGenerado, "0000", entrada.detalle, fecha, hora);
            if (!oOtp.estado) {
                respuesta = oOtp;
                return respuesta;
            }

            mensaje = "*CODIGO OTP 4LIFE*" 
            + "\n"
            + "Su codigo de OTP para confirmar la venta es: *" + codigoGenerado + "*. "
            + "Porfavor ingrese al siguiente link " + link + " e introzca el codigo OTP recibido.";+ "\n"
            param = {
                "numeros": numeros,
                "mensaje": mensaje
            }
            oEnvio = await whatsappClient.enviarMensajeANumeros(param);
            if (!oEnvio.estado) {
                respuesta = oEnvio;
                return respuesta;
            }


            mensaje = "_Es necesario que ingrese el codigo OTP para confirmar la recepción de los productos_"
            param = {
                "numeros": numeros,
                "mensaje": mensaje
            }
            oEnvio = await whatsappClient.enviarMensajeANumeros(param);
            if (!oEnvio.estado) {
                respuesta = oEnvio;
                return respuesta;
            }

            mensaje = `Se envio el mensaje de OTP para la firma del cliente ${cliente["data"][0]["nombre"]} ${cliente["data"][0]["appat"]} ${cliente["data"][0]["apmat"]}, al numero de whatsapp: ${cliente["data"][0]["celular"]}`
            param = {
                "numeros": numerosCopia,
                "mensaje": mensaje
            }
            oEnvio = await whatsappClient.enviarMensajeANumeros(param);
            if (!oEnvio.estado) {
                respuesta = oEnvio;
                return respuesta;
            }
        }

        mensaje = "*DOCUMENTO DE VENTA - NRO.: " + entrada.idVenta +"*"
        param = {
            "numeros": numeros,
            "mensaje": mensaje
        }
        oEnvio = await whatsappClient.enviarMensajeANumeros(param);
        if (!oEnvio.estado) {
            respuesta = oEnvio;
            return respuesta;
        }

        param = {
            "numeros": numerosCopia,
            "mensaje": mensaje
        }
        oEnvio = await whatsappClient.enviarMensajeANumeros(param);
        if (!oEnvio.estado) {
            respuesta = oEnvio;
            return respuesta;
        }

        param = {
            "numeros": numeros,
            "nombrePdf": documento["data"]["documentoNombre"],
            "pdfData": documento["data"]["documentoBase64"]
        }
        oEnvio = await whatsappClient.enviarPdfANumeros(param);
        if (!oEnvio.estado) {
            respuesta = oEnvio;
            return respuesta;
        }

        param = {
            "numeros": numerosCopia,
            "nombrePdf": documento["data"]["documentoNombre"],
            "pdfData": documento["data"]["documentoBase64"]
        }
        oEnvio = await whatsappClient.enviarPdfANumeros(param);
        if (!oEnvio.estado) {
            respuesta = oEnvio;
            return respuesta;
        }

        respuesta.data = {
            "otp": codigoGenerado
        }

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - enviarDocumentoYOtpVentaById', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function validarOTP(entrada){
    let data = [];
    let codigo = getMessageCategory("proceso", "nivelControlador", "correcto", "codigo");
    let estado = true;
    let mensaje = getMessageCategory("proceso", "nivelControlador", "correcto", "mensaje");
    let respuesta = {data, codigo, estado, mensaje}

    try{
        const {fecha , hora} = await libFecha.fechaHoraActualyymmdd();
        
        let cliente = await clienteModelo.clienteById(entrada.idCliente);
        if (!cliente.estado) {
            respuesta = cliente;
            return respuesta;
        }

        if (cliente["data"].length == 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "No se encontró el cliente. Verifica los datos e inténtalo nuevamente.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - clienteById", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(cliente)});
            return respuesta;
        }

        let otp = await clienteModelo.ultimoOtpGeneradoByCliente(entrada.idCliente, "1");
        if (!otp.estado) {
            respuesta = otp;
            return respuesta;
        }

        if (otp["data"].length == 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "El OTP que ingreso no es correcto o no existe para el cliente. Verifica los datos e inténtalo nuevamente.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - validarOTP", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(otp)});
            return respuesta;
        }

        if (otp["data"][0]["otpRecibido"] != "0000") {
            respuesta.codigo = "2";
            respuesta.estado = false;
            respuesta.mensaje = "El OTP que ingreso ya fue validado. No tiene documentos que validar.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - validarOTP", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(otp)});
            return respuesta;
        }

        if (otp["data"][0]["otpGenerado"] != entrada.otp) {
            respuesta.codigo = "3";
            respuesta.estado = false;
            respuesta.mensaje = "El OTP que ingreso no es correcto. Verifica los datos e inténtalo nuevamente.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - validarOTP", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(otp)});
            return respuesta;
        }

        let oAgregar = await clienteModelo.actualizarOtpRecibidoById(entrada.otp, fecha, hora, otp["data"][0]["idClienteOtp"]);
        if (!oAgregar.estado) {
            respuesta = oAgregar;
            return respuesta;
        }

        let documento;
        let mensajeDocumento;
        if(entrada.tipo == "traspaso"){
            let oActualizar = await traspasoModelo.actualizarFirmaById("1", otp["data"][0]["idClienteOtp"], entrada.idTraspaso);
            if (!oActualizar.estado) {
                respuesta = oActualizar;
                return respuesta;
            }

            documento = await traspasoControlador.documentoPdfTraspasoById(entrada);
            if (!documento.estado) {
                respuesta = documento;
                return respuesta;
            }

            mensajeDocumento = `*DOCUMENTO DE TRASPASO - NRO.: ${entrada.idTraspaso}*`
        }

        if(entrada.tipo == "venta"){
            let oActualizar = await ventaModelo.actualizarFirmaById("1", otp["data"][0]["idClienteOtp"], entrada.idVenta);
            if (!oActualizar.estado) {
                respuesta = oActualizar;
                return respuesta;
            }

            documento = await ventaControlador.documentoPdfVentaById(entrada);
            if (!documento.estado) {
                respuesta = documento;
                return respuesta;
            }
            mensajeDocumento = `*DOCUMENTO DE VENTA - NRO.: ${entrada.idVenta}*`
        }

        let numeros = [];
        let numerosCopia = [];
        numeros.push(parseInt(cliente["data"][0]["celular"]));
        numerosCopia.push(parseInt(oLogin["data"]["usuario"]["celularUsuario"]));

        mensaje = `Gracias por firmar el documento. He registrado tu firma electrónica correctamente mediante el *código OTP: ${entrada.otp}*`;
        param = {
            "numeros": numeros,
            "mensaje": mensaje
        }
        oEnvio = await whatsappClient.enviarMensajeANumeros(param);
        if (!oEnvio.estado) {
            respuesta = oEnvio;
            return respuesta;
        }

        mensaje = `El cliente ${cliente["data"][0]["nombre"]} ${cliente["data"][0]["appat"]} ${cliente["data"][0]["apmat"]} ha firmado con correctamente el documento`;
        param = {
            "numeros": numeros,
            "mensaje": mensaje
        }
        oEnvio = await whatsappClient.enviarMensajeANumeros(param);
        if (!oEnvio.estado) {
            respuesta = oEnvio;
            return respuesta;
        }

        param = {
            "numeros": numeros,
            "mensaje": mensajeDocumento
        }
        oEnvio = await whatsappClient.enviarMensajeANumeros(param);
        if (!oEnvio.estado) {
            respuesta = oEnvio;
            return respuesta;
        }

        param = {
            "numeros": numerosCopia,
            "mensaje": mensajeDocumento
        }
        oEnvio = await whatsappClient.enviarMensajeANumeros(param);
        if (!oEnvio.estado) {
            respuesta = oEnvio;
            return respuesta;
        }

        param = {
            "numeros": numeros,
            "nombrePdf": documento["data"]["documentoNombre"],
            "pdfData": documento["data"]["documentoBase64"]
        }
        oEnvio = await whatsappClient.enviarPdfANumeros(param);
        if (!oEnvio.estado) {
            respuesta = oEnvio;
            return respuesta;
        }

        param = {
            "numeros": numerosCopia,
            "nombrePdf": documento["data"]["documentoNombre"],
            "pdfData": documento["data"]["documentoBase64"]
        }
        oEnvio = await whatsappClient.enviarPdfANumeros(param);
        if (!oEnvio.estado) {
            respuesta = oEnvio;
            return respuesta;
        }

        respuesta = oAgregar;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - validarOTP', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function actualizarClienteById(entrada){
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
        
        let clientes = await clienteModelo.clienteById(entrada.idCliente);
        if (!clientes.estado) {
            respuesta = clientes;
            return respuesta;
        }

        if (clientes["data"].length == 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "No se encontró el cliente. Verifica los datos e inténtalo nuevamente.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - clienteById", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(clientes)});
            return respuesta;
        }

        let oCelular = await clienteModelo.clienteByCelular(entrada.celular, entrada.idNegocio);
        if (!oCelular.estado) {
            respuesta = oCelular;
            return respuesta;
        }

        if(clientes["data"][0]["ci"] != entrada.ci){
            if (oCelular["data"].length > 0) {
                respuesta.codigo = "2";
                respuesta.estado = false;
                respuesta.mensaje = "Ya existe un cliente con el celular registrado, verifique e intente nuevamente.";
                respuesta.data = [];
                logger.log({level: "info", label: filename + " - actualizarClienteById", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(oCelular)});
                return respuesta;
            }
        }

        let cliente = await clienteModelo.actualizarClienteById(entrada.codigo, entrada.ci, entrada.complemento, entrada.razonSocial, entrada.tipo, entrada.nombre, entrada.appat, entrada.apmat, entrada.fechaNacimiento, entrada.genero, entrada.celular, entrada.email, entrada.idCliente);
        if (!cliente.estado) {
            respuesta = cliente;
            return respuesta;
        }

        respuesta = cliente;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - clienteById', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function clienteById(entrada){
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
        
        let clientes = await clienteModelo.clienteById(entrada.idCliente);
        if (!clientes.estado) {
            respuesta = clientes;
            return respuesta;
        }

        if (clientes["data"].length == 0) {
            respuesta.codigo = "1";
            respuesta.estado = false;
            respuesta.mensaje = "No se encontró el cliente. Verifica los datos e inténtalo nuevamente.";
            respuesta.data = [];
            logger.log({level: "info", label: filename + " - clienteById", message: " || Request:" + JSON.stringify(entrada) + " || Response:" + JSON.stringify(clientes)});
            return respuesta;
        }

        clientes["data"] = clientes["data"][0]
        
        respuesta = clientes;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - clienteById', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

async function listaClientesByEstado(entrada){
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
        
        let clientes = await clienteModelo.listaClientesByEstado(entrada.estado, entrada.idNegocio);
        if (!clientes.estado) {
            respuesta = clientes;
            return respuesta;
        }

        respuesta = clientes;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - listaClientesByEstado', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

//export
module.exports = {
    agregarCliente,

    actualizarClienteById,
    
    clienteById,
    validarOTP,

    listaClientesByEstado,

    enviarDocumentoYOtpTraspasoById,
    enviarDocumentoYOtpVentaById,
    
}