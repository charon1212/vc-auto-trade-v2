import 'dotenv/config';
import { processEnv } from "./common/dotenv/processEnv";
import { initLogConfig } from './common/log/log';
import { logger } from "./common/log/logger";
import { initializeTypeorm } from "./lib/typeorm/typeorm";

// 初期化作業
export const startup = async (processName: string) => {

  initLogConfig(processName);
  logger.info(`end startup function. processEnv:${JSON.stringify(processEnv)}`);
  await initializeTypeorm();

};
