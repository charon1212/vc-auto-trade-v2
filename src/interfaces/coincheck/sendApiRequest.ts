import AsyncLock from 'async-lock';
import fetch, { Response as FetchResponse } from 'node-fetch';
import { processEnv } from '../../common/dotenv/processEnv';
import * as crypto from 'crypto';
import { logger } from '../../common/log/logger';

export type ApiRequestParam = {
  uri: string,
  method?: 'GET' | 'POST',
  headers?: { [key: string]: string },
  requestParam?: { [key: string]: string },
  body?: string,
  isPrivate?: boolean,
};
export type ApiRequestResult = { success: true, response: FetchResponse, responseBody: any } | { success: false, response?: FetchResponse, responseBody?: any, error?: any, };

const hostUrlCoincheck = 'https://coincheck.com';
export const sendApiRequest = async (params: ApiRequestParam): Promise<ApiRequestResult> => {
  logger.trace(`SendApiRequest_Coincheck: ${JSON.stringify(params)}`);
  const { uri, method, headers, requestParam, isPrivate, body } = params;
  let url = hostUrlCoincheck + uri;
  if (requestParam) {
    url += '?';
    for (let key in requestParam) {
      url += encodeURIComponent(key) + '=' + encodeURIComponent(requestParam[key]);
    }
  }
  const authorizationHeader = isPrivate ? (await getAuthorizationHeader(url, body || '')) : {};
  try {
    const response = await fetch(url, {
      method: method || 'GET',
      headers: { 'Content-Type': 'application/json', ...headers, ...authorizationHeader },
      body,
    });
    const responseBody = await getResponseBody(response);
    if (response.ok) {
      logger.trace(`Success SendApiRequest_Coincheck. Response=${JSON.stringify(responseBody)}`);
      return { success: true, response, responseBody };
    } else {
      logger.trace(`Fail SendApiRequest_Coincheck. Response=${JSON.stringify(responseBody)}`);
      return { success: false, response, responseBody };
    }
  } catch (e) {
    logger.trace(`Fail SendApiRequest_Coincheck. Error=${JSON.stringify(e)}`);
    return { success: false, error: e };
  }
};

/**
 * Private APIの実行に必要なHTTP認証ヘッダーを生成する。
 *
 * @param url リクエストURL
 * @param body リクエスト本文
 * @returns HTTPヘッダーのうち、認証で必要な部分。
 */
const getAuthorizationHeader = async (url: string, body: string) => {
  const nonce = (await getNounce()).toString();
  const message = `${nonce}${url}${body}`;
  return {
    'ACCESS-KEY': processEnv.COINCHECK_API_KEY,
    'ACCESS-NONCE': nonce,
    'ACCESS-SIGNATURE': crypto.createHmac('sha256', processEnv.COINCHECK_SECRET_KEY).update(message).digest('hex'),
  };
};

const getResponseBody = async (response: FetchResponse) => {
  try {
    return response.json();
  } catch (e) {
    return undefined;
  }
};

/**
 * Nounce管理
 * リクエストごとに増加する正の整数を割り振る必要がある。
 */
const locker = new AsyncLock();
let requestNonce = 0; // リクエストごとに増加する必要のある正の整数。
const getNounce = async () => {
  return locker.acquire('coincheck-nounce', () => {
    if (requestNonce === 0) {
      requestNonce = Date.now();
    } else {
      requestNonce++;
    }
    return requestNonce;
  });
};

