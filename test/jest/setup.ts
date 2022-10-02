import 'dotenv/config';
import { getQueryRunnerForTest, initializeTypeorm, releaseTypeorm } from "../../src/lib/typeorm/typeorm";
import * as log from '../../src/common/log/log';

beforeAll(async () => {
  await initializeTypeorm();
});

beforeEach(async () => {
  await getQueryRunnerForTest()!.startTransaction();
  jest.spyOn(log, 'writeLog').mockImplementation((logFilePath: string, logContent: string) => console.log(logContent));
});

afterEach(async () => {
  await getQueryRunnerForTest()!.rollbackTransaction();
});

afterAll(async () => {
  await releaseTypeorm();
});
