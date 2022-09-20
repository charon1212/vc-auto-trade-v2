import express from 'express';
import { app } from "../app";
import * as crypto from 'crypto';
import { processEnv } from '../../../common/dotenv/processEnv';

export const commonSetting = () => {

  useLog();
  useJson();
  useAuth();
  useCors();

};

/**
 * logging
 */
const useLog = () => app.use((req, _, next) => {
  console.log('**REQUEST**');
  console.log(JSON.stringify({
    url: req.url,
    headers: req.headers,
    body: req.body,
    params: req.params,
    query: req.query,
  }));
  next();
});

/**
 * JSON parserを設定し、request.bodyをJSONオブジェクトにする。
 * see:https://expressjs.com/ja/4x/api.html#req.body
 * > By default, it is undefined, and is populated when you use body-parsing middleware such as express.json() or express.urlencoded().
 */
const useJson = () => app.use(express.json());


let authCounter = 0;
/**
 * 独自認証
 */
const useAuth = () => {
  app.use((req, res, next) => {
    const invalidResponse = (logMessage: string) => {
      console.log(logMessage);
      res.statusCode = 400;
      res.send({ message: '不正なリクエスト' });
    };
    const headerAuthTimestamp = req.header('AUTH-TIMESTAMP');
    if (!headerAuthTimestamp) return invalidResponse('[Express API認証エラー]AUTH-TIMESTAMPがない。');
    if (isNaN(+headerAuthTimestamp)) return invalidResponse('[Express API認証エラー]AUTH-TIMESTAMPが数値ではない。');
    const headerAuthToken = req.header('AUTH-TOKEN');
    if (!headerAuthToken) return invalidResponse('[Express API認証エラー]AUTH-TOKENがない。');
    if (+headerAuthTimestamp <= authCounter) return invalidResponse('[Express API認証エラー]AUTH-TIMESTAMPが古い。');

    const validToken = crypto.createHmac('sha256', processEnv.EXPRESS_AUTH_TOKEN).update(headerAuthTimestamp).digest('hex');
    if (headerAuthToken !== validToken) return invalidResponse('[Express API認証エラー]tokenが一致しません。');

    // Authorization Success
    authCounter = +headerAuthTimestamp;
    next();
  });
};

/**
 * CORS設定
 */
const useCors = () => app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
