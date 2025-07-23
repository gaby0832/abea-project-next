import fs from 'fs';
import path from 'path';

const logsDir = path.resolve('logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFilePath = path.join(logsDir, 'rateLimit.log');

export default function logRequest(req) {
  const date = new Date().toISOString();
  const ip = req.ip || 'IP desconhecido';
  const method = req.method || 'METHOD desconhecido';
  const url = req.url || 'URL desconhecida';

  const logLine = `${date} - IP: ${ip} - Método: ${method} - Rota: ${url} - Bloqueado por rate limit\n`;

  fs.appendFile(logFilePath, logLine, (err) => {
    if (err) {
      console.error('Erro ao registrar IP no log:', err);
    }
  });
}