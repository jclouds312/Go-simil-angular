const express = require('express');
const UAParser = require('ua-parser-js');
const router = express.Router();
const logger = require('../logger').logger
const path = require('path');
const filename = path.basename(__filename);
const { getMessage, getMessageCategory } = require('../messages');
const validarCabecera = require('../libreria/validarCabecera')
const clienteControlador = require('../controlador/clienteControlador')
const cronologia = require("../libreria/cronologia");

router.post('/cliente/agregarCliente', async (req, res) => {
  let data = [];
  let codigo = getMessage("validacion", "error", "codigo");
  let estado = false;
  let mensaje = getMessage("validacion", "error", "mensaje");
  let respuesta = {data, codigo, estado, mensaje}

  try{
    const dispositivoInfo = new UAParser(req.headers['user-agent']);
    const clientIP = req.ip || req.connection.remoteAddress;

    const { token } = req.body;

    const valCabecera = await validarCabecera.validar(token, dispositivoInfo, clientIP);
    if (!valCabecera.estado) {
      return res.status(401).json(valCabecera);
    }

    req.body.dispositivo = `${valCabecera["data"]["dispositivo"]}`;
    respuesta = await clienteControlador.agregarCliente(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/cliente/agregarCliente"
    );
    
    if(parseInt(respuesta.codigo) >= 0){
      return res.status(200).json(respuesta);
    }

    if(parseInt(respuesta.codigo) < 0){
      return res.status(500).json(respuesta);
    }

  }catch(error){
    data = [];
    codigo = getMessageCategory("proceso", "nivelRuta", "error", "codigo");
    estado = false;
    mensaje = error.stack;
    respuesta = {data, codigo, estado, mensaje}
    logger.log({level: 'error', label: filename + ' - agregarCliente', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/cliente/actualizarClienteById', async (req, res) => {
  let data = [];
  let codigo = getMessage("validacion", "error", "codigo");
  let estado = false;
  let mensaje = getMessage("validacion", "error", "mensaje");
  let respuesta = {data, codigo, estado, mensaje}

  try{
    const dispositivoInfo = new UAParser(req.headers['user-agent']);
    const clientIP = req.ip || req.connection.remoteAddress;

    const { token } = req.body;

    const valCabecera = await validarCabecera.validar(token, dispositivoInfo, clientIP);
    if (!valCabecera.estado) {
      return res.status(401).json(valCabecera);
    }

    req.body.dispositivo = `${valCabecera["data"]["dispositivo"]}`;
    respuesta = await clienteControlador.actualizarClienteById(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/cliente/actualizarClienteById"
    );
    
    if(parseInt(respuesta.codigo) >= 0){
      return res.status(200).json(respuesta);
    }

    if(parseInt(respuesta.codigo) < 0){
      return res.status(500).json(respuesta);
    }

  }catch(error){
    data = [];
    codigo = getMessageCategory("proceso", "nivelRuta", "error", "codigo");
    estado = false;
    mensaje = error.stack;
    respuesta = {data, codigo, estado, mensaje}
    logger.log({level: 'error', label: filename + ' - actualizarClienteById', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/cliente/clienteById', async (req, res) => {
  let data = [];
  let codigo = getMessage("validacion", "error", "codigo");
  let estado = false;
  let mensaje = getMessage("validacion", "error", "mensaje");
  let respuesta = {data, codigo, estado, mensaje}

  try{
    const dispositivoInfo = new UAParser(req.headers['user-agent']);
    const clientIP = req.ip || req.connection.remoteAddress;

    const { token } = req.body;

    const valCabecera = await validarCabecera.validar(token, dispositivoInfo, clientIP);
    if (!valCabecera.estado) {
      return res.status(401).json(valCabecera);
    }

    req.body.dispositivo = `${valCabecera["data"]["dispositivo"]}`;
    respuesta = await clienteControlador.clienteById(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/cliente/clienteById"
    );
    
    if(parseInt(respuesta.codigo) >= 0){
      return res.status(200).json(respuesta);
    }

    if(parseInt(respuesta.codigo) < 0){
      return res.status(500).json(respuesta);
    }

  }catch(error){
    data = [];
    codigo = getMessageCategory("proceso", "nivelRuta", "error", "codigo");
    estado = false;
    mensaje = error.stack;
    respuesta = {data, codigo, estado, mensaje}
    logger.log({level: 'error', label: filename + ' - clienteById', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/cliente/listaClientesByEstado', async (req, res) => {
  let data = [];
  let codigo = getMessage("validacion", "error", "codigo");
  let estado = false;
  let mensaje = getMessage("validacion", "error", "mensaje");
  let respuesta = {data, codigo, estado, mensaje}

  try{
    const dispositivoInfo = new UAParser(req.headers['user-agent']);
    const clientIP = req.ip || req.connection.remoteAddress;

    const { token } = req.body;

    const valCabecera = await validarCabecera.validar(token, dispositivoInfo, clientIP);
    if (!valCabecera.estado) {
      return res.status(401).json(valCabecera);
    }

    req.body.dispositivo = `${valCabecera["data"]["dispositivo"]}`;
    respuesta = await clienteControlador.listaClientesByEstado(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/cliente/listaClientesByEstado"
    );
    
    if(parseInt(respuesta.codigo) >= 0){
      return res.status(200).json(respuesta);
    }

    if(parseInt(respuesta.codigo) < 0){
      return res.status(500).json(respuesta);
    }

  }catch(error){
    data = [];
    codigo = getMessageCategory("proceso", "nivelRuta", "error", "codigo");
    estado = false;
    mensaje = error.stack;
    respuesta = {data, codigo, estado, mensaje}
    logger.log({level: 'error', label: filename + ' - listaClientesByEstado', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/cliente/enviarDocumentoYOtpTraspasoById', async (req, res) => {
  let data = [];
  let codigo = getMessage("validacion", "error", "codigo");
  let estado = false;
  let mensaje = getMessage("validacion", "error", "mensaje");
  let respuesta = {data, codigo, estado, mensaje}

  try{
    const dispositivoInfo = new UAParser(req.headers['user-agent']);
    const clientIP = req.ip || req.connection.remoteAddress;

    const { token } = req.body;

    const valCabecera = await validarCabecera.validar(token, dispositivoInfo, clientIP);
    if (!valCabecera.estado) {
      return res.status(401).json(valCabecera);
    }

    req.body.dispositivo = `${valCabecera["data"]["dispositivo"]}`;
    respuesta = await clienteControlador.enviarDocumentoYOtpTraspasoById(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/cliente/enviarDocumentoYOtpTraspasoById"
    );
    
    if(parseInt(respuesta.codigo) >= 0){
      return res.status(200).json(respuesta);
    }

    if(parseInt(respuesta.codigo) < 0){
      return res.status(500).json(respuesta);
    }

  }catch(error){
    data = [];
    codigo = getMessageCategory("proceso", "nivelRuta", "error", "codigo");
    estado = false;
    mensaje = error.stack;
    respuesta = {data, codigo, estado, mensaje}
    logger.log({level: 'error', label: filename + ' - enviarDocumentoYOtpTraspasoById', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/cliente/enviarDocumentoYOtpVentaById', async (req, res) => {
  let data = [];
  let codigo = getMessage("validacion", "error", "codigo");
  let estado = false;
  let mensaje = getMessage("validacion", "error", "mensaje");
  let respuesta = {data, codigo, estado, mensaje}

  try{
    const dispositivoInfo = new UAParser(req.headers['user-agent']);
    const clientIP = req.ip || req.connection.remoteAddress;

    const { token } = req.body;

    const valCabecera = await validarCabecera.validar(token, dispositivoInfo, clientIP);
    if (!valCabecera.estado) {
      return res.status(401).json(valCabecera);
    }

    req.body.dispositivo = `${valCabecera["data"]["dispositivo"]}`;
    respuesta = await clienteControlador.enviarDocumentoYOtpVentaById(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/cliente/enviarDocumentoYOtpVentaById"
    );
    
    if(parseInt(respuesta.codigo) >= 0){
      return res.status(200).json(respuesta);
    }

    if(parseInt(respuesta.codigo) < 0){
      return res.status(500).json(respuesta);
    }

  }catch(error){
    data = [];
    codigo = getMessageCategory("proceso", "nivelRuta", "error", "codigo");
    estado = false;
    mensaje = error.stack;
    respuesta = {data, codigo, estado, mensaje}
    logger.log({level: 'error', label: filename + ' - enviarDocumentoYOtpVentaById', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/cliente/validarOTP', async (req, res) => {
  let data = [];
  let codigo = getMessage("validacion", "error", "codigo");
  let estado = false;
  let mensaje = getMessage("validacion", "error", "mensaje");
  let respuesta = {data, codigo, estado, mensaje}

  try{
    const dispositivoInfo = new UAParser(req.headers['user-agent']);
    const clientIP = req.ip || req.connection.remoteAddress;

    const { token } = req.body;

    const valCabecera = await validarCabecera.validar(token, dispositivoInfo, clientIP);
    if (!valCabecera.estado) {
      return res.status(401).json(valCabecera);
    }

    req.body.dispositivo = `${valCabecera["data"]["dispositivo"]}`;
    respuesta = await clienteControlador.validarOTP(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/cliente/validarOTP"
    );
    
    if(parseInt(respuesta.codigo) >= 0){
      return res.status(200).json(respuesta);
    }

    if(parseInt(respuesta.codigo) < 0){
      return res.status(500).json(respuesta);
    }

  }catch(error){
    data = [];
    codigo = getMessageCategory("proceso", "nivelRuta", "error", "codigo");
    estado = false;
    mensaje = error.stack;
    respuesta = {data, codigo, estado, mensaje}
    logger.log({level: 'error', label: filename + ' - validarOTP', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

module.exports = router;