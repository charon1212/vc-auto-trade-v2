import * as dotenv from 'dotenv';

export let processEnv = {
  TYPEORM_HOST: '',
  TYPEORM_PORT: '',
  TYPEORM_USERNAME: '',
  TYPEORM_PASSWORD: '',
  TYPEORM_DATABASE: '',
  LOG_LEVEL: '',
  LOG_PATH: '',
  COINCHECK_API_KEY: '',
  COINCHECK_SECRET_KEY: '',
  SLACK_BOT_AUTH_TOKEN: '',
  SLACK_CHANNEL_INFO: '',
  SLACK_CHANNEL_ERROR: '',
};
/**
 * 環境変数を読み込む。
 */
export const loadDotEnv = () => {
  dotenv.config();
  processEnv = {
    TYPEORM_HOST: process.env['TYPEORM_HOST'] || '',
    TYPEORM_PORT: process.env['TYPEORM_PORT'] || '',
    TYPEORM_USERNAME: process.env['TYPEORM_USERNAME'] || '',
    TYPEORM_PASSWORD: process.env['TYPEORM_PASSWORD'] || '',
    TYPEORM_DATABASE: process.env['TYPEORM_DATABASE'] || '',
    LOG_LEVEL: process.env['LOG_LEVEL'] || '',
    LOG_PATH: process.env['LOG_PATH'] || '',
    COINCHECK_API_KEY: process.env['COINCHECK_API_KEY'] || '',
    COINCHECK_SECRET_KEY: process.env['COINCHECK_SECRET_KEY'] || '',
    SLACK_BOT_AUTH_TOKEN: process.env['SLACK_BOT_AUTH_TOKEN'] || '',
    SLACK_CHANNEL_INFO: process.env['SLACK_CHANNEL_INFO'] || '',
    SLACK_CHANNEL_ERROR: process.env['SLACK_CHANNEL_ERROR'] || '',
  };
};
