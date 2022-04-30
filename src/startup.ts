import { loadDotEnv, processEnv } from "./common/dotenv/processEnv";
import { createLogDirectory, logger } from "./common/log/logger";
import { resetConnection } from "./typeorm/typeorm";

// 初期化作業
export const startup = async () => {

  loadDotEnv();
  await resetConnection();
  createLogDirectory();

  logger.info(`end startup function. processEnv:${JSON.stringify(processEnv)}`);

};
