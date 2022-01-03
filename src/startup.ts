import { loadDotEnv } from "./common/dotenv/processEnv";
import { resetConnection } from "./typeorm/typeorm";

// 初期化作業
export const startup = async () => {

  loadDotEnv();
  await resetConnection();

};
