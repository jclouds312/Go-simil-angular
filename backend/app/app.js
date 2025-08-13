const express = require('express');
const http = require('http');
const fileUpload = require('express-fileupload')
const config = require('../config.js');
const net = require('net');
//el cors autorizacion par otras app
const cors = require('cors');

const portHttp  = (config.PORT_HTTP)

// INICIALIZACION
const app = express();
const server = http.createServer(app);

app.use(cors({
    origin: '*'
}));

app.set('portHttp', portHttp);

// MIDDLEWARES  (funciones intermedias entre una peticion y una respuesta)
app.use(cors());
app.use(fileUpload())
app.use(express.json());        //para que pueda entender y procesar json
app.use(express.urlencoded({extends: true}));
app.use(express.static('imagenes'));

// RUTAS (aqui invocamos a las rutas )
app.use(require('./ruta/almacenRuta'));
app.use(require('./ruta/categoriaRuta'));
app.use(require('./ruta/clienteRuta'));
app.use(require('./ruta/compraRuta'));
app.use(require('./ruta/cuentaRuta'));
app.use(require('./ruta/descuentoRuta'));
app.use(require('./ruta/imagenRuta'));
app.use(require('./ruta/negocioRuta'));
app.use(require('./ruta/precioVentaRuta'));
app.use(require('./ruta/productoRuta'));
app.use(require('./ruta/recetaRuta'));
app.use(require('./ruta/sistemaRuta'));
app.use(require('./ruta/sucursalRuta'));
app.use(require('./ruta/traspasoRuta'));
app.use(require('./ruta/usuarioRuta'));
app.use(require('./ruta/ventaRuta'));

const swaggerSetup = require('./swagger');
swaggerSetup(app);

module.exports = {
    app,
    server
}