const express = require('express');
const UAParser = require('ua-parser-js');
const router = express.Router();
const logger = require('../logger').logger
const path = require('path');
const filename = path.basename(__filename);
const { getMessage, getMessageCategory } = require('../messages');
const validarCabecera = require('../libreria/validarCabecera')
const almacenControlador = require('../controlador/almacenControlador')
const cronologia = require("../libreria/cronologia");

router.post('/almacen/agregarAlmacen', async (req, res) => {
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
    respuesta = await almacenControlador.agregarAlmacen(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/almacen/agregarAlmacen"
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
    logger.log({level: 'error', label: filename + ' - agregarAlmacen', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/almacen/actualizarAlmacenById', async (req, res) => {
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
    respuesta = await almacenControlador.actualizarAlmacenById(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/almacen/actualizarAlmacenById"
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
    logger.log({level: 'error', label: filename + ' - actualizarAlmacenById', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/almacen/actualizarEstadoById', async (req, res) => {
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
    respuesta = await almacenControlador.actualizarEstadoById(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/almacen/actualizarEstadoById"
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
    logger.log({level: 'error', label: filename + ' - actualizarEstadoById', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/almacen/almacenById', async (req, res) => {
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
    respuesta = await almacenControlador.almacenById(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/almacen/almacenById"
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
    logger.log({level: 'error', label: filename + ' - almacenById', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/almacen/listaAlmacenByEstado', async (req, res) => {
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
    respuesta = await almacenControlador.listaAlmacenByEstado(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/almacen/listaAlmacenByEstado"
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
    logger.log({level: 'error', label: filename + ' - listaAlmacenByEstado', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

module.exports = router;