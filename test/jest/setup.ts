import 'dotenv/config';
import { getQueryRunnerForTest, initializeTypeorm, releaseTypeorm } from "../../src/lib/typeorm/typeorm";

beforeAll(async () => {
  console.log('setup-before-all');
  await initializeTypeorm();
});

beforeEach(async () => {
  console.log('setup-before-each');
  await getQueryRunnerForTest()?.startTransaction();
});

afterEach(async () => {
  console.log('setup-after-each');
  await getQueryRunnerForTest()?.rollbackTransaction();
});

afterAll(async () => {
  console.log('setup-after-all');
  await releaseTypeorm();
});
