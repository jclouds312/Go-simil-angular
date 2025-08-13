const logger = require('../logger.js').logger
const fs = require('fs');
const path = require('path');
const filename = path.basename(__filename);
const libFecha = require('../libreria/libFecha.js');
const { getMessage, getMessageCategory } = require('../messages.js');
const convertir = require('../libreria/convertir.js');
const componentes = require('./componentes.js');
const e = require('cors');

async function ventaDetalle(entrada){
    let data = [];
    let codigo = getMessageCategory("proceso", "nivelReporte", "correcto", "codigo");
    let estado = true;
    let mensaje = getMessageCategory("proceso", "nivelReporte", "correcto", "mensaje");
    let respuesta = {data, codigo, estado, mensaje}

    try{
        console.log(entrada)
        const {fecha , hora} = await libFecha.fechaHoraActualddmmyyyy();
        let venta = entrada.venta;
        let detalleVenta = entrada.detalle;
        let totalCantidad = entrada.totalCantidad;
        let totalPrecioFormato = entrada.totalPrecioFormato;
        let totalCreditoFormato = entrada.totalCreditoFormato;
        let totalSaldoFormato = entrada.totalSaldoFormato;
        let totalDescuento = entrada.totalDescuento;
        let totalDescuentoFormato = entrada.totalDescuentoFormato;
        let totalSinDescuentoFormato = entrada.totalSinDescuentoFormato;

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
                { fontSize: 12, bold: true, alignment: 'center', text: `VENTA - ${venta.idVenta}`}
            ],
            margin: [0, 5, 0, 5] // Establecer margen solo en la parte superior del stack [left, top, right, bottom]
        });

        contenido.push({
            stack: [
                { fontSize: 11, italics: true, alignment: 'center', text: `Sucursal - ${venta.nombreSucursal}`}
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
                            text: [{ text: `${venta.idRol ?? ''}`, bold: true }, { text: `${venta.usuario ?? ''}` }]
                        },
                        {
                            fontSize: 9,
                            text: [{ text: 'Cliente: ', bold: true }, { text: `${venta.cliente}`}]
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
                { fontSize: 10, bold: true, alignment: 'center', text: `DETALLES DE VENTA`}
            ],
            margin: [0, 5, 0, 5] // Establecer margen solo en la parte superior del stack [left, top, right, bottom]
        });

        contenido.push({ fontSize: 5, text: "\n"});

        let estiloCelda = {
            fillColor: '#000', // Color de fondo
            color: '#ffffff', // Color del texto
            bold: true,
            alignment: 'center',
            fontSize: 10,
            border: [true, true,  true, true], // Solo borde inferior
            borderColor: '#FFF' // Color del borde inferior
        };

        let widthsTabla = [20, '*', 'auto', 'auto'];
        detalle.push([
            {text: 'Cant.', ...estiloCelda},
            {text: 'Producto', ...estiloCelda},
            {text: 'Precio Unit.', ...estiloCelda },
            {text: 'SubTotal', ...estiloCelda}
        ])

        estiloCelda = {
            alignment: 'center',
            fontSize: 9,
            border: [false, false, false, true], // Solo borde inferior
            borderColor: '#000' // Color del borde inferior
        };

        let estiloCeldaSinBorder = {
            alignment: 'center',
            fontSize: 9,
            border: [false, false, false, false], // Solo borde inferior
            borderColor: '#000' // Color del borde inferior
        };
        
        for(let i = 0; i < detalleVenta.length ;i++){
            if(detalleVenta[i]["devolucion"] != "1"){
                let descuento;
                if(detalleVenta[i]["idDescuento"] != "1"){
                    descuento = [
                            { text: `$. ${detalleVenta[i]["ventaFormato"]}`, decoration: 'lineThrough', alignment: 'right'},
                            { text: `$. ${detalleVenta[i]["precioFinalFormato"]}`, alignment: 'right'}
                        ]
                }else {
                    descuento = [
                            { text: `$. ${detalleVenta[i]["precioFinalFormato"]}`, alignment: 'right'}
                        ]
                }

                detalle.push([
                    {text: detalleVenta[i]["cantidad"], alignment: 'center', ...estiloCeldaSinBorder},
                    {
                        stack: [
                            { text: `COD: ${detalleVenta[i]["codigoLiteral"]}`, fontSize: 7, alignment: 'left' },
                            { text: `${detalleVenta[i]["nombre"]}`, bold: true, alignment: 'left' }
                        ], ...estiloCeldaSinBorder
                    },
                    {
                        stack: [
                            descuento
                        ], ...estiloCeldaSinBorder
                    },
                    {
                        stack: [
                            { text: `$. ${detalleVenta[i]["subTotalFormato"]}`, bold: true, alignment: 'right'}
                        ], ...estiloCeldaSinBorder
                        
                    },
                ]);

                if (detalleVenta[i]["idDescuento"] != "1") {
                    detalle.push([
                        { text: { text: `Se aplico un Descuento de ${detalleVenta[i]["porcentaje"]}%`, alignment: 'center', italics: true, fontSize: 8 }, colSpan: 4, border: [false, false, false, false], margin: [0, -2, 0, 4], ...estiloCelda },
                        {},
                        {},
                        {},
                    ]);
                }
            }
            
        }

        contenido.push({
            style: 'tableExample',
            table: {
                widths: widthsTabla,
                headerRows: 1,
                body: detalle
            }
        });

        contenido.push({ fontSize: 7, text: "\n"});

        contenido.push({
            columns: [
                {
                    stack: [
                        { fontSize: 9, text: `Total:  $ ${totalSinDescuentoFormato}`, alignment: 'right' },
                        { fontSize: 9, text: `Descuento:  $ ${totalDescuentoFormato}`, alignment: 'right' },
                        { fontSize: 9, text: `Total a Pagar:  $ ${totalPrecioFormato}`, alignment: 'right' }
                    ]
                }
            ]  
        });

        contenido.push({ fontSize: 7, text: "\n"});

        contenido.push({
            columns: [
                {
                    stack: [
                        { fontSize: 9, text: `Total Pagado:  $ ${totalCreditoFormato}`, alignment: 'right' },
                        { fontSize: 9, text: `Total Saldo:  $ ${totalSaldoFormato}`, alignment: 'right' }
                    ]
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

        if(parseFloat(totalDescuento) > 0){
            contenido.push({ fontSize: 10, text: "\n"});

            contenido.push({
                stack: [
                    { fontSize: 9, italics: true, alignment: 'center', text: `¡Hoy ahorraste $ ${totalDescuentoFormato}!`},
                    { fontSize: 9, italics: true, alignment: 'center', text: `Gracias a nuestras promociones y precios accesibles, cuidamos tu vista y tu bolsillo`}
                ]
            });
        }
        

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
        logger.log({level: 'error', label: filename + ' - ventaDetalle', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelReporte", "error", "mensaje");
    }

    return respuesta;
}

//export
module.exports = {
    ventaDetalle
}