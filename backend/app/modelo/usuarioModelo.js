const { getPool } = require("../config/database");
const logger = require("../logger").logger;
const path = require("path");
const filename = path.basename(__filename);
const { getMessage, getMessageCategory } = require('../messages');

async function agregarUsuario(idRol, ci, complemento, nombre, appat, apmat, fechaNacimiento, genero, celular, email, usuario, password, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado
    let idGenerado = Date.now();
    const values = [idGenerado, idRol, ci, complemento, nombre, appat, apmat, fechaNacimiento, genero, celular, email, usuario, password, 1, "", "", "", "", "", "", "", "", "", "sin_imagen_usuario.jpg", idNegocio];

    var sql = `
      INSERT INTO usuario(id, idRol, ci, complemento, nombre, appat, apmat, fechaNacimiento, genero, celular, email, usuario, password, estado, ciudad, zona, barrio, avenida, calle, casa, referencia, latitud, longitud, imagen, idNegocio)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
    `;

    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]
    respuesta.data["idUsuario"] = idGenerado;

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - agregarUsuario', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - agregarUsuario', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function agregarUsuarioSucursal(idUsuario, idSucursal, fecha, hora, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado
    let idGenerado = Date.now();
    const values = [idGenerado, idUsuario, idSucursal, fecha, hora, "1", idNegocio];

    var sql = `
      INSERT INTO usuarioSucursal(id, idUsuario, idSucursal, fecha, hora, estado, idNegocio)
      VALUES(?,?,?,?,?,?,?);
    `;

    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]
    respuesta.data["idUsuarioSucursal"] = idGenerado;

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - agregarUsuarioSucursal', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - agregarUsuarioSucursal', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}


async function agregarLoginUsuario(idUsuario, dispositivo, observacionInicio, fechaInicio, horaInicio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado
    let idGenerado = Date.now();
    const values = [idGenerado, idUsuario, dispositivo, observacionInicio, fechaInicio, horaInicio, "1"];

    var sql = `
      INSERT INTO loginUsuario(id, idUsuario, dispositivo, observacionInicio, fechaInicio, horaInicio, estado) 
      VALUES(?, ?, ?, ?, ?, ?, ?)
    `;

    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]
    respuesta.data["idLogin"] = idGenerado;

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - agregarLoginUsuario', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - agregarLoginUsuario', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function agregarSeguimientoUsuario(idUsuario, dispositivo, accion, data, fecha, hora) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado
    const values = [idUsuario, dispositivo, accion, data, fecha, hora, "1"];

    var sql = `
      INSERT INTO seguimientoUsuario(idUsuario, dispositivo, accion, data, fecha, hora, estado) 
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - agregarSeguimientoUsuario', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - agregarSeguimientoUsuario', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function agregarLoginFallidoUsuario(usuario, pass, fecha, hora) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado
    let idGenerado = Date.now();
    const values = [idGenerado, usuario, pass, fecha, hora, "1"];

    var sql = `
      INSERT INTO loginFallidoUsuario(id, usuario, pass, fecha, hora, estado) 
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - agregarLoginFallidoUsuario', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - agregarLoginFallidoUsuario', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function actualizarUsuarioById(ci, complemento, nombre, appat, apmat, fechaNacimiento, genero, celular, email, idUsuario) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [ci, complemento, nombre, appat, apmat, fechaNacimiento, email, genero, celular, idUsuario];
    const sql = `
      UPDATE usuario
      SET ci = ?, complemento = ?, nombre = ?, appat = ? , apmat = ?, fechaNacimiento = ?, email=?, genero = ?, celular = ?
      WHERE id = ?;
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - actualizarUsuarioById', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - actualizarUsuarioById', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function actualizarSucursalEstadoById(estado, idUsuario) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [estado, idUsuario];
    const sql = `
      UPDATE usuarioSucursal
      SET estado = ?
      WHERE id = ?;
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - actualizarSucursalEstadoById', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - actualizarSucursalEstadoById', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function actualizarEstadoById(estado, idUsuario) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [estado, idUsuario];
    const sql = `
      UPDATE usuario
      SET estado = ?
      WHERE id = ?;
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - actualizarEstadoById', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - actualizarEstadoById', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function actualizarPasswordById(password, idUsuario) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [password, idUsuario];
    const sql = `
      UPDATE usuario
      SET password = ?
      WHERE id = ?;
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - actualizarPasswordById', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - actualizarPasswordById', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function actualizarUsuarioLoginById(usuario, idUsuario) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [usuario, idUsuario];
    const sql = `
      UPDATE usuario
      SET usuario = ?
      WHERE id = ?;
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - actualizarUsuarioLoginById', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - actualizarUsuarioLoginById', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function usuarioByUsuarioPassword(usuario, password) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [usuario, password];
    const sql = `
      SELECT usuario.id as idUsuario, idNegocio, idRol, ci, complemento, nombre, appat, apmat, DATE_FORMAT(fechaNacimiento, '%d/%m/%Y') as 'fechaNacimiento', genero, celular, email
      FROM usuario
      WHERE BINARY usuario=? and BINARY password=?
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - usuarioByUsuarioPassword', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - usuarioByUsuarioPassword', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function usuarioLoginByIdLogin(idLogin) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idLogin];
    const sql = `
      SELECT usuario.id as 'idUsuario', idRol, ci, complemento, usuario.nombre as 'nombreUsuario', usuario.appat as 'appatUsuario', usuario.apmat as 'apmatUsuario', usuario.celular as 'celularUsuario', usuario.imagen as 'imagenUsuario', usuario.estado as 'estadoUsuario', loginUsuario.estado as 'estadoLogin', usuario.idNegocio
      FROM loginUsuario, usuario
      WHERE loginUsuario.idUsuario = usuario.id and loginUsuario.id = ?;
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - usuarioLoginByIdLogin', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - usuarioLoginByIdLogin', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function usuarioByCi(ci, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [ci, idNegocio];
    const sql = `
      SELECT id, nombre, appat, apmat
      FROM usuario 
      WHERE ci = ? and idNegocio = ?
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - usuarioByCi', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - usuarioByCi', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function usuarioByUsuario(usuario, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [usuario, idNegocio];
    const sql = `
      SELECT id, nombre, appat, apmat
      FROM usuario 
      WHERE usuario = ? and idNegocio = ?;
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - usuarioByUsuario', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - usuarioByUsuario', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function usuarioById(idUsuario) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idUsuario];
    const sql = `
      SELECT id, ci, nombre, appat, apmat, password, idRol
      FROM usuario 
      WHERE id = ? 
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - usuarioById', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - usuarioById', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function usuarioSucursalByUsuarioSucursal(idUsuario, idSucursal, estado) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idUsuario, idSucursal, estado];
    const sql = `
      SELECT usuarioSucursal.id as 'idUsuarioSucursal', idUsuario, idSucursal, fecha, hora
      FROM usuarioSucursal
      WHERE idUsuario = ? and idSucursal = ? and estado = ?
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - usuarioSucursalByUsuarioSucursal', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - usuarioSucursalByUsuarioSucursal', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaUsuariosByEstado(idNegocio, estado) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idNegocio, estado];
    const sql = `
      SELECT usuario.id as idUsuario, idRol, ci, complemento, nombre, appat, apmat, DATE_FORMAT(fechaNacimiento, '%d/%m/%Y') as 'fechaNacimiento', genero, celular, email, ciudad, usuario.imagen as 'imagenUsuario'
      FROM usuario
      WHERE idNegocio = ? and estado = ?
      ORDER BY usuario.nombre ASC;
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - listaUsuariosByEstado', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaUsuariosByEstado', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaSucursalByUsuario(idUsuario, estado) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idUsuario, estado];
    const sql = `
      SELECT usuarioSucursal.id as 'idUsuarioSucursal', idUsuario, idSucursal, usuarioSucursal.fecha, usuarioSucursal.hora
      , sucursal.nombre as 'nombreSucursal'
      FROM usuarioSucursal, sucursal
      WHERE usuarioSucursal.idSucursal = sucursal.id
      and usuarioSucursal.idUsuario = ? and usuarioSucursal.estado = ?
    `;
    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - listaSucursalByUsuario', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaSucursalByUsuario', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

module.exports = {
  agregarUsuario,
  agregarLoginUsuario,
  agregarUsuarioSucursal,
  agregarSeguimientoUsuario,
  agregarLoginFallidoUsuario,

  actualizarUsuarioById,
  actualizarSucursalEstadoById,
  actualizarEstadoById,
  actualizarPasswordById,
  actualizarUsuarioLoginById,

  usuarioByUsuarioPassword,
  usuarioLoginByIdLogin,
  usuarioByCi,
  usuarioByUsuario,
  usuarioById,
  usuarioSucursalByUsuarioSucursal,

  listaUsuariosByEstado,
  listaSucursalByUsuario
};