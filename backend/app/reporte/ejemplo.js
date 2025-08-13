const fs = require("fs");
const PdfPrinter = require("pdfmake");
const fonts = require('../libreria/fonts');
const traspasoDetalleReporte = require('./traspasoDetalleReporte');
const traspasoControlador = require("../controlador/traspasoControlador.js");

const logger = require('../logger').logger
const path = require('path');
const filename = path.basename(__filename);
const libFecha = require('../libreria/libFecha');
const { getMessage, getMessageCategory } = require('../messages');
const convertir = require('../libreria/convertir.js');

async function prueba(entrada){
    let data = [];
    let codigo = getMessageCategory("proceso", "nivelControlador", "correcto", "codigo");
    let estado = true;
    let mensaje = getMessageCategory("proceso", "nivelControlador", "correcto", "mensaje");
    let respuesta = {data, codigo, estado, mensaje}

    try{
      entrada = {
        "idLogin": "1746405449789",
        "dispositivo": "",
        "idTraspaso": "1",
        "estado": "1"
      }
      let oData = await traspasoControlador.traspasoById(entrada);
      if (!oData.estado) {
          respuesta = oData;
          return respuesta;
      }
      oData = oData.data

      const printer = new PdfPrinter(fonts);
      let docDefinition = await traspasoDetalleReporte.traspasoDetalle(oData);
      if (!docDefinition.estado) {
          respuesta = docDefinition;
          return respuesta;
      }

      const pdfDoc = printer.createPdfKitDocument(docDefinition.data);
      pdfDoc.pipe(fs.createWriteStream('reporte_prueba.pdf'));
      pdfDoc.end();
console.log("finalizo el pdf")
    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelControlador", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - agregarTraspaso', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelControlador", "error", "mensaje");
    }

    return respuesta;
}

module.exports = {
    prueba
}