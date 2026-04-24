import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

const format = printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} [${level}]: ${message} ${
    Object.keys(meta).length ? JSON.stringify(meta) : ''
  }`;
});

export const logger = winston.createLogger({
  level: 'info',

  format: combine(colorize(), timestamp(), format),

  transports: [new winston.transports.Console()],
});
