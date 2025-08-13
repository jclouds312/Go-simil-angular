const logger = require('../logger').logger
const fs = require('fs');
const path = require('path');
const filename = path.basename(__filename);
const libFecha = require('../libreria/libFecha');
const { getMessage, getMessageCategory } = require('../messages');
const convertir = require('../libreria/convertir.js');
const componentes = require('./componentes.js');
const e = require('cors');

async function recetaDetalle(entrada){
    let data = [];
    let codigo = getMessageCategory("proceso", "nivelReporte", "correcto", "codigo");
    let estado = true;
    let mensaje = getMessageCategory("proceso", "nivelReporte", "correcto", "mensaje");
    let respuesta = {data, codigo, estado, mensaje}

    try{
        console.log(entrada)
        const {fecha , hora} = await libFecha.fechaHoraActualddmmyyyy();
        let detalleReceta = entrada;

        let contenido = []
        let detalle = []

        contenido.push({
            width: 130,
            stack:[
                { image: path.join(__dirname, "logo.png"), width: 70, alignment: "center"}
            ],
            margin: [0, 15, 0, 0]
        });

        contenido.push({ fontSize: 10, text: "\n"});

        contenido.push({
            stack: [
                { fontSize: 12, bold: true, alignment: 'center', text: `RECETA - ${detalleReceta.idVenta}`}
            ],
            margin: [0, 5, 0, 5] // Establecer margen solo en la parte superior del stack [left, top, right, bottom]
        });

        contenido.push({
            stack: [
                { fontSize: 11, italics: true, alignment: 'center', text: `Sucursal - ${detalleReceta.nombreSucursal}`}
            ],
            margin: [0, 5, 0, 5] // Establecer margen solo en la parte superior del stack [left, top, right, bottom]
        });

        contenido.push({ fontSize: 7, text: "\n"});

        contenido.push(
            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 210, y2: 0, lineWidth: 1, lineColor: 'black' }] }
        );

        contenido.push({ fontSize: 7, text: "\n"});

        contenido.push({
            columns: [
                {
                    stack: [
                        {
                            fontSize: 9,
                            text: [{ text: 'Optometrista : ', bold: true }, { text: `${detalleReceta.usuario ?? ''}` }]
                        },
                        {
                            fontSize: 9,
                            text: [{ text: 'Paciente: ', bold: true }, { text: `${detalleReceta.cliente}`}]
                        }
                    ]
                }
            ]  
        });

        contenido.push({ fontSize: 7, text: "\n"});

        contenido.push({
            columns: [
                {
                    stack: [
                        { fontSize: 9, text: 'Fecha: ' + fecha }
                    ]
                },
                {
                    stack: [
                        { fontSize: 9, text: 'Hora: ' + hora }
                    ]
                }
            ]  
        });

        contenido.push({ fontSize: 7, text: "\n"});

        contenido.push(
            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 210, y2: 0, lineWidth: 1, lineColor: 'black' }] }
        );
        

        contenido.push({ fontSize: 10, text: "\n"});

        contenido.push({
            stack: [
                { fontSize: 10, bold: true, alignment: 'center', text: `DETALLES DE MEDICIÓN`}
            ],
            margin: [0, 5, 0, 5] // Establecer margen solo en la parte superior del stack [left, top, right, bottom]
        });
        contenido.push({ fontSize: 5, text: "\n"});


        contenido.push({
            columns: [
                {
                    stack: [
                        { fontSize: 9, bold:true, alignment: 'left', italics:true, text: "OJO IZQUIERDO"},
                        {
                            fontSize: 9,
                            text: [{ text: 'Cilindro: ', bold: true }, { text: `${detalleReceta.cilindroIzq}`}]
                        },
                        {
                            fontSize: 9,
                            text: [{ text: 'Esfera: ', bold: true }, { text: `${detalleReceta.esferaIzq ?? ''}` }]
                        },
                        {
                            fontSize: 9,
                            text: [{ text: 'Eje: ', bold: true }, { text: `${detalleReceta.ejeIzq ?? ''}°` }]
                        },
                        {
                            fontSize: 9,
                            text: [{ text: 'Add: ', bold: true }, { text: `${detalleReceta.addIzq ?? ''}` }]
                        }
                    ]
                },
                {
                    stack: [
                        { fontSize: 9, bold:true, alignment: 'left', italics:true, text: "OJO DERECHO"},
                        {
                            fontSize: 9,
                            text: [{ text: 'Cilindro: ', bold: true }, { text: `${detalleReceta.cilindroDer}`}]
                        },
                        {
                            fontSize: 9,
                            text: [{ text: 'Esfera: ', bold: true }, { text: `${detalleReceta.esferaDer ?? ''}` }]
                        },
                        {
                            fontSize: 9,
                            text: [{ text: 'Eje: ', bold: true }, { text: `${detalleReceta.ejeDer ?? ''}°` }]
                        },
                        {
                            fontSize: 9,
                            text: [{ text: 'Add: ', bold: true }, { text: `${detalleReceta.addDer ?? ''}` }]
                        }
                    ]
                }
            ]  
        });

        contenido.push({ fontSize: 10, text: "\n"});

        contenido.push(
            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 210, y2: 0, lineWidth: 1, lineColor: 'black' }] }
        );

        contenido.push({ fontSize: 10, text: "\n"});


        contenido.push({
            columns: [
                {
                     width: '30%',
                    stack: [
                        {
                            fontSize: 9,
                            text: [{ text: 'A.O.: ', bold: true }, { text: `${detalleReceta.ao}`}]
                        },
                        {
                            fontSize: 9,
                            text: [{ text: 'D.I.P.: ', bold: true }, { text: `${detalleReceta.dip ?? ''}` }]
                        }
                    ]
                },
                {
                     width: '70%',
                    stack: [
                        {
                            fontSize: 9,
                            text: [{ text: 'Tipo Armazón: ', bold: true }, { text: `${detalleReceta.armazon}`}]
                        },
                        {
                            fontSize: 9,
                            text: [{ text: 'Tipo Bifocal: ', bold: true }, { text: `${detalleReceta.bifocal ?? ''}` }]
                        }
                    ]
                }
            ]  
        });

        contenido.push({ fontSize: 10, text: "\n"});


        contenido.push({
            stack: [
                {
                    fontSize: 9,
                    text: [{ text: 'Material: ', bold: true }, { text: `${detalleReceta.material ?? ''}` }]
                },
                {
                    fontSize: 9,
                    text: [{ text: 'Tratamiento: ', bold: true }, { text: `${detalleReceta.tratamiento ?? ''}` }]
                }
            ]
        });

        contenido.push({ fontSize: 10, text: "\n"});
        contenido.push({ fontSize: 10, text: "\n"});



        contenido.push({
            stack: [
                { fontSize: 9, italics: true, alignment: 'center', text: `Gracias por elegirnos!`},
                { fontSize: 9, italics: true, alignment: 'center', text: `En Genéricos y Ópticas de Similares S.A. de C.V.,`},
                { fontSize: 9, italics: true, alignment: 'center', text: `tu salud visual es primero.`},
            ]
        });

        contenido.push({ fontSize: 10, text: "\n"});


    // Definición del documento
    const docDefinition = {
        pageSize: {
              width: 227, // el width e 1mm = 2.835
              height: 'auto' // Altura automática según el contenido
        },
        pageMargins: [ 10, 10, 10, 10 ],
        content: contenido,
    };
    respuesta.data = docDefinition;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelReporte", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - recetaDetalle', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelReporte", "error", "mensaje");
    }

    return respuesta;
}

//export
module.exports = {
    recetaDetalle
}