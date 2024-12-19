const winston = require('winston');
const path = require('path');


const logsDir = path.join(__dirname, '../../logs');

const fs = require('fs');
if (!fs.existsSync(logsDir)){
  fs.mkdirSync(logsDir);
}


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'enterprise-integration-platform' },
  transports: [
    
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.log'), 
      level: 'error' 
    }),
    
    new winston.transports.File({ 
      filename: path.join(logsDir, 'combined.log') 
    }),
    ...(process.env.NODE_ENV !== 'production' ? [
      new winston.transports.Console({
        format: winston.format.simple()
      })
    ] : [])
  ]
});

module.exports = logger;