import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import { processEnv } from "../common/dotenv/processEnv";
import { PriceHistory } from "./entity/PriceHistory";

let conn: Connection | undefined = undefined;

export const connected = () => { return conn !== undefined };

export const getConnection = () => {
  if (conn) return conn;
  throw new Error('typeormコネクションの初期化前にgetConnection呼び出しが発生。');
};

export const resetConnection = async () => {
  if (conn) {
    await conn.close();
  }
  conn = await createConnection({
    type: 'mysql',
    host: processEnv.TYPEORM_HOST,
    port: +processEnv.TYPEORM_PORT,
    username: processEnv.TYPEORM_USERNAME,
    password: processEnv.TYPEORM_PASSWORD,
    database: processEnv.TYPEORM_DATABASE,
    entities: [PriceHistory],
    synchronize: true,
    logging: false,
  });
};
