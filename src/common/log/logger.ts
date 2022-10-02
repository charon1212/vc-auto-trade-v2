import { processEnv } from "../dotenv/processEnv";
import { MyDate } from 'util-charon1212/build/main/MyDate';
import { writeLog } from "./log";

type LogLevel = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'TRACE';

const canPutLog: { [key in LogLevel]: boolean } = {
  ERROR: true,
  WARN: processEnv.LOG_LEVEL !== 'ERROR',
  INFO: processEnv.LOG_LEVEL !== 'ERROR' && processEnv.LOG_LEVEL !== 'WARN',
  DEBUG: processEnv.LOG_LEVEL !== 'ERROR' && processEnv.LOG_LEVEL !== 'WARN' && processEnv.LOG_LEVEL !== 'INFO',
  TRACE: processEnv.LOG_LEVEL !== 'ERROR' && processEnv.LOG_LEVEL !== 'WARN' && processEnv.LOG_LEVEL !== 'INFO' && processEnv.LOG_LEVEL !== 'DEBUG',
};

/**
 * ファイル出力のパスが必要なので、このロガーはdotenvのインポート後に使うこと。
 */
export const logger = {
  error: (...data: any[]) => log('ERROR', data),
  warn: (...data: any[]) => log('WARN', data),
  info: (...data: any[]) => log('INFO', data),
  debug: (...data: any[]) => log('DEBUG', data),
  trace: (...data: any[]) => log('TRACE', data),
};

const log = (level: LogLevel, data: any) => {
  if (!canPutLog[level]) return;
  const filePath = (new MyDate).format('vcat2_yyyyMMdd.log');
  const content = `[${level}]${JSON.stringify(data)}`;
  writeLog(filePath, content);
};
