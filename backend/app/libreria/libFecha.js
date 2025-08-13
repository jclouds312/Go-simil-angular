function fechaHoraActualyymmdd() {
  const date = new Date();
  const fecha = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  const hora = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return {fecha, hora};
}

function fechaHoraActualddmmyyyy() {
  const date = new Date();
  const fecha = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  const hora = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return {fecha, hora};
}

function formatearFecha(fecha) {
  const fechaFormateada = new Date(fecha);
  return fechaFormateada.toISOString().split('T')[0];
}

module.exports = {
  fechaHoraActualyymmdd,
  fechaHoraActualddmmyyyy,
  formatearFecha
}