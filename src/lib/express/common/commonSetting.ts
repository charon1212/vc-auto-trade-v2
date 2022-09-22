import express from 'express';
import { app } from "../app";
import { processEnv } from '../../../common/dotenv/processEnv';

export const commonSetting = () => {

  useLog();
  useCors();
  useJson();
  useAuth();

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
    const headerAuthToken = req.header('AUTH-TOKEN');
    if (!headerAuthToken) return invalidResponse('[Express API認証エラー]AUTH-TOKENがない。');

    const validToken = processEnv.EXPRESS_AUTH_TOKEN;
    if (headerAuthToken !== validToken) return invalidResponse('[Express API認証エラー]tokenが一致しません。');

    // Authorization Success
    next();
  });
};

/**
 * CORS設定
 */
const useCors = () => app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type, auth-token, access_token');
  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});
