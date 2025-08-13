const { getPool } = require("../config/database");
const logger = require("../logger").logger;
const path = require("path");
const filename = path.basename(__filename);
const { getMessage, getMessageCategory } = require('../messages');

async function agregarProducto(idCategoria, codigo, nombre, descripcion, precio, puntos, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado
    let idGenerado = Date.now();
    const values = [idGenerado, idCategoria, codigo, nombre, descripcion, precio, puntos, "sin_imagen_almacen.jpg", "1", idNegocio];

    var sql = `
      INSERT INTO producto(id, idCategoria, codigo, nombre, descripcion, precio, puntos, imagen, estado, idNegocio)
      VALUES(?,?,?,?,?,?,?,?,?,?);
    `;

    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]
    respuesta.data["idProducto"] = idGenerado;

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - agregarProducto', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - agregarProducto', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function agregarInventarioProducto(idProducto, idAlmacen, idCliente, fechaVencimiento, cantidad, cantidadLiteral, costo, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado
    let idGenerado = Date.now();
    const values = [idGenerado, idProducto, idAlmacen, idCliente, fechaVencimiento, cantidad, cantidadLiteral, costo, "1", idNegocio];

    var sql = `
      INSERT INTO inventarioProducto(id, idProducto, idAlmacen, idCliente, fechaVencimiento, cantidad, cantidadLiteral, costo, estado, idNegocio)
      VALUES(?,?,?,?,?,?,?,?,?,?);
    `;

    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]
    respuesta.data["idInventarioProducto"] = idGenerado;

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - agregarInventarioProducto', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - agregarInventarioProducto', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function agregarInventarioProductoHistorial(idUsuario, idInventarioProducto, tipo, cantidad, cantidadLiteral, detalle, observacion, fecha, hora) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado
    let idGenerado = Date.now();
    const values = [idGenerado, idUsuario, idInventarioProducto, tipo, cantidad, cantidadLiteral, detalle, observacion, fecha, hora, "1"];

    var sql = `
      INSERT INTO inventarioProductoHistorial(id, idUsuario, idInventarioProducto, tipo, cantidad, cantidadLiteral, detalle, observacion, fecha, hora, estado)
      VALUES(?,?,?,?,?,?,?,?,?,?,?);
    `;

    const resultado = await pool.query(sql, values);
    respuesta.data = resultado[0]
    respuesta.data["idInventarioProductoHistorial"] = idGenerado;

  } catch (error) {
    respuesta.data = [];
    respuesta.estado = false;
  
    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.codigo = getMessage("basedatos", "error", "codigo");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "codigo");
    }

    respuesta.mensaje = error;
    logger.log({level: 'error', label: filename + ' - agregarInventarioProductoHistorial', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - agregarInventarioProductoHistorial', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function actualizarPrecioPuntosdByid(precio, puntos, idProducto) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [precio, puntos, idProducto];
    const sql = `
      UPDATE producto
      SET precio = ?, puntos = ?
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
    logger.log({level: 'error', label: filename + ' - actualizarPrecioPuntosdByid', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - actualizarPrecioPuntosdByid', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function actualizarDatosProductodByid(codigo, nombre, descripcion, precio, idCategoria, idProducto) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [codigo, nombre, descripcion, precio, idCategoria, idProducto];
    const sql = `
      UPDATE producto
      SET codigo = ?, nombre = ?, descripcion = ?, precio = ?, idCategoria = ?
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
    logger.log({level: 'error', label: filename + ' - actualizarDatosProductodByid', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - actualizarDatosProductodByid', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}


async function actualizaPreciodByid(precio, idProducto) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [precio, idProducto];
    const sql = `
      UPDATE producto
      SET precio = ?
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
    logger.log({level: 'error', label: filename + ' - actualizaPreciodByid', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - actualizaPreciodByid', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function actualizaCantidadByid(cantidad, cantidadLiteral, idInventarioProducto) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [cantidad, cantidadLiteral, idInventarioProducto];
    const sql = `
      UPDATE inventarioProducto
      SET cantidad = ?, cantidadLiteral = ?
      WHERE inventarioProducto.id = ?
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
    logger.log({level: 'error', label: filename + ' - actualizaCantidadByid', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - actualizaCantidadByid', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function productoById(idProducto) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idProducto];
    const sql = `
      SELECT producto.id as 'idProducto', codigo, nombre, descripcion, precio, puntos, imagen
      FROM producto
      WHERE producto.id = ?
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
    logger.log({level: 'error', label: filename + ' - productoById', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - productoById', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function productoByInventario(idProducto) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idProducto];
    const sql = `
      SELECT idProducto, idCategoria, producto.codigo, producto.nombre, categoria.nombre as 'nombreCategoria', meta, porcentaje
      FROM inventarioProducto, producto, categoria
      WHERE inventarioProducto.idProducto = producto.id and producto.idCategoria = categoria.id
      and inventarioProducto.id = ?
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
    logger.log({level: 'error', label: filename + ' - productoByInventario', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - productoByInventario', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function inventarioProductoById(idInventarioProducto) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idInventarioProducto];
    const sql = `
      SELECT inventarioProducto.id as 'idInventarioProducto', idProducto, DATE_FORMAT(fechaVencimiento, '%d/%m/%Y') as 'fechaVencimiento', cantidad, cantidadLiteral, costo
      , producto.puntos
      FROM inventarioProducto, producto
      WHERE inventarioProducto.idProducto = producto.id
      and inventarioProducto.id = ?;
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
    logger.log({level: 'error', label: filename + ' - inventarioProductoById', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - inventarioProductoById', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function inventarioProductoByProductoAlmacenFecVenCosto(idProducto, idAlmacen, fechaVencimiento, costo, estado, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idProducto, idAlmacen, fechaVencimiento, costo, estado, idNegocio];
    const sql = `
      SELECT inventarioProducto.id as 'idInventarioProducto', DATE_FORMAT(fechaVencimiento, '%d/%m/%Y') as 'fechaVencimiento', cantidad, cantidadLiteral, costo
      FROM inventarioProducto
      WHERE idProducto = ? and idAlmacen = ? and inventarioProducto.fechaVencimiento = ? and costo = ? and inventarioProducto.estado = ? and inventarioProducto.idNegocio = ?;
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
    logger.log({level: 'error', label: filename + ' - inventarioProductoByProductoAlmacenFecVenCosto', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - inventarioProductoByProductoAlmacenFecVenCosto', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function inventarioProductoByProductoClienteFecVenCosto(idProducto, idCliente, fechaVencimiento, costo, estado, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idProducto, idCliente, fechaVencimiento, costo, estado, idNegocio];
    const sql = `
      SELECT inventarioProducto.id as 'idInventarioProducto', DATE_FORMAT(fechaVencimiento, '%d/%m/%Y') as 'fechaVencimiento', cantidad, cantidadLiteral, costo
      FROM inventarioProducto
      WHERE idProducto = ? and idCliente = ? and inventarioProducto.fechaVencimiento = ? and costo = ? and inventarioProducto.estado = ? and inventarioProducto.idNegocio = ?;
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
    logger.log({level: 'error', label: filename + ' - inventarioProductoByProductoClienteFecVenCosto', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - inventarioProductoByProductoClienteFecVenCosto', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaProductoByEstado(estado, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [estado, idNegocio];
    const sql = `
      SELECT producto.id as 'idProducto', codigo, producto.nombre, descripcion, precio, puntos, imagen
      , producto.idCategoria, categoria.nombre as 'nombreCategoria'
      FROM producto, categoria
      WHERE producto.idCategoria = categoria.id
      and producto.estado = ? and producto.idNegocio = ?
      ORDER BY producto.codigo ASC, producto.nombre ASC
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
    logger.log({level: 'error', label: filename + ' - listaProductoByEstado', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaProductoByEstado', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaInventarioProductoByAlmacenProducto(idAlmacen, idProducto, cantidad, estado, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idAlmacen, idProducto, cantidad, estado, idNegocio];
    const sql = `
      SELECT inventarioProducto.id as 'idInventarioProducto', inventarioProducto.idProducto, DATE_FORMAT(fechaVencimiento, '%d/%m/%Y') as 'fechaVencimiento', inventarioProducto.cantidad, cantidadLiteral, costo
      , producto.nombre as 'nombreProducto', producto.codigo as 'codigoProducto', producto.precio as 'precioProducto', producto.puntos as 'puntosProducto'
      , categoria.nombre as 'nombreCategoria'
      FROM inventarioProducto, producto, categoria
      WHERE inventarioProducto.idProducto = producto.id and producto.idCategoria = categoria.id
      and inventarioProducto.idAlmacen = ? and inventarioProducto.idProducto = ? and inventarioProducto.cantidad > ? and inventarioProducto.estado = ? and inventarioProducto.idNegocio = ?
      ORDER BY producto.codigo ASC, producto.nombre ASC
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
    logger.log({level: 'error', label: filename + ' - listaInventarioProductoByAlmacenProducto', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaInventarioProductoByAlmacenProducto', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaInventarioProductoByClienteProducto(idAlmacen, idProducto, cantidad, estado, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idAlmacen, idProducto, cantidad, estado, idNegocio];
    const sql = `
      SELECT inventarioProducto.id as 'idInventarioProducto', inventarioProducto.idProducto, DATE_FORMAT(fechaVencimiento, '%d/%m/%Y') as 'fechaVencimiento', cantidad, cantidadLiteral, costo
      , producto.nombre as 'nombreProducto', producto.codigo as 'codigoProducto', producto.precio as 'precioProducto', producto.puntos as 'puntosProducto'
      , categoria.nombre as 'nombreCategoria'
      FROM inventarioProducto, producto, categoria
      WHERE inventarioProducto.idProducto = producto.id and categoria.id = producto.idCategoria
      and inventarioProducto.idCliente = ? and inventarioProducto.idProducto = ? and inventarioProducto.cantidad > ? and inventarioProducto.estado = ? and inventarioProducto.idNegocio = ?
      ORDER BY producto.codigo ASC, producto.nombre ASC
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
    logger.log({level: 'error', label: filename + ' - listaInventarioProductoByAlmacenProducto', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaInventarioProductoByAlmacenProducto', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaInventarioProductoByProducto(idProducto, cantidad, estado, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idProducto, cantidad, estado, idNegocio];
    const sql = `
      SELECT inventarioProducto.id as 'idInventarioProducto', inventarioProducto.idProducto, DATE_FORMAT(fechaVencimiento, '%d/%m/%Y') as 'fechaVencimiento', inventarioProducto.cantidad, cantidadLiteral, costo
      , producto.nombre as 'nombreProducto', producto.codigo as 'codigoProducto', producto.precio as 'precioProducto', producto.puntos as 'puntosProducto'
      , almacen.nombre as 'nombreAlmacen'
      FROM inventarioProducto, producto, almacen
      WHERE inventarioProducto.idProducto = producto.id and inventarioProducto.idAlmacen = almacen.id
      and inventarioProducto.idProducto = ? and inventarioProducto.cantidad > ? and inventarioProducto.estado = ? and inventarioProducto.idNegocio = ?
      ORDER BY producto.codigo ASC, producto.nombre ASC
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
    logger.log({level: 'error', label: filename + ' - listaInventarioProductoByProducto', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaInventarioProductoByProducto', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaInventarioProductoByAlmacen(idAlmacen, estado, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idAlmacen, estado, idNegocio];
    const sql = `
      SELECT inventarioProducto.id as 'idInventarioProducto', idProducto, DATE_FORMAT(fechaVencimiento, '%d/%m/%Y') as 'fechaVencimiento', cantidad, cantidadLiteral, costo
      , producto.nombre as 'nombreProducto', producto.codigo as 'codigoProducto', producto.descripcion as 'descripcionProducto', producto.precio as 'precioProducto', producto.puntos as 'puntosProducto'
      , categoria.nombre as 'nombreCategoria'
      FROM inventarioProducto, producto, categoria
      WHERE inventarioProducto.idProducto = producto.id and producto.idCategoria = categoria.id 
      and inventarioProducto.idAlmacen = ? and inventarioProducto.estado = ? and inventarioProducto.idNegocio = ?
      ORDER BY producto.codigo ASC, producto.nombre ASC
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
    logger.log({level: 'error', label: filename + ' - listaInventarioProductoByAlmacen', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaInventarioProductoByAlmacen', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaInventarioProductoByCliente(idCliente, estado, idNegocio) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idCliente, estado, idNegocio];
    const sql = `
      SELECT inventarioProducto.id as 'idInventarioProducto', idProducto, DATE_FORMAT(fechaVencimiento, '%d/%m/%Y') as 'fechaVencimiento', cantidad, cantidadLiteral, costo
      , producto.nombre as 'nombreProducto', producto.codigo as 'codigoProducto', producto.descripcion as 'descripcionProducto', producto.precio as 'precioProducto', producto.puntos as 'puntosProducto'
      FROM inventarioProducto, producto
      WHERE inventarioProducto.idProducto = producto.id
      and inventarioProducto.idCliente = ? and inventarioProducto.estado = ? and inventarioProducto.idNegocio = ?
      ORDER BY producto.codigo ASC, producto.nombre ASC
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
    logger.log({level: 'error', label: filename + ' - listaInventarioProductoByCliente', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaInventarioProductoByCliente', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaInventarioHistorialByInventario(idInventario, estado) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idInventario, estado];
    const sql = `
      SELECT inventarioProductoHistorial.id as 'idInventarioProductoHistorial', tipo, cantidad, cantidadLiteral, detalle, observacion, DATE_FORMAT(fecha, '%d/%m/%Y') as 'fecha', hora
      FROM inventarioProductoHistorial
      WHERE inventarioProductoHistorial.idInventarioProducto = ? and inventarioProductoHistorial.estado = ?
      ORDER BY inventarioProductoHistorial.fecha DESC, inventarioProductoHistorial.hora DESC
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
    logger.log({level: 'error', label: filename + ' - listaInventarioHistorialByInventario', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaInventarioHistorialByInventario', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaInventarioHistorialByAlmacenProducto(idAlmacen, idProducto, estado) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idAlmacen, idProducto, estado];
    const sql = `
      SELECT inventarioProductoHistorial.id as 'idInventarioProductoHistorial', tipo, inventarioProductoHistorial.cantidad, inventarioProductoHistorial.cantidadLiteral, detalle, observacion, DATE_FORMAT(fecha, '%d/%m/%Y') as 'fecha', hora
      FROM inventarioProductoHistorial, inventarioProducto, producto
      WHERE inventarioProductoHistorial.idInventarioProducto = inventarioProducto.id and inventarioProducto.idProducto = producto.id
      and inventarioProducto.idAlmacen = ? and inventarioProducto.idProducto = ? and inventarioProductoHistorial.estado = ?
      ORDER BY inventarioProductoHistorial.fecha DESC, inventarioProductoHistorial.hora DESC
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
    logger.log({level: 'error', label: filename + ' - listaInventarioHistorialByAlmacenProducto', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaInventarioHistorialByAlmacenProducto', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

async function listaInventarioHistorialByClienteProducto(idCliente, idProducto, estado) {
  let respuesta = {}
  respuesta.data = [];
  respuesta.codigo = getMessageCategory("proceso", "nivelModelo", "correcto", "codigo");
  respuesta.estado = true;
  respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "correcto", "mensaje");

  try {
    const pool = getPool(); // Obtener el pool ya inicializado

    let values = [idCliente, idProducto, estado];
    const sql = `
      SELECT inventarioProductoHistorial.id as 'idInventarioProductoHistorial', tipo, inventarioProductoHistorial.cantidad, inventarioProductoHistorial.cantidadLiteral, detalle, observacion, DATE_FORMAT(fecha, '%d/%m/%Y') as 'fecha', hora
      FROM inventarioProductoHistorial, inventarioProducto, producto
      WHERE inventarioProductoHistorial.idInventarioProducto = inventarioProducto.id and inventarioProducto.idProducto = producto.id
      and inventarioProducto.idCliente = ? and inventarioProducto.idProducto = ? and inventarioProductoHistorial.estado = ?
      ORDER BY inventarioProductoHistorial.fecha DESC, inventarioProductoHistorial.hora DESC
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
    logger.log({level: 'error', label: filename + ' - listaInventarioHistorialByClienteProducto', message: JSON.stringify(respuesta)});
    respuesta.mensaje = error.stack;
    logger.log({level: 'error', label: filename + ' - listaInventarioHistorialByClienteProducto', message: JSON.stringify(respuesta)});

    if (error.code === "PROTOCOL_CONNECTION_LOST" || error.code === "ECONNREFUSED") {
      respuesta.mensaje = getMessage("basedatos", "error", "mensaje");
    } else {
      respuesta.mensaje = getMessageCategory("proceso", "nivelModelo", "error", "mensaje");
    }
  }

  return respuesta;
}

module.exports = {
  agregarProducto,
  agregarInventarioProducto,
  agregarInventarioProductoHistorial,

  actualizarDatosProductodByid,
  actualizarPrecioPuntosdByid,
  actualizaCantidadByid,

  productoById,
  productoByInventario,
  inventarioProductoById,
  inventarioProductoByProductoAlmacenFecVenCosto,
  inventarioProductoByProductoClienteFecVenCosto,

  listaProductoByEstado,
  listaInventarioProductoByAlmacenProducto,
  listaInventarioProductoByClienteProducto,
  listaInventarioProductoByProducto,
  listaInventarioProductoByAlmacen,
  listaInventarioProductoByCliente,
  listaInventarioHistorialByInventario,
  listaInventarioHistorialByAlmacenProducto,
  listaInventarioHistorialByClienteProducto
};