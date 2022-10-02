import AsyncLock from "async-lock";
import fetch, { Response as FetchResponse } from 'node-fetch';
import { processEnv } from "../../../common/dotenv/processEnv";
import * as crypto from 'crypto';
import { logger } from '../../../common/log/logger';
import { Result } from "../../../common/error/Result";
import { Vcat2Error, Vcat2ErrorCoincheckApi } from "../../../common/error/Vcat2Error";

export type CoincheckApiToolParam<RequestParam> = {
  isPrivate: boolean,
  method: 'GET' | 'POST' | 'DELETE',
  createRequest: (param: RequestParam) => {
    uri: string,
    headers?: { [key: string]: string },
    requestParam?: { [key: string]: string },
    body?: string,
  }
};

export class CoincheckApiTool<RequestParam, ResponseBodyType>{

  constructor(private param: CoincheckApiToolParam<RequestParam>) { }

  async request(param: RequestParam): Promise<Result<ResponseBodyType, Vcat2Error>> {
    logger.trace(`CoincheckApiTool_StartRequest: ${JSON.stringify(param)}`);
    const { uri, body, headers, requestParam } = this.param.createRequest(param);
    const url = createRequestUrl(uri, requestParam || {});
    const loggingParam = { url, headers, requestParam, body, };
    const authorizationHeader = this.param.isPrivate ? (await getAuthorizationHeader(url, body || '')) : {};
    try {
      const response = await fetch(url, {
        method: this.param.method,
        headers: { 'Content-Type': 'application/json', ...headers, ...authorizationHeader },
        body,
      });
      const responseBody = await getResponseBody(response);
      if (response.ok) {
        logger.trace(`[CoincheckApiTool_Success] Response=${JSON.stringify(responseBody)}`);
        return Result.success(responseBody as ResponseBodyType);
      } else {
        return Result.error(new Vcat2ErrorCoincheckApi(__filename, { isApiResponseError: true, param: loggingParam, responseBody }));
      }
    } catch (error) {
      return Result.error(new Vcat2ErrorCoincheckApi(__filename, { isApiResponseError: false, param: loggingParam, error }));
    }
  }

}

const hostUrlCoincheck = 'https://coincheck.com';
const createRequestUrl = (uri: string, requestParam: { [key: string]: string },) => {
  const requestParamArray = [] as string[];
  for (let key in requestParam) requestParamArray.push(encodeURIComponent(key) + '=' + encodeURIComponent(requestParam[key]));
  const requestParamStr = requestParamArray.join('&');
  return `${hostUrlCoincheck}${uri}` + (requestParamStr ? `?${requestParamStr}` : '');
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
  try { return response.json(); } catch (_) { return undefined; }
};

/**
 * Nounce管理
 * リクエストごとに増加する正の整数を割り振る必要がある。
 */
const locker = new AsyncLock();
let preNounce = 0;
const getNounce = async () => {
  return locker.acquire('coincheck-nounce', () => {
    let nounce = Date.now();
    if (nounce <= preNounce) nounce = preNounce + 1;
    return preNounce = nounce;
  });
};
