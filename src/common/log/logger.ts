import { processEnv } from "../dotenv/processEnv";
import * as fs from 'fs';

type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE';

export const logger = {
  error: (...data: any[]) => log('ERROR', data),
  warn: (...data: any[]) => log('WARN', data),
  info: (...data: any[]) => log('INFO', data),
  debug: (...data: any[]) => log('DEBUG', data),
  trace: (...data: any[]) => log('TRACE', data),
};

const log = (level: LogLevel, data: any) => {
  if (!canPutLog(level)) return;
  const dataStr = JSON.stringify(data);
  if (level === 'ERROR') console.error(dataStr);
  if (level === 'WARN') console.warn(dataStr);
  if (level === 'INFO') console.info(dataStr);
  if (level === 'DEBUG') console.debug(dataStr);
  if (level === 'TRACE') console.trace(dataStr);
  const path = getLogFilePath();
  if (path) fs.writeFileSync(path, `[${level}][${Date.now()}]${dataStr}\r\n`, { flag: 'a' });
};

const getLogFilePath = () => {
  if (!processEnv.LOG_PATH) return '';
  const now = new Date();
  const year = (now.getUTCFullYear()).toString().padStart(4, '0');
  const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
  const date = (now.getUTCDate()).toString().padStart(2, '0');
  return `${processEnv.LOG_PATH}/vcat2_${year}${month}${date}.log`;
};

const canPutLog = (logLevel: LogLevel) => {
  if (processEnv.LOG_LEVEL === 'ERROR')
    return logLevel === 'ERROR';
  if (processEnv.LOG_LEVEL === 'WARN')
    return logLevel === 'ERROR' || logLevel === 'WARN';
  if (processEnv.LOG_LEVEL === 'INFO')
    return logLevel === 'ERROR' || logLevel === 'WARN' || logLevel === 'INFO';
  if (processEnv.LOG_LEVEL === 'DEBUG')
    return logLevel === 'ERROR' || logLevel === 'WARN' || logLevel === 'INFO' || logLevel === 'DEBUG';
  return true;
};
