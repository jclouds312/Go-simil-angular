const logger = require('../logger.js').logger
const fs = require('fs');
const path = require('path');
const filename = path.basename(__filename);
const libFecha = require('../libreria/libFecha.js');
const { getMessage, getMessageCategory } = require('../messages.js');
const convertir = require('../libreria/convertir.js');
const PdfPrinter = require("pdfmake");
const fonts = require('../libreria/fonts');
const e = require('cors');

async function generarPdfBase64(docDefinition) {
    const printer = new PdfPrinter(fonts); // Asegúrate de tener esto definido
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks = [];

    return new Promise((resolve, reject) => {
        pdfDoc.on('data', chunk => chunks.push(chunk));
        pdfDoc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks);
            const documentoBase64 = pdfBuffer.toString('base64');
            resolve(documentoBase64);
        });
        pdfDoc.on('error', reject);
        pdfDoc.end();
    });
}

async function header(entrada){
    let data = [];
    let codigo = getMessageCategory("proceso", "nivelReporte", "correcto", "codigo");
    let estado = true;
    let mensaje = getMessageCategory("proceso", "nivelReporte", "correcto", "mensaje");
    let respuesta = {data, codigo, estado, mensaje}

    try{
        const imagePath = path.join(__dirname, 'logo.png');
        const imageBase64 = fs.readFileSync(imagePath).toString('base64');
        const imageDataUrl = 'data:image/svg+xml;base64,' + imageBase64;
        let header = [];
        header.push({
            columns: [
                {
                    width: 150,
                    stack:[
                        { image: path.join(__dirname, "logo.png"), width: 50, alignment: "left"}
                    ],
                    margin: [0, 15, 0, 0]
                },
                {
                    width: '*',
                    stack:[
                        { fontSize: 14, alignment: "center", color: "#000000", text: entrada.titulo, bold: true},
                    ],
                    margin: [0, 25, 0, 0],
                    
                    
                },
                {
                    width: 150,
                    stack:[
                        { fontSize: 6, alignment: "right", color: "#000000", text: 'DETALLES DE IMPRESION', bold: true},
                        { fontSize: 6, alignment: "right", color: "#000000", text: `Fecha y Hora: ${entrada.fecha} - ${entrada.hora}`}
                    ],
                    margin: [0, 15, 0, 0]
                },
            ]
        })

        header.push({
            canvas: [
                { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: 'black' }
            ],
            margin: [0, 10, 0, 10] // margen superior e inferior para separación
        });

        respuesta.data = header;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelReporte", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - header', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelReporte", "error", "mensaje");
    }

    return respuesta;
}

//export
module.exports = {
    generarPdfBase64,
    header
}