import { processEnv } from "./common/dotenv/processEnv";
import { createLogDirectory, logger } from "./common/log/logger";
import 'dotenv/config';

// 初期化作業
export const startup = async (needLogDir: boolean) => {

  if (needLogDir) createLogDirectory();
  logger.info(`end startup function. processEnv:${JSON.stringify(processEnv)}`);

};
