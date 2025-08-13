const path = require('path');
const config = require('../../config.js');
const meses = new Array ("","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
const convertir = require('../libreria/convertir.js');

function funcionTotal(tiempo, total){
    return [
        {border: [false, false, false, false], fontSize: 10, alignment:'center', text: ""},
        {border: [false, false, false, false], fontSize: 10, alignment:'center', text: ""},
        {border: [false, false, false, false], fontSize: 10, alignment:'center', text: ""},
        {border: [false, false, false, false], fontSize: 10, alignment:'center', text: ""},
        {border: [false, false, false, false], margin: [0, 3, 0, 15], fontSize: 10, color: '#07ABCB', alignment:'right', text: "TOTAL"},
        {border: [false, false, false, false], margin: [0, 3, 0, 15], fontSize: 10, color: '#0AA02A', alignment:'center', text: convertir.minutosATiempoFormato(tiempo)},
        {border: [false, false, false, false], margin: [0, 3, 0, 15], fontSize: 10, color: '#0AA02A', alignment:'right', text: "Bs. " + convertir.formatoMoneda(total)},
    ];
}

function funcionTotalVehiculo(tiempo, total){
    return [
        {border: [false, false, false, false], fontSize: 10, alignment:'center', text: ""},
        {border: [false, false, false, false], fontSize: 10, alignment:'center', text: ""},
        {border: [false, false, false, false], fontSize: 10, alignment:'center', text: ""},
        {border: [false, false, false, false], margin: [0, 3, 0, 15], fontSize: 10, color: '#07ABCB', alignment:'right', text: "TOTAL"},
        {border: [false, false, false, false], margin: [0, 3, 0, 15], fontSize: 10, color: '#0AA02A', alignment:'center', text: convertir.minutosATiempoFormato(tiempo)},
        {border: [false, false, false, false], margin: [0, 3, 0, 15], fontSize: 10, color: '#0AA02A', alignment:'right', text: "Bs. " + convertir.formatoMoneda(total)},
    ];
}

function reporteRegistroByParqueoFecha(registros){
    return new Promise(async (resolved, reject) =>{
        let rutaStorage = config.DIRECTORIO_STORAGE + "/" + config.NOMBRE_APP
        registro = registros["data"]["detalle"]
        
        var contenido = [];
        var detalle = [];

        var detalle=[];

        let estiloCelda = {
            fillColor: '#07ABCB', // Color de fondo
            color: '#ffffff', // Color del texto
            bold: true,
            alignment: 'center',
            fontSize: 10,
            border: [true, true,  true, true], // Solo borde inferior
            borderColor: '#FFF' // Color del borde inferior
        };

        detalle.push([
            {text: 'Nro', ...estiloCelda},
            {text: 'Salida', ...estiloCelda},
            {text: 'Entrada', ...estiloCelda },
            {text: 'Vehiculo', ...estiloCelda },
            {text: 'Observaciones', ...estiloCelda},
            {text: 'Tiempo', ...estiloCelda},
            {text: 'Total', ...estiloCelda}
        ])

        estiloCelda = {
            alignment: 'center',
            fontSize: 9,
            border: [false, false, false, true], // Solo borde inferior
            borderColor: '#07ABCB' // Color del borde inferior
        };

        let fechaMuesta = "";
        let totalCosto = 0;
        let totalTiempo = 0;
        for(let i = 0; i < registro.length ;i++){
            if(fechaMuesta != registro[i]["fechaSalida"]){

                if(fechaMuesta != ""){
                    detalle.push(funcionTotal(totalTiempo, totalCosto))
                }
                
                detalle.push([
                    {border: [false, false, false, false], fontSize: 10, alignment:'center', text: ""},
                    {colSpan: 6, border: [false, false, false, false], margin: [0, 15, 0, 3], fontSize: 10, color: '#07ABCB', alignment:'left', text: convertir.fechaDDmmyyyyAFechaLiteral(registro[i]["fechaSalida"])},
                ])

                fechaMuesta = registro[i]["fechaSalida"];
                totalCosto = 0;
                totalTiempo = 0;
            }

            detalle.push([
                {text:(i+1), alignment: 'center', ...estiloCelda},
                {stack: [
                    { text: 'Hora: ' + registro[i]["horaSalida"]}
                ], ...estiloCelda},
                {stack: [
                    { text: 'Hora: ' + registro[i]["horaEntrada"]},
                    { text: "Fecha: " + registro[i]["fechaEntrada"] }
                ], ...estiloCelda},
                {stack: [
                    { text: "Placa: " + registro[i]["placa"] },
                    { text: registro[i]["marca"] + " " + registro[i]["modelo"] + " " + registro[i]["anho"]}
                    
                ], ...estiloCelda},
                {stack: [
                    { text: 'Entrada: ' + registro[i]["observacionEntrada"]},
                    { text: "Salida: " + registro[i]["observacionSalida"] }
                ], ...estiloCelda},
                {text: registro[i]["tiempoFormato"], ...estiloCelda}, 
                {text: "Bs. " + registro[i]["costoFormato"], ...estiloCelda, alignment: 'right'},
            ]);

            totalCosto = totalCosto + parseFloat(registro[i]["costo"])
            totalTiempo = totalTiempo + parseFloat(registro[i]["tiempo"])

            if(i == (registro.length-1)){
                detalle.push(funcionTotal(totalTiempo, totalCosto))
            }
        }

        contenido.push({
            style: 'tableExample',
            table: {
                widths:[25, 100, 100, '*', '*', 55, 60],
                headerRows: 1,
                body: detalle
            }
        });

        estiloCelda = {
            fillColor: '#07ABCB', // Color de fondo
            color: '#ffffff', // Color del texto
            alignment: 'center',
            fontSize: 10,
            border: [true, true,  true, true], // Solo borde inferior
            borderColor: '#FFF' // Color del borde inferior
        };

        contenido.push({ fontSize: 10, text: "\n"});
        contenido.push({
            columns: [
                {
                    width: '*',
                    stack: [
                        { fontSize: 12, bold:true, alignment: 'left', italics:true, text: ""},
                    ]
                },
                {
                    width: 240,
                    stack: [
                        { fontSize: 12, bold:true, alignment: 'center', text: "RESULTADOS"},
                    ]
                }
            ] 
        });

        var resultado = [];
        resultado.push([
            {border: [false, false, false, false], text: ""},
            {text: "CANTIDAD DE REGISTRO: ", ...estiloCelda},
            {border: [true, true,  true, true], alignment: 'center', text: registro.length}
        ])

        resultado.push([
            {border: [false, false, false, false], text: ""},
            {text: "TOTAL DE TIEMPO: ", ...estiloCelda},
            {border: [true, true,  true, true], alignment: 'center', text: registros["data"]["tiempoTotalFormato"]}
        ])

        resultado.push([
            {border: [false, false, false, false], text: ""},
            {text: "MONTO TOTAL: ", ...estiloCelda},
            {border: [true, true,  true, true], alignment: 'center', text: "Bs. " + registros["data"]["totalFormato"]}
        ])
        

        contenido.push({
            style: 'tableExample',
            table: {
                widths:['*', 140, 100],
                body: resultado
            }
        });

        

        return resolved(contenido);
    });    
}

function reporteRegistroVehiculoByParqueoVehiculoFecha(registros){
    return new Promise(async (resolved, reject) =>{
        let rutaStorage = config.DIRECTORIO_STORAGE + "/" + config.NOMBRE_APP
        registro = registros["data"]["detalle"]
        
        var contenido = [];
        var detalle = [];

        var detalle=[];

        let estiloCelda = {
            fillColor: '#07ABCB', // Color de fondo
            color: '#ffffff', // Color del texto
            bold: true,
            alignment: 'center',
            fontSize: 10,
            border: [true, true,  true, true], // Solo borde inferior
            borderColor: '#FFF' // Color del borde inferior
        };

        detalle.push([
            {text: 'Nro', ...estiloCelda},
            {text: 'Entrada', ...estiloCelda },
            {text: 'Salida', ...estiloCelda},
            {text: 'Observaciones', ...estiloCelda},
            {text: 'Tiempo', ...estiloCelda},
            {text: 'Total', ...estiloCelda}
        ])

        estiloCelda = {
            alignment: 'center',
            fontSize: 9,
            border: [false, false, false, true], // Solo borde inferior
            borderColor: '#07ABCB' // Color del borde inferior
        };

        let placaMuestra = "";
        let totalCosto = 0;
        let totalTiempo = 0;
        for(let i = 0; i < registro.length ;i++){
            if(placaMuestra != registro[i]["placa"]){

                if(placaMuestra != ""){
                    detalle.push(funcionTotalVehiculo(totalTiempo, totalCosto))
                }
                
                detalle.push([
                    {border: [false, false, false, false], fontSize: 10, alignment:'center', text: ""},
                    {colSpan: 5, border: [false, false, false, false], margin: [0, 15, 0, 3], fontSize: 10, color: '#07ABCB', alignment:'left', text: "Vehiculo " + registro[i]["marca"] + " " + registro[i]["modelo"] + " " + registro[i]["anho"] + ", con Placa: " + registro[i]["placa"]},
                ])

                placaMuestra = registro[i]["placa"];
                totalCosto = 0;
                totalTiempo = 0;
            }

            detalle.push([
                {text:(i+1), alignment: 'center', ...estiloCelda},
                {stack: [
                    { text: 'Hora: ' + registro[i]["horaEntrada"]},
                    { text: "Fecha: " + registro[i]["fechaEntrada"] }
                ], ...estiloCelda},
                {stack: [
                    { text: 'Hora: ' + registro[i]["horaSalida"]},
                    { text: "Fecha: " + registro[i]["fechaSalida"] }
                ], ...estiloCelda},
                {stack: [
                    { text: 'Entrada: ' + registro[i]["observacionEntrada"]},
                    { text: "Salida: " + registro[i]["observacionSalida"] }
                ], ...estiloCelda},
                {text: registro[i]["tiempoFormato"], ...estiloCelda}, 
                {text: "Bs. " + registro[i]["costoFormato"], ...estiloCelda, alignment: 'right'},
            ]);

            totalCosto = totalCosto + parseFloat(registro[i]["costo"])
            totalTiempo = totalTiempo + parseFloat(registro[i]["tiempo"])

            if(i == (registro.length-1)){
                detalle.push(funcionTotalVehiculo(totalTiempo, totalCosto))
            }
        }

        contenido.push({
            style: 'tableExample',
            table: {
                widths:[25, 100, 100, '*', 55, 60],
                headerRows: 1,
                body: detalle
            }
        });

        estiloCelda = {
            fillColor: '#07ABCB', // Color de fondo
            color: '#ffffff', // Color del texto
            alignment: 'center',
            fontSize: 10,
            border: [true, true,  true, true], // Solo borde inferior
            borderColor: '#FFF' // Color del borde inferior
        };

        contenido.push({ fontSize: 10, text: "\n"});
        contenido.push({
            columns: [
                {
                    width: '*',
                    stack: [
                        { fontSize: 12, bold:true, alignment: 'left', italics:true, text: ""},
                    ]
                },
                {
                    width: 240,
                    stack: [
                        { fontSize: 12, bold:true, alignment: 'center', text: "RESULTADOS"},
                    ]
                }
            ] 
        });

        var resultado = [];
        resultado.push([
            {border: [false, false, false, false], text: ""},
            {text: "CANTIDAD DE REGISTRO: ", ...estiloCelda},
            {border: [true, true,  true, true], alignment: 'center', text: registro.length}
        ])

        resultado.push([
            {border: [false, false, false, false], text: ""},
            {text: "TOTAL DE TIEMPO: ", ...estiloCelda},
            {border: [true, true,  true, true], alignment: 'center', text: registros["data"]["tiempoTotalFormato"]}
        ])

        resultado.push([
            {border: [false, false, false, false], text: ""},
            {text: "MONTO TOTAL: ", ...estiloCelda},
            {border: [true, true,  true, true], alignment: 'center', text: "Bs. " + registros["data"]["totalFormato"]}
        ])
        

        contenido.push({
            style: 'tableExample',
            table: {
                widths:['*', 140, 100],
                body: resultado
            }
        });

        

        return resolved(contenido);
    });    
}

module.exports = {
    reporteRegistroByParqueoFecha,
    reporteRegistroVehiculoByParqueoVehiculoFecha
}