const meses = new Array ("","Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");

function restarFechasADias(dateUno, dateDos){
  // Convertir las fechas a milisegundos
  const milisegundosActual = dateUno.getTime();
  const milisegundosPasada = dateDos.getTime();

  // Calcular la diferencia en milisegundos
  const diferenciaMilisegundos = milisegundosActual - milisegundosPasada;

  // Convertir la diferencia de milisegundos a días
  const diferenciaDias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));

  return diferenciaDias;
}

function segundosATiempoFormato(segundos){
  var horas = Math.floor(segundos / 3600);
    var minutos = Math.floor((segundos % 3600) / 60);
    var segundosRestantes = segundos % 60;

    // Añadir ceros a la izquierda si es necesario
    horas = (horas < 10) ? "0" + horas : horas;
    minutos = (minutos < 10) ? "0" + minutos : minutos;
    segundosRestantes = (segundosRestantes < 10) ? "0" + segundosRestantes : segundosRestantes;


  return horas + ":" + minutos + ":" + segundosRestantes;
}

function formatoMoneda(numero) {
  // Asegurar que el número tenga dos decimales
  var numeroFormateado = Number(numero).toFixed(2);

  // Aplicar formato con separadores de miles
  return numeroFormateado.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function minutosATiempoFormato(min){
  var horas = Math.floor(min / 60);
    var minutos = min % 60;
    var segundosRestantes = 0;

    // Añadir ceros a la izquierda si es necesario
    horas = (horas < 10) ? "0" + horas : horas;
    minutos = (minutos < 10) ? "0" + minutos : minutos;
    segundosRestantes = (segundosRestantes < 10) ? "0" + segundosRestantes : segundosRestantes;


  return horas + ":" + minutos + ":" + segundosRestantes;
}

function formatoMoneda(numero) {
  // Asegurar que el número tenga dos decimales
  var numeroFormateado = Number(numero).toFixed(2);

  // Aplicar formato con separadores de miles
  return numeroFormateado.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function fechaDDmmyyyyAYYYYmmdd(fecha) {
const [dia, mes, anio] = fecha.split('/');
const fechaFormateada = `${anio}-${mes}-${dia}`;

return fechaFormateada; // "2000-12-30"
}

function fechaYYYYmmddAFechaLiteral(fecha) {
  var fechaArray = fecha.split("-")
  var fechaInicioMostrar = fechaArray[2] + " de " + meses[parseInt(fechaArray[1])] + " de " + fechaArray[0];
  return fechaInicioMostrar;
}

function fechaDDmmyyyyAFechaLiteral(fecha) {
  var fechaArray = fecha.split("/")
  var fechaInicioMostrar = fechaArray[0] + " de " + meses[parseInt(fechaArray[1])] + " de " + fechaArray[2];
  return fechaInicioMostrar;
}

function sumarMinutos(antFecha, antHora, minutos) {
  const [anio, mes, dia] = antFecha.split('-');
  const [horas, minutosHora, segundosHora = 0] = antHora.split(':');

  const date = new Date(anio, mes - 1, dia, horas, minutosHora, segundosHora);

  // Sumar los minutos
  date.setMinutes(date.getMinutes() + minutos);

  // Obtener la nueva fecha y hora
  const fecha = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
  const hora = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  return { fecha, hora };
}

function formatoCantidadMedidaLiteral(data, cantidad) {
  let cantidadLiteral = "";
  let cant = cantidad;
  
  for(ii = data.length-1; ii>=0; ii--){
    if(parseInt(cant) >= parseInt(data[ii]["conversion"])){
      let c = 0
      let sobrante = 0
      if(parseInt(cant) != 0){
        c = Math.floor(parseInt(cant) / parseInt(data[ii]["conversion"]));
        sobrante = parseInt(cant) % parseInt(data[ii]["conversion"]); 
      }

      let letra = data[ii]["nombre"].charAt(data[ii]["nombre"].length - 1);
      let plural = "";
      if(letra == "a" || letra == "o" || letra == "A" || letra == "O"){
        plural = "s";
      }

      if(data[ii]["nombre"] == "Unidad" || data[ii]["nombren"] == "unidad" || data[ii]["nombre"] == "UNIDADES"){
        plural = "es";
      }

      if(parseInt(c) == 1){
        plural = "";
      }

      if(cant == 0){
        if(cantidadLiteral == ""){
          cantidadLiteral = cantidadLiteral + c + " " + data[ii]["nombre"] + plural
        }
        return;
      }

      cantidadLiteral = cantidadLiteral + c + " " + data[ii]["nombre"] + plural

      if(ii != 0){
        cantidadLiteral = cantidadLiteral + ", ";
      }

      cant = sobrante;
    }
  }
  cantidadLiteral = cantidadLiteral.replace(/, $/, '');
  return cantidadLiteral;
}

function calcularPrecioPorLista(data, cantidad) {
  let total = 0;
  let precioDetalle = []
  let cant = cantidad;
  
  for(ii = data.length-1; ii>=0; ii--){
    if(parseInt(cant) >= parseInt(data[ii]["cantMin"])){
      let c = 0
      let sobrante = 0
      if(parseInt(cant) != 0){
        c = Math.floor(parseInt(cant) / parseInt(data[ii]["cantMin"]));
        sobrante = parseInt(cant) % parseInt(data[ii]["cantMin"]); 

        let subTotal = ((parseInt(c) * parseInt(data[ii]["cantMin"])) * parseFloat(data[ii]["precio"]));
        precioDetalle.push({
          "nombreConversion": data[ii]["nombre"],
          "detalle": data[ii]["nombre"] + " (" + c + ") : Bs. " + formatoMoneda(subTotal),
          "cantidadFormato": c + " " + data[ii]["nombre"],
          "cantidad": parseInt(data[ii]["cantMin"]) * c,
          "precio": data[ii]["precio"],
          "precioFormato": formatoMoneda(data[ii]["precio"]),
          "subTotal": subTotal,
          "subTotalFormato": formatoMoneda(subTotal),
        });
        total = total + subTotal
      }
      

      if(cant == 0){
        return;
      }
      cant = sobrante;
    }
  }

  return {
    "total": total,
    "precioDetalle": precioDetalle
  };
}

module.exports = {
  restarFechasADias,
  segundosATiempoFormato,
  minutosATiempoFormato,
  formatoMoneda,
  fechaDDmmyyyyAYYYYmmdd,
  fechaYYYYmmddAFechaLiteral,
  fechaDDmmyyyyAFechaLiteral,
  formatoCantidadMedidaLiteral,
  sumarMinutos,
  calcularPrecioPorLista
}