import express from 'express';
import { app } from "../app";

export const commonSetting = () => {

  useLog();
  useJson();
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

/**
 * CORS設定
 */
const useCors = () => app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
