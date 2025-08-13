const express = require('express');
const UAParser = require('ua-parser-js');
const router = express.Router();
const logger = require('../logger').logger
const path = require('path');
const filename = path.basename(__filename);
const { getMessage, getMessageCategory } = require('../messages');
const validarCabecera = require('../libreria/validarCabecera')
const traspasoControlador = require('../controlador/traspasoControlador')
const cronologia = require("../libreria/cronologia");

router.post('/traspaso/agregarTraspaso', async (req, res) => {
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
    respuesta = await traspasoControlador.agregarTraspaso(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/traspaso/agregarTraspaso"
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
    logger.log({level: 'error', label: filename + ' - agregarTraspaso', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/traspaso/traspasoById', async (req, res) => {
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
    respuesta = await traspasoControlador.traspasoById(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/traspaso/traspasoById"
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
    logger.log({level: 'error', label: filename + ' - traspasoById', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/traspaso/listaTraspasoByEstado', async (req, res) => {
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
    respuesta = await traspasoControlador.listaTraspasoByEstado(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/traspaso/listaTraspasoByEstado"
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
    logger.log({level: 'error', label: filename + ' - listaTraspasoByEstado', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/traspaso/listaTraspasoByOrigen', async (req, res) => {
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
    respuesta = await traspasoControlador.listaTraspasoByOrigen(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/traspaso/listaTraspasoByOrigen"
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
    logger.log({level: 'error', label: filename + ' - listaTraspasoByOrigen', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/traspaso/documentoPdfTraspasoById', async (req, res) => {
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
    respuesta = await traspasoControlador.documentoPdfTraspasoById(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/traspaso/documentoPdfTraspasoById"
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
    logger.log({level: 'error', label: filename + ' - documentoPdfTraspasoById', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

module.exports = router;