import { processEnv } from "../dotenv/processEnv";
import * as fs from 'fs';

export class StrategyLogger {

  private logDirectoryPath: string;
  constructor(private strategyBoxId: string) {
    this.logDirectoryPath = `${processEnv.LOG_PATH}/strategybox/${strategyBoxId}`;
    if (!fs.existsSync(this.logDirectoryPath)) fs.mkdirSync(this.logDirectoryPath, { recursive: true });
  };

  log(data: string) {
    const timestamp = this.getTimestamp();
    const filePath = `${this.logDirectoryPath}/${timestamp}.log`;
    const content = `[${(new Date()).toLocaleString('ja')}][${this.strategyBoxId}]${data}`;
    fs.appendFileSync(filePath, content);
  };

  private getTimestamp() {
    const now = new Date();
    const year = (now.getUTCFullYear()).toString().padStart(4, '0');
    const month = (now.getUTCMonth() + 1).toString().padStart(2, '0');
    const date = (now.getUTCDate()).toString().padStart(2, '0');
    return `${year}${month}${date}`;
  }

};
