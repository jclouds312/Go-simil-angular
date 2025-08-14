const path = require('path');
const express = require('express');
const config = require('./config.js');
const logger = require('./app/logger').logger;
const { initDatabase } = require('./app/config/database');
const ejemplo = require('./app/reporte/ejemplo.js');
const app = express();

// Puerto dinámico (Render, Railway, Heroku, etc.)
const PORT = process.env.PORT || app.get('portHttp') || 3000;

// Servir Angular build
app.use(express.static(path.join(__dirname, 'public')));

// Ruta por defecto para SPA Angular
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

(async () => {
  try {
    await initDatabase();
    app.listen(PORT, (error) => {
      if (error) {
        logger.log({ level: 'error', label: 'inicio proyecto', message: `No pudo iniciar: ${error.message}` });
      } else {
        logger.log({ level: 'info', label: 'inicio proyecto', message: `Inicio Servidor en puerto ${PORT}` });
      }
    });
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error.message);
    process.exit(1);
  }
})();
