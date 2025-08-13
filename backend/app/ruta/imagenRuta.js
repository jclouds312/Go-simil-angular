const ruta = require('express').Router();
const path = require('path');
const fs = require('fs')
const config = require('../../config.js');

// STORAGE SEPARADO
ruta.get('/imagenes/:carpeta/:imagen', async (req, res) => {
  const { carpeta, imagen } = req.params;
  let rutaStorage = config.DIRECTORIO_STORAGE + "/" + config.NOMBRE_APP
  var rutaImagen = path.join(rutaStorage, 'imagenes', carpeta);
  if(fs.existsSync(rutaImagen + "/" + imagen)){
      res.sendFile(imagen, { root: rutaImagen });
    } else {
      res.sendFile("sin_imagen.jpg", { root: path.join(rutaStorage, 'imagenes') });
    }
});

module.exports = ruta;