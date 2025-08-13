const express = require('express');
const UAParser = require('ua-parser-js');
const router = express.Router();
const logger = require('../logger').logger
const path = require('path');
const filename = path.basename(__filename);
const { getMessage, getMessageCategory } = require('../messages');
const validarCabecera = require('../libreria/validarCabecera')
const usuarioControlador = require('../controlador/usuarioControlador')
const cronologia = require("../libreria/cronologia");

router.post('/usuario/agregarUsuario', async (req, res) => {
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
    respuesta = await usuarioControlador.agregarUsuario(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/usuario/agregarUsuario"
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
    logger.log({level: 'error', label: filename + ' - agregarUsuario', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/usuario/agregarUsuarioSucursal', async (req, res) => {
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
    respuesta = await usuarioControlador.agregarUsuarioSucursal(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/usuario/agregarUsuarioSucursal"
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
    logger.log({level: 'error', label: filename + ' - agregarUsuarioSucursal', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/usuario/actualizarUsuarioById', async (req, res) => {
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
    respuesta = await usuarioControlador.actualizarUsuarioById(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/usuario/actualizarUsuarioById"
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
    logger.log({level: 'error', label: filename + ' - actualizarUsuarioById', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/usuario/actualizarEstadoById', async (req, res) => {
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
    respuesta = await usuarioControlador.actualizarEstadoById(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/usuario/actualizarEstadoById"
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

router.post('/usuario/actualizarSucursalEstadoById', async (req, res) => {
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
    respuesta = await usuarioControlador.actualizarSucursalEstadoById(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/usuario/actualizarSucursalEstadoById"
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
    logger.log({level: 'error', label: filename + ' - actualizarSucursalEstadoById', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/usuario/actualizarPasswordById', async (req, res) => {
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
    respuesta = await usuarioControlador.actualizarPasswordById(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/usuario/actualizarPasswordById"
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
    logger.log({level: 'error', label: filename + ' - actualizarPasswordById', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/usuario/actualizarUsuarioLoginById', async (req, res) => {
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
    respuesta = await usuarioControlador.actualizarUsuarioLoginById(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/usuario/actualizarUsuarioLoginById"
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
    logger.log({level: 'error', label: filename + ' - actualizarUsuarioLoginById', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/usuario/usuarioByUsuarioPassword', async (req, res) => {
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
    respuesta = await usuarioControlador.usuarioByUsuarioPassword(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/usuario/usuarioByUsuarioPassword"
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
    logger.log({level: 'error', label: filename + ' - usuarioByUsuarioPassword', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/usuario/usuarioLoginByIdLogin', async (req, res) => {
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
    respuesta = await usuarioControlador.usuarioLoginByIdLogin(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/usuario/usuarioLoginByIdLogin"
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
    logger.log({level: 'error', label: filename + ' - usuarioLoginByIdLogin', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/usuario/agregarUsuarioSucursal', async (req, res) => {
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
    respuesta = await usuarioControlador.agregarUsuarioSucursal(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/usuario/agregarUsuarioSucursal"
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
    logger.log({level: 'error', label: filename + ' - agregarUsuarioSucursal', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/usuario/listaUsuariosByEstado', async (req, res) => {
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
    respuesta = await usuarioControlador.listaUsuariosByEstado(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/usuario/listaUsuariosByEstado"
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
    logger.log({level: 'error', label: filename + ' - listaUsuariosByEstado', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

router.post('/usuario/listaSucursalByUsuario', async (req, res) => {
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
    respuesta = await usuarioControlador.listaSucursalByUsuario(req.body);
    await cronologia.agregarCronologia(
      req.body.idLogin,
      req.body.token,
      req.body.dispositivo,
      clientIP,
      req.body,
      respuesta,
      "/usuario/listaSucursalByUsuario"
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
    logger.log({level: 'error', label: filename + ' - listaSucursalByUsuario', message: JSON.stringify(respuesta) + " || parametros: " + req.body});
    respuesta.mensaje = getMessageCategory("proceso", "nivelRuta", "error", "mensaje");
    return res.status(500).json(respuesta);
  }
});

module.exports = router;