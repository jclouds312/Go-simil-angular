const mysql = require("mysql2/promise");
const { database } = require("./config_db");
const logger = require("../logger").logger;
const path = require("path");
const filename = path.basename(__filename);

let pool;

async function initDatabase() {
  try {
    pool = await mysql.createPool(database);
    logger.log({
      level: "info",
      label: filename,
      message: `La Base de Datos está conectada Host: ${database["host"]}, Puerto: ${database["port"]}`,
    });
  } catch (err) {
    logger.log({
      level: "error",
      label: filename,
      message: `Error al conectar a la base de datos: ${err.message}`,
    });
    throw new Error("No se pudo conectar a la base de datos.");
  }
}

// Retorna el pool ya inicializado
function getPool() {
  if (!pool) {
    throw new Error("El pool de la base de datos no está inicializado.");
  }
  return pool;
}

module.exports = {
  initDatabase,
  getPool,
};