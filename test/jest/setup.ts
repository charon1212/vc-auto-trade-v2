import 'dotenv/config';
import { getQueryRunnerForTest, initializeTypeorm, releaseTypeorm } from "../../src/lib/typeorm/typeorm";
import * as log from '../../src/common/log/log';
import { cronSchedule } from '../../src/common/cron/cronSchedule';

beforeAll(async () => {
  await initializeTypeorm();
});

beforeEach(async () => {
  await getQueryRunnerForTest()!.startTransaction();
  jest.spyOn(log, 'writeLog').mockImplementation((logFilePath: string, logContent: string) => console.log(logContent));
  jest.spyOn(cronSchedule, 'everySecond').mockImplementation(() => () => ({}) as any);
  jest.spyOn(cronSchedule, 'everyMinute').mockImplementation(() => () => ({}) as any);
  jest.spyOn(cronSchedule, 'everyHour').mockImplementation(() => () => ({}) as any);
});

afterEach(async () => {
  await getQueryRunnerForTest()!.rollbackTransaction();
});

afterAll(async () => {
  await releaseTypeorm();
});
