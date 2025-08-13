
function generaCodigoOtp(){
  const numero = Math.floor(Math.random() * 10000); // 0 a 9999
  return numero.toString().padStart(4, '0');
}

module.exports = {
  generaCodigoOtp
}