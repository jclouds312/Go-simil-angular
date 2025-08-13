const dotenv = require('dotenv');
const path = require('path');
//para utilizar los valores de las variables de entorno 
dotenv.config({
  path: path.resolve(__dirname, '.env')
});

module.exports = {
  PORT_HTTP: process.env.PORT_HTTP || "3030",
  NODE_ENV: process.env.NODE_ENV || "produccion",
  NOMBRE_APP: process.env.NOMBRE_APP || "SistemaADMBackend",
  DIRECTORIO_STORAGE: process.env.DIRECTORIO_STORAGE || "D:/proyectos/storage",
  DIRECTORIO_LOG: process.env.DIRECTORIO_LOG || "D:/logs",
  DB_HOST: process.env.DB_HOST || "104.197.145.141",
  DB_PORT: process.env.DB_PORT || "3306",
  DB_USER: process.env.DB_USER || "user",
  DB_PASS: process.env.DB_PASS || "user",
  DB_NAME: process.env.DB_NAME || "SistemaADMDev",
  OTP_CLIENTE_URL: process.env.OTP_CLIENTE_URL || "https://www.ControlInventarioMxDev.isibolivia.com",
  WHATSAPP_CANAL: process.env.WHATSAPP_CANAL || "PRUEBADEV",
  WHATSAPP_USER: process.env.WHATSAPP_USER || "USER_PRUEBA",
  WHATSAPP_PASS: process.env.WHATSAPP_PASS || "Prueba123$123&Prueba",
  WHATSAPP_URLBASE: process.env.WHATSAPP_URLBASE || "https://www.apiwhatsapp.isibolivia.com",
  WHATSAPP_URL_INICIARSESION: process.env.WHATSAPP_URL_INICIARSESION || "/V1/cuenta/iniciarSesion",
  WHATSAPP_URL_MENSAJEANUMEROS: process.env.WHATSAPP_URL_MENSAJEANUMEROS || "/V1/mensaje/enviarMensajeANumeros",
  WHATSAPP_URL_PDFANUMEROS: process.env.WHATSAPP_URL_PDFANUMEROS || "/V1/documento/enviarPdfANumeros",
};