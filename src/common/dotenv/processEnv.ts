import * as dotenv from 'dotenv';

/**
 * 環境変数を読み込む。
 */
export const loadDotEnv = () => {
  dotenv.config();
};

export const getProcessEnv = () => {
  return {
    TYPEORM_HOST: process.env['TYPEORM_HOST'] || '',
    TYPEORM_PORT: process.env['TYPEORM_PORT'] || '',
    TYPEORM_USERNAME: process.env['TYPEORM_USERNAME'] || '',
    TYPEORM_PASSWORD: process.env['TYPEORM_PASSWORD'] || '',
    TYPEORM_DATABASE: process.env['TYPEORM_DATABASE'] || '',
  };
};
