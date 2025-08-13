const messages = require('./messages.json');

function getMessageCategory(category, subcategory, type, code) {
  return messages[category][subcategory][type][code] || "Mensaje no encontrado.";
}

function getMessage(category, type, code) {
  return messages[category][type][code] || "Mensaje no encontrado.";
}

module.exports = {
  getMessageCategory,
  getMessage
};