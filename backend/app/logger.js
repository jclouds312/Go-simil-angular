const config = require('../config.js');

const winston = require('winston');
const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf } = format;
const DailyRotateFile = require('winston-daily-rotate-file');

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `[${timestamp}] [${label.toUpperCase()}] [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
  format: combine(
    timestamp({ format: 'HH:mm:ss' }),
    myFormat
  ),
  transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: `${config.DIRECTORIO_LOG}/${config.NOMBRE_APP}/` + '%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
});

exports.logger = logger;