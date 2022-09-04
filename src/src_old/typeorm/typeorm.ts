import "reflect-metadata";
import { DataSource } from "typeorm";
import { processEnv } from "../../common/dotenv/processEnv";
import { PriceHistory } from "./entity/PriceHistory";
import { TradeResult } from "./entity/TradeResult";

export const typeormDS = new DataSource({
  type: 'mysql',
  host: processEnv.TYPEORM_HOST,
  port: +processEnv.TYPEORM_PORT,
  username: processEnv.TYPEORM_USERNAME,
  password: processEnv.TYPEORM_PASSWORD,
  database: processEnv.TYPEORM_DATABASE,
  entities: [PriceHistory, TradeResult],
  synchronize: true,
  logging: false,
});
