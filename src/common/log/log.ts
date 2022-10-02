import { processEnv } from "../dotenv/processEnv";
import * as fs from 'fs';

class Log {
  private processName: string = '';
  private logBaseDirectory = '';
  constructor() { };
  init(processName: string) {
    if (!processEnv.LOG_PATH) throw new Error('ProcessEnv初期化前の実行');
    this.processName = processName;
    this.logBaseDirectory = `${processEnv.LOG_PATH}/${processName}`;
    if (!fs.existsSync(this.logBaseDirectory)) fs.mkdirSync(this.logBaseDirectory, { recursive: true });
  };
  log(logFilePath: string, logContent: string) {
    const path = `${this.logBaseDirectory}/${logFilePath}`;
    const l = `[${this.processName}][${(new Date()).toLocaleString('ja')}]${logContent}`;
    console.log(l);
    fs.writeFileSync(path, l + '\r\n', { flag: 'a' });
  };
};
const log = new Log();

export const initLogConfig = (processName: string) => log.init(processName);

export const writeLog = (logFilePath: string, logContent: string) => log.log(logFilePath, logContent);
