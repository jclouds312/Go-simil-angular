const express = require('express');
const UAParser = require('ua-parser-js');
const router = express.Router();
const logger = require('../logger').logger
const path = require('path');
const filename = path.basename(__filename);
const { getMessage, getMessageCategory } = require('../messages');
const validarCabecera = require('../libreria/validarCabecera')
const productoControlador = require('../controlador/productoControlador')
const cronologia = require("../libreria/cronologia");

router.post('/producto/agregarProducto', async (req, res) => {
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
    respuesta = await productoControlador.agregarProducto(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/producto/agregarProducto"
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
    logger.log({level: 'error', label: filename + ' - agregarProducto', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/producto/actualizarDatosProductodByid', async (req, res) => {
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
    respuesta = await productoControlador.actualizarDatosProductodByid(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/producto/actualizarDatosProductodByid"
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
    logger.log({level: 'error', label: filename + ' - actualizarDatosProductodByid', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/producto/actualizarPrecioPuntosdByid', async (req, res) => {
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
    respuesta = await productoControlador.actualizarPrecioPuntosdByid(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/producto/actualizarPrecioPuntosdByid"
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
    logger.log({level: 'error', label: filename + ' - actualizarPrecioPuntosdByid', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/producto/listaProductoByEstado', async (req, res) => {
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
    respuesta = await productoControlador.listaProductoByEstado(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/producto/listaProductoByEstado"
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
    logger.log({level: 'error', label: filename + ' - listaProductoByEstado', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/producto/listaInventarioProductoByAlmacenProducto', async (req, res) => {
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
    respuesta = await productoControlador.listaInventarioProductoByAlmacenProducto(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/producto/listaInventarioProductoByAlmacenProducto"
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
    logger.log({level: 'error', label: filename + ' - listaInventarioProductoByAlmacenProducto', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/producto/listaInventarioProductoByAlmacen', async (req, res) => {
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
    respuesta = await productoControlador.listaInventarioProductoByAlmacen(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/producto/listaInventarioProductoByAlmacen"
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
    logger.log({level: 'error', label: filename + ' - listaInventarioProductoByAlmacen', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/producto/listaInventarioProductoByProducto', async (req, res) => {
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
    respuesta = await productoControlador.listaInventarioProductoByProducto(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/producto/listaInventarioProductoByProducto"
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
    logger.log({level: 'error', label: filename + ' - listaInventarioProductoByProducto', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/producto/listaInventarioHistorialByInventario', async (req, res) => {
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
    respuesta = await productoControlador.listaInventarioHistorialByInventario(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/producto/listaInventarioHistorialByInventario"
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
    logger.log({level: 'error', label: filename + ' - listaInventarioHistorialByInventario', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/producto/listaInventarioHistorialByAlmacenProducto', async (req, res) => {
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
    respuesta = await productoControlador.listaInventarioHistorialByAlmacenProducto(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/producto/listaInventarioHistorialByAlmacenProducto"
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
    logger.log({level: 'error', label: filename + ' - listaInventarioHistorialByAlmacenProducto', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

module.exports = router;