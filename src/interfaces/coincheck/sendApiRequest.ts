import AsyncLock from 'async-lock';
import fetch from 'node-fetch';
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

const hostUrlCoincheck = 'https://coincheck.com';
export const sendApiRequest = async (params: ApiRequestParam) => {
  logger.info(`SendApiRequest_Coincheck: ${JSON.stringify(params)}`);
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
      headers: { ...headers, ...authorizationHeader },
      body,
    });
    return { response };
  } catch (e) {
    return { error: e };
  }
};

const getAuthorizationHeader = async (url: string, body: string) => {
  const nonce = (await getNounce()).toString();
  const message = `${nonce}${url}${body}`;
  return {
    'ACCESS-KEY': processEnv.COINCHECK_API_KEY,
    'ACCESS-NONCE': nonce,
    'ACCESS-SIGNATURE': crypto.createHmac('sha256', processEnv.COINCHECK_SECRET_KEY).update(message).digest('hex'),
  };
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

