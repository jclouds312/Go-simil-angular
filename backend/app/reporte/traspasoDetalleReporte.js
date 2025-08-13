const logger = require('../logger').logger
const fs = require('fs');
const path = require('path');
const filename = path.basename(__filename);
const libFecha = require('../libreria/libFecha');
const { getMessage, getMessageCategory } = require('../messages');
const convertir = require('../libreria/convertir.js');
const componentes = require('./componentes.js');
const e = require('cors');

async function traspasoDetalle(entrada){
    let data = [];
    let codigo = getMessageCategory("proceso", "nivelReporte", "correcto", "codigo");
    let estado = true;
    let mensaje = getMessageCategory("proceso", "nivelReporte", "correcto", "mensaje");
    let respuesta = {data, codigo, estado, mensaje}

    try{
        //console.log(entrada)
        let traspaso = entrada.traspaso;
        let detalleTraspaso = entrada.detalle;
        let totalCantidad = entrada.totalCantidad;
        let totalPrecioFormato = entrada.totalPrecioFormato;
        let totalPuntos = entrada.totalPuntos;

        let contenido = []
        let detalle = []

        contenido.push({
            columns: [
                {
                    stack: [
                        {
                            fontSize: 8,
                            text: [{ text: 'Usuario: ', bold: true }, { text: `${traspaso.usuario}` }]
                        }
                    ]
                },
                {
                    stack: [
                        {
                            fontSize: 8,
                            text: [{ text: 'Origen: ', bold: true }, { text: `${traspaso.tipoOrigen} ${traspaso.nombreAlmacenOrigen ?? ''} ${traspaso.nombreClienteOrigen ?? ''}`}]
                        },
                        {
                            fontSize: 8,
                            text: [{ text: 'Destino: ', bold: true }, { text: `${traspaso.tipoDestino} ${traspaso.nombreAlmacenDestino ?? ''} ${traspaso.nombreClienteDestino ?? ''}` }]
                        }
                    ]
                },
                {
                    stack: [
                        {
                            fontSize: 8,
                            text: [{ text: 'Fecha: ', bold: true }, { text: traspaso["fechaTraspaso"] }]
                        },
                        {
                            fontSize: 8,
                            text: [{ text: 'Hora: ', bold: true }, { text: traspaso["horaTraspaso"] }]
                        }
                    ]
                }
            ]  
        });

        contenido.push({ fontSize: 10, text: "\n"});

        let estiloCelda = {
            fillColor: '#07ABCB', // Color de fondo
            color: '#ffffff', // Color del texto
            bold: true,
            alignment: 'center',
            fontSize: 10,
            border: [true, true,  true, true], // Solo borde inferior
            borderColor: '#FFF' // Color del borde inferior
        };

        let widthsTabla = [25, '*', 50, 'auto', 'auto'];
        detalle.push([
            {text: 'Nro', ...estiloCelda},
            {text: 'Producto', ...estiloCelda},
            {text: 'Cantidad', ...estiloCelda },
            {text: 'Puntos', ...estiloCelda },
            {text: 'SubTotal', ...estiloCelda}
        ])

        estiloCelda = {
            alignment: 'center',
            fontSize: 9,
            border: [false, false, false, true], // Solo borde inferior
            borderColor: '#07ABCB' // Color del borde inferior
        };
        
        for(let i = 0; i < detalleTraspaso.length ;i++){
            detalle.push([
                {text:(i+1), alignment: 'center', ...estiloCelda},
                {
                    stack: [
                        { text: `COD: ${detalleTraspaso[i]["codigoLiteral"]}`, fontSize: 7 },
                        { text: `${detalleTraspaso[i]["nombre"]}`, bold: true }
                    ],
                    ...estiloCelda, // Aplica borde inferior aquí (no en los hijos)
                },
                {text: detalleTraspaso[i]["cantidad"], alignment: 'center', ...estiloCelda},
                {
                    stack: [
                        { text: `Unit: ${detalleTraspaso[i]["puntos"]} LP`, fontSize: 7 },
                        { text: `${detalleTraspaso[i]["puntosSubTotal"]} LP`, bold: true }
                    ],
                    ...estiloCelda, // Aplica borde inferior aquí (no en los hijos)
                },
                {
                    stack: [
                        { text: `Unit: Bs. ${detalleTraspaso[i]["costoFormato"]}`, fontSize: 7 },
                        { text: `Bs. ${detalleTraspaso[i]["subTotalFormato"]}`, bold: true }
                    ],
                    ...estiloCelda, // Aplica borde inferior aquí (no en los hijos)
                },
            ]);
        }

        contenido.push({
            style: 'tableExample',
            table: {
                widths: widthsTabla,
                headerRows: 1,
                body: detalle
            }
        });

        estiloCelda = {
            alignment: 'center',
            fontSize: 9,
            border: [false, false, false, false], // Solo borde inferior
            borderColor: '#07ABCB' // Color del borde inferior
        };

        let firma;
        if(traspaso["idClienteDestino"] != "1"){
            if(traspaso["firmado"] == "1"){
                firma = [
                    { fontSize: 10, text: "\n"},
                    {
                    fontSize: 8,
                    text: [{ text: 'Firmado Electrónicamente por: ', bold: true }]
                    },
                    {
                    fontSize: 8,
                    text: `${traspaso.nombreClienteOtp}`
                    },
                    {
                    fontSize: 8,
                    text: [{ text: 'OTP: ', bold: true }, { text: `${traspaso.otpGenerado}` }]
                    },
                    {
                    fontSize: 8,
                    text: [{ text: 'Celular: ', bold: true }, { text: `${traspaso.celular}` }]
                    },
                    {
                    fontSize: 8,
                    text: [{ text: 'Fecha: ', bold: true }, { text: `${traspaso.fechaRecibidoOtp} - ${traspaso.horaRecibidoOtp}` }]
                    },
                    {
                    fontSize: 8,
                    text: [{ text: '(Firma Electrónica)' }]
                    }
                ]
            } else {
                firma =[
                    { fontSize: 10, text: "\n"},
                    {
                    fontSize: 8,
                    text: [{ text: 'EL CLIENTE NO FIRMÓ AUN LA RECEPCIÓN DE LOS PRODUCTOS', bold: true }]
                    }
                ]
            }
            
        } else {
            firma = [
                { fontSize: 10, text: "\n"},
                {
                fontSize: 8,
                text: [{ text: 'NO SE REQUIERE FIRMA', bold: true }]
                }
            ]
        }
        contenido.push({ fontSize: 10, text: "\n"});
        contenido.push({
        columns: [
            {
                width: '*',
                stack: firma
            },
            {
            width: '*',
            stack: [
                { fontSize: 12, bold:true, alignment: 'center', text: "RESULTADOS"},
                {
                style: 'tableExample',
                table: {
                    widths: ['*', 140, 100],
                    body: [
                    [
                        { border: [false, false, false, false], text: "" },
                        { text: "CANTIDAD DE PRODUCTOS: ", ...estiloCelda, alignment: 'right' },
                        { border: true, text: totalCantidad, ...estiloCelda, alignment: 'left' }
                    ],
                    [
                        { border: [false, false, false, false], text: "" },
                        { text: "TOTAL DE PUNTOS: ", ...estiloCelda, alignment: 'right' },
                        { border: true, text: `${totalPuntos} LP`, ...estiloCelda, alignment: 'left' }
                    ],
                    [
                        { border: [false, false, false, false], text: "" },
                        { text: "MONTO TOTAL: ", ...estiloCelda, alignment: 'right' },
                        { border: true, text: `Bs. ${totalPrecioFormato}`, ...estiloCelda, alignment: 'left' }
                    ]
                    ]
                }
                }
            ]
            }
        ]
    });

    const {fecha , hora} = await libFecha.fechaHoraActualddmmyyyy();
    let param = {
        titulo: `TRASPASO NRO. ${traspaso.idTraspaso}`,
        fecha: fecha,
        hora: hora,
    };
    let header = await componentes.header(param);
    if (!header.estado) {
        respuesta = header;
        return respuesta;
    }
    header = header.data;

    // Definición del documento
    const docDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 80, 40, 60], // [left, top, right, bottom]
        header: {
                stack: header,
                margin: [ 40, 10, 40, 40 ],
            },
        footer: function (currentPage, pageCount) {
            return {
            margin: [40, 0, 40, 20],
            layout: 'noBorders',
            table: {
                widths: ['*'],
                body: [
                [
                    {
                    text: `Página ${currentPage} de ${pageCount}`,
                    alignment: 'center',
                    fontSize: 9,
                    color: '#888'
                    }
                ]
                ]
            }
            };
        },
        content: contenido,
    };
    respuesta.data = docDefinition;

    }catch(error){
        data = [];
        codigo = getMessageCategory("proceso", "nivelReporte", "error", "codigo");
        estado = false;
        mensaje = error.stack;
        respuesta = {data, codigo, estado, mensaje}
        logger.log({level: 'error', label: filename + ' - traspasoDetalle', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelReporte", "error", "mensaje");
    }

    return respuesta;
}

//export
module.exports = {
    traspasoDetalle
}