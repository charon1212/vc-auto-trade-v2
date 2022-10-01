import AsyncLock from "async-lock";
import fetch, { Response as FetchResponse } from 'node-fetch';
import { processEnv } from "../../../common/dotenv/processEnv";
import * as crypto from 'crypto';
import { logger } from '../../../common/log/logger';
import { handleError } from "../../../common/error/handleError";

export type CoincheckApiToolParam<RequestParam, ErrorResponse> = {
  isPrivate: boolean,
  method: 'GET' | 'POST' | 'DELETE',
  createRequest: (param: RequestParam) => {
    uri: string,
    headers?: { [key: string]: string },
    requestParam?: { [key: string]: string },
    body?: string,
  },
  handleError?: (param: { response?: FetchResponse, responseBody?: unknown, error?: unknown }) => ErrorResponse,
};

export class CoincheckApiTool<RequestParam, ResponseBodyType, ErrorResponse = undefined>{

  constructor(private param: CoincheckApiToolParam<RequestParam, ErrorResponse>) { }

  async request(param: RequestParam): Promise<ResponseBodyType | ErrorResponse | undefined> {
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
        return responseBody as ResponseBodyType;
      } else {
        if (this.param.handleError) {
          return this.param.handleError({ response, responseBody, });
        } else {
          logger.error(`[CoincheckApiTool_Error] Info=${JSON.stringify({ param: loggingParam, responseBody })}`);
          handleError({ __filename, method: 'request', args: { param } });
          return undefined;
        }
      }
    } catch (e) {
      if (this.param.handleError) {
        return this.param.handleError({ error: e });
      } else {
        logger.error(`[CoincheckApiTool_Error] Info=${JSON.stringify({ param: loggingParam, error: e })}`);
        handleError({ __filename, method: 'request', args: { param } });
        return undefined;
      }
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
