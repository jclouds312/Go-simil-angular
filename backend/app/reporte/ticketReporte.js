const path = require('path');
const config = require('../../config.js');
const meses = new Array ("","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");

function reporteTicketEntradaByRegistro(registro){
    return new Promise(async (resolved, reject) =>{
        let rutaStorage = config.DIRECTORIO_STORAGE + "/" + config.NOMBRE_APP
        registro = registro["data"][0]
        
        let mensajeTarifa = ""
        let mensajeCosto = ""

        if(registro["tipo"] == "UNICA"){
          mensajeTarifa = "COSTO UNICO"
          mensajeCosto = "Bs. " + registro["precio"]
        }

        if(registro["tipo"] == "MINUTO"){
          mensajeTarifa = "COSTO POR MINUTO"
          mensajeCosto = "Bs. " + registro["precio"] + " el minuto."
        }

        if(registro["tipo"] == "HORA"){
          mensajeTarifa = "COSTO POR HORA"
          mensajeCosto = "Bs. " + registro["precio"] + " la hora."
        }

        var contenido = [];
        var detalle = [];

        contenido.push ([
            {
                image: path.join(rutaStorage, 'imagenes', 'pdf', 'flecha.png'),
                width: 20,
                absolutePosition: {x: 65, y: 10}
            }    
        ])

        contenido.push ([
            {
                image: path.join(rutaStorage, 'imagenes', 'pdf', 'flecha.png'),
                width: 20,
                absolutePosition: {x: 150, y: 10}
            }    
        ])

        contenido.push(
            { canvas: [{ type: 'line', x1: 0, y1: 30, x2: 210, y2: 30, lineWidth: 1, lineColor: 'black' }] }
        );

        contenido.push({
            stack: [
                { fontSize: 12, bold: true, alignment: 'center', text: 'TICKET DE CONTROL'},
                { fontSize: 10, italics:true, alignment: 'center', text: "Parqueo: " + registro["nombreParqueo"] }
            ],
            margin: [0, 5, 0, 5] // Establecer margen solo en la parte superior del stack [left, top, right, bottom]
        });

        contenido.push(
            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 210, y2: 0, lineWidth: 1, lineColor: 'black' }] }
        );

        contenido.push({ fontSize: 10, text: "\n"});
        contenido.push({
            columns: [
                {
                    stack: [
                        { fontSize: 8, bold:true, alignment: 'left', italics:true, text: "DETALLE DE ENTRADA"},
                        { fontSize: 1, text: "\n"},
                        { fontSize: 8, text: 'Hora: ' + registro["horaEntrada"] },
                        { fontSize: 8, text: 'Fecha: ' + registro["fechaEntrada"] }
                    ]
                },
                {
                    stack: [
                        { fontSize: 8, bold:true, alignment: 'left', italics:true, text: "TARIFARIO"},
                        { fontSize: 1, text: "\n"},
                        { fontSize: 8, text: mensajeTarifa },
                        { fontSize: 8, text: 'Costo: ' + mensajeCosto }
                    ]
                }
            ]  
        });

        contenido.push({ fontSize: 10, text: "\n"});
        contenido.push({ fontSize: 8, bold:true, alignment: 'left', italics:true, text: "VEHICULO"});
        contenido.push({ fontSize: 1, text: "\n"});
        contenido.push({
            columns: [
                {
                    width: '70%', 
                    stack: [
                        { fontSize: 8, text: registro["marca"] + " " + registro["modelo"] + " " + registro["anho"] }
                    ]
                },
                {
                    width: '*',
                    stack: [
                        { fontSize: 8, alignment: 'right', text: 'Placa: ' + registro["placa"] }
                    ]
                }
            ]  
        });

        contenido.push({ fontSize: 10, text: "\n"});
        contenido.push({ fontSize: 8, italics:true, alignment: 'center', text: "Busca y descarga nuestra aplicación AUTO SERVICIOS YA! en PLAY STORE para tener un ticket virtual y conocer mayores puntos de servicios."});

        return resolved(contenido);
    });    
}

function reporteTicketSalidaByRegistro(registro){
    return new Promise(async (resolved, reject) =>{
        let rutaStorage = config.DIRECTORIO_STORAGE + "/" + config.NOMBRE_APP
        registro = registro["data"][0]
        
        let mensajeTarifa = ""
        let mensajeCosto = ""

        if(registro["tipo"] == "UNICA"){
          mensajeTarifa = "COSTO UNICO"
          mensajeCosto = "Bs. " + registro["precio"]
        }

        if(registro["tipo"] == "MINUTO"){
          mensajeTarifa = "COSTO POR MINUTO"
          mensajeCosto = "Bs. " + registro["precio"] + " el minuto."
        }

        if(registro["tipo"] == "HORA"){
          mensajeTarifa = "COSTO POR HORA"
          mensajeCosto = "Bs. " + registro["precio"] + " la hora."
        }

        var contenido = [];
        var detalle = [];

        contenido.push ([
            {
                image: path.join(rutaStorage, 'imagenes', 'pdf', 'flecha.png'),
                width: 20,
                absolutePosition: {x: 65, y: 10}
            }    
        ])

        contenido.push ([
            {
                image: path.join(rutaStorage, 'imagenes', 'pdf', 'flecha.png'),
                width: 20,
                absolutePosition: {x: 150, y: 10}
            }    
        ])

        contenido.push(
            { canvas: [{ type: 'line', x1: 0, y1: 30, x2: 210, y2: 30, lineWidth: 1, lineColor: 'black' }] }
        );

        contenido.push({
            stack: [
                { fontSize: 12, bold: true, alignment: 'center', text: 'TICKET DE SALIDA'},
                { fontSize: 10, italics:true, alignment: 'center', text: "Parqueo: " + registro["nombreParqueo"] }
            ],
            margin: [0, 5, 0, 5] // Establecer margen solo en la parte superior del stack [left, top, right, bottom]
        });

        contenido.push(
            { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 210, y2: 0, lineWidth: 1, lineColor: 'black' }] }
        );

        contenido.push({ fontSize: 10, text: "\n"});
        contenido.push({ fontSize: 8, bold:true, alignment: 'center', italics:true, text: "TARIFARIO"});
        contenido.push({ fontSize: 1, text: "\n"});
        contenido.push({
            columns: [
                {
                    stack: [
                        { fontSize: 8, text: mensajeTarifa },
                        { fontSize: 8, text: 'Costo: ' + mensajeCosto }
                    ]
                },
                {
                    stack: [
                        { fontSize: 8, text: "Duración: " + registro["tiempoFormato"] },
                        { fontSize: 8, bold:true, text: "Total a pagar: Bs. " + registro["costoFormato"] }
                    ]
                }
            ]  
        });

        contenido.push({ fontSize: 10, text: "\n"});
        contenido.push({
            columns: [
                {
                    stack: [
                        { fontSize: 8, bold:true, alignment: 'left', italics:true, text: "DETALLE DE ENTRADA"},
                        { fontSize: 1, text: "\n"},
                        { fontSize: 8, text: 'Hora: ' + registro["horaEntrada"] },
                        { fontSize: 8, text: 'Fecha: ' + registro["fechaEntrada"] }
                    ]
                },
                {
                    stack: [
                        { fontSize: 8, bold:true, alignment: 'left', italics:true, text: "DETALLE DE SALIDA"},
                        { fontSize: 1, text: "\n"},
                        { fontSize: 8, text: 'Hora: ' + registro["horaSalida"] },
                        { fontSize: 8, text: 'Fecha: ' + registro["fechaSalida"] }
                    ]
                }
            ]  
        });

        
        contenido.push({ fontSize: 10, text: "\n"});
        contenido.push({ fontSize: 8, bold:true, alignment: 'left', italics:true, text: "VEHICULO"});
        contenido.push({ fontSize: 1, text: "\n"});
        contenido.push({
            columns: [
                {
                    width: '70%', 
                    stack: [
                        { fontSize: 8, text: registro["marca"] + " " + registro["modelo"] + " " + registro["anho"] }
                    ]
                },
                {
                    width: '*',
                    stack: [
                        { fontSize: 8, alignment: 'right', text: 'Placa: ' + registro["placa"] }
                    ]
                }
            ]  
        });

        contenido.push({ fontSize: 10, text: "\n"});
        contenido.push({ fontSize: 8, italics:true, alignment: 'center', text: "Busca y descarga nuestra aplicación AUTO SERVICIOS YA! en PLAY STORE para tener un ticket virtual y conocer mayores puntos de servicios."});

        return resolved(contenido);
    });    
}

module.exports = {
    reporteTicketEntradaByRegistro,
    reporteTicketSalidaByRegistro
}