import "reflect-metadata";
import { DataSource, ObjectLiteral, QueryRunner } from "typeorm";
import { processEnv } from "../../common/dotenv/processEnv";
import { EntityTarget } from 'typeorm/common/EntityTarget';

const typeormDS = new DataSource({
  type: 'mysql',
  host: processEnv.TYPEORM_HOST,
  port: +processEnv.TYPEORM_PORT,
  username: processEnv.TYPEORM_USERNAME,
  password: processEnv.TYPEORM_PASSWORD,
  database: processEnv.TYPEORM_DATABASE,
  entities: [__dirname + '/entity/**/*.entity.{ts,js}'],
  synchronize: true,
  logging: false,
});

let queryRunner: QueryRunner | undefined = undefined;
export const initializeTypeorm = async () => {
  await typeormDS.initialize();
  queryRunner = typeormDS.createQueryRunner();
  await queryRunner.connect();
};

export const releaseTypeorm = async () => {
  await queryRunner?.release();
};

export const getTypeormRepository = <Entity extends ObjectLiteral>(args: EntityTarget<Entity>) => {
  if (!queryRunner) throw new Error('TypeORMが初期化されていません。');
  return queryRunner.manager.getRepository(args);
};

export const getQueryRunnerForTest = () => queryRunner;
