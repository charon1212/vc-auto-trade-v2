import 'dotenv/config';
import { getQueryRunnerForTest, initializeTypeorm, releaseTypeorm } from "../../src/lib/typeorm/typeorm";

beforeAll(async () => {
  await initializeTypeorm();
});

beforeEach(async () => {
  await getQueryRunnerForTest()?.startTransaction();
});

afterEach(async () => {
  await getQueryRunnerForTest()?.rollbackTransaction();
});

afterAll(async () => {
  await releaseTypeorm();
});
