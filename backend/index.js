const config = require('./config.js');
const logger = require('./app/logger').logger
const { app, server } = require('./app/app');
const ejemplo = require('./app/reporte/ejemplo.js');
//BASE DE DATOS
const { initDatabase } = require('./app/config/database');

(async () => {
    try {
      // Inicializar la base de datos
      await initDatabase();
  
      // INICIO SERVIDOR
    app.listen(app.get('portHttp'), async (error) => {
        if(error){
            logger.log({level: 'error', label: 'inicio proyecto', message: `No pudo iniciar el Servidor HTTP en el puerto ${app.get('portHttp')} - ${error}`});
        }else{
            logger.log({level: 'info', label: 'inicio proyecto', message: `Inicio Servidor HTTP en el puerto ${app.get('portHttp')}`});
            logger.log({level: 'info', label: 'inicio proyecto', message: `En el ambiente de ${config.NODE_ENV}`});
        }
        //await ejemplo.prueba("");
    })
    } catch (error) {
      console.error("Error al inicializar la base de datos:", error.message);
      process.exit(1); // Finalizar el proceso si no se puede conectar a la base de datos
    }
  })();

