import winston from 'winston';

const { combine, timestamp, label, printf } = winston.format;

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    label({ label: 'app' }),
    timestamp(),
    printf(({ level, message, label, timestamp, ...meta }) => {
      const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
      return `${timestamp} [${label}] ${level.toUpperCase()}: ${message}${metaStr}`;
    })
  ),
  transports: [
    new winston.transports.File({ filename: 'Logger.log', level: 'info' }),
    new winston.transports.Console(),
  ],
});

export default logger;