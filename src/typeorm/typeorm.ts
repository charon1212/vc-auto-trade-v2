import "reflect-metadata";
import { Connection, createConnection } from "typeorm";
import { getProcessEnv } from "../common/dotenv/processEnv";
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
  const env = getProcessEnv();
  conn = await createConnection({
    type: 'mysql',
    host: env.TYPEORM_HOST,
    port: +env.TYPEORM_PORT,
    username: env.TYPEORM_USERNAME,
    password: env.TYPEORM_PASSWORD,
    database: env.TYPEORM_DATABASE,
    entities: [PriceHistory],
    synchronize: true,
    logging: false,
  });
};
