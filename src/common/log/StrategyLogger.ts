import { MyDate } from 'util-charon1212/build/main/MyDate';
import { writeLog } from "./log";

export class StrategyLogger {

  constructor(private strategyBoxId: string) { };

  log(data: string) {
    const fileName = (new MyDate).format('yyyyMMdd.log');
    const filePath = `strategybox/${this.strategyBoxId}/${fileName}`;
    const content = `[${this.strategyBoxId}]${data}`;
    writeLog(filePath, content);
  };

};
