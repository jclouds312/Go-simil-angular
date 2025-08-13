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
        //console.log(entrada)
        let venta = entrada.venta;
        let detalleVenta = entrada.detalle;
        let totalCantidad = entrada.totalCantidad;
        let totalPrecioFormato = entrada.totalPrecioFormato;
        let totalCreditoFormato = entrada.totalCreditoFormato;
        let totalSaldoFormato = entrada.totalSaldoFormato;
        let totalPuntos = entrada.totalPuntos;

        let contenido = []
        let detalle = []

        contenido.push({
            columns: [
                {
                    stack: [
                        {
                            fontSize: 8,
                            text: [{ text: 'Usuario: ', bold: true }, { text: `${venta.usuario}` }]
                        }
                    ]
                },
                {
                    stack: [
                        {
                            fontSize: 8,
                            text: [{ text: 'Origen: ', bold: true }, { text: `${venta.tipoOrigen} ${venta.nombreAlmacenOrigen ?? ''} ${venta.nombreClienteOrigen ?? ''}`}]
                        },
                        {
                            fontSize: 8,
                            text: [{ text: 'Cliente: ', bold: true }, { text: `${venta.cliente ?? ''}` }]
                        }
                    ]
                },
                {
                    stack: [
                        {
                            fontSize: 8,
                            text: [{ text: 'Fecha: ', bold: true }, { text: venta["fechaVenta"] }]
                        },
                        {
                            fontSize: 8,
                            text: [{ text: 'Hora: ', bold: true }, { text: venta["horaVenta"] }]
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
            {text: 'Precio Unit.', ...estiloCelda },
            {text: 'SubTotal', ...estiloCelda}
        ])

        estiloCelda = {
            alignment: 'center',
            fontSize: 9,
            border: [false, false, false, true], // Solo borde inferior
            borderColor: '#07ABCB' // Color del borde inferior
        };
        
        for(let i = 0; i < detalleVenta.length ;i++){
            if(detalleVenta[i]["devolucion"] != "1"){
                let descuento;
                if(detalleVenta[i]["idDescuento"] != "1"){
                    descuento = [
                            { text: `Descuento de ${detalleVenta[i]["porcentaje"]}%`},
                            { text: `Bs. ${detalleVenta[i]["precioFinalFormato"]}`}
                        ]
                }else {
                    descuento = [
                            { text: `Bs. ${detalleVenta[i]["precioFinalFormato"]}`}
                        ]
                }

                detalle.push([
                    {text:(i+1), alignment: 'center', ...estiloCelda},
                    {
                        stack: [
                            { text: `COD: ${detalleVenta[i]["codigoLiteral"]}`, fontSize: 7 },
                            { text: `${detalleVenta[i]["nombre"]}`, bold: true }
                        ],
                        ...estiloCelda, // Aplica borde inferior aquí (no en los hijos)
                    },
                    {text: detalleVenta[i]["cantidad"], alignment: 'center', ...estiloCelda},
                    {
                        stack: [
                            descuento
                        ],
                        ...estiloCelda, // Aplica borde inferior aquí (no en los hijos)
                    },
                    {
                        stack: [
                            { text: `Bs. ${detalleVenta[i]["subTotalFormato"]}`, bold: true }
                        ],
                        ...estiloCelda, // Aplica borde inferior aquí (no en los hijos)
                    },
                ]);
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

        estiloCelda = {
            alignment: 'center',
            fontSize: 9,
            border: [false, false, false, false], // Solo borde inferior
            borderColor: '#07ABCB' // Color del borde inferior
        };


        contenido.push({ fontSize: 10, text: "\n"});
        contenido.push({
        columns: [
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
                            { text: "MONTO TOTAL: ", ...estiloCelda, alignment: 'right' },
                            { border: true, text: `Bs. ${totalPrecioFormato}`, ...estiloCelda, alignment: 'left' }
                        ],
                        [
                            { border: [false, false, false, false], text: "" },
                            { text: "TOTAL PAGADO: ", ...estiloCelda, alignment: 'right' },
                            { border: true, text: `Bs. ${totalCreditoFormato}`, ...estiloCelda, alignment: 'left' }
                        ],
                        [
                            { border: [false, false, false, false], text: "" },
                            { text: "TOTAL SALDO: ", ...estiloCelda, alignment: 'right' },
                            { border: true, text: `Bs. ${totalSaldoFormato}`, ...estiloCelda, alignment: 'left' }
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
        titulo: `VENTA NRO. ${venta.idVenta}`,
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
        logger.log({level: 'error', label: filename + ' - ventaDetalle', message: JSON.stringify(respuesta)});
        respuesta.mensaje = getMessageCategory("proceso", "nivelReporte", "error", "mensaje");
    }

    return respuesta;
}

//export
module.exports = {
    ventaDetalle
}