const path = require('path');
const config = require('../../config.js');
const meses = new Array ("","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
const convertir = require('../libreria/convertir.js');

function header(informacion, titulo, subTitulo){
    return new Promise(async (resolved, reject) =>{
      try{
        let rutaStorage = config.DIRECTORIO_STORAGE + "/" + config.NOMBRE_APP
        usuario = informacion["data"][0]

        let header = [];
        let detalle = [];
        let date = new Date();
        const fecha = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        const hora = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

        detalle.push([
            {colSpan: 1, border: [false, false, false, false], margin: [0, 3, 0, 3], fontSize: 10, fillColor: '#07ABCB', color: '#ffffff', alignment:'center', text: titulo},
        ])

        header.push({
            columns: [
                {
                    width: 80,
                    stack:[
                        { image: path.join(rutaStorage, 'imagenes', 'parqueos', usuario["imagenParqueo"]), width: 60, alignment: "left"},
                      ]
                },
                {
                    width: '*',
                    stack:[
                        { style: 'tableExample',
                            table: {
                                widths:['*'],
                                headerRows: 1,
                                body: detalle
                            }
                        },
                        subTitulo
                    ],
                    margin: [0, 15, 0, 0]
                    
                },
                {
                    width: 150,
                    stack:[
                        { fontSize: 6, alignment: "right", color: "#000000", text: 'DETALLES DE IMPRESION', bold: true},
                        { fontSize: 6, alignment: "right", color: "#000000", text: 'Parqueo: ' + usuario["nombreParqueo"]},
                        { fontSize: 6, alignment: "right", color: "#000000", text: 'Personal: ' + usuario["nombreUsuario"] + " " + usuario["appatUsuario"] + " " + usuario["apmatUsuario"]},
                        { fontSize: 6, alignment: "right", color: "#000000", text: 'Cargo: ' + usuario["nombreRol"]},
                        { fontSize: 6, alignment: "right", color: "#000000", text: 'Fecha y Hora: ' + convertir.fechaYYYYmmddAFechaLiteral(fecha) + ' - ' + hora}
                    ],
                    margin: [0, 15, 0, 0]
                }
            ]
        })
        
        return resolved(header);
      }catch(error){
        console.log(error)
        return resolved({"mysql":error});
      }
    })
  }
  
  function footer(){
      return new Promise((resolved, reject) =>{
          var footer = [];
  
          footer.push({
              margin: [ 80, 10, 40, 40 ],
              fontSize: 8,
              columns: [
                  { text: '©GoodCars', italics: true },
                  { text: 'Pagina ' + currentPage.toString() + ' de ' + pageCount, italics: true, alignment: 'right' }
              ],
          });
  
          return resolved(footer);
      })
  }
  
  module.exports = {
      header,
      footer
  }