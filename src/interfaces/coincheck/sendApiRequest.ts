import fetch from 'node-fetch';

export type ApiRequestParam = {
  uri: string,
  method?: 'GET' | 'POST',
  headers?: { [key: string]: string },
  requestParam?: { [key: string]: string },
};

const hostUrlCoincheck = 'https://coincheck.com';
export const sendApiRequest = async (params: ApiRequestParam) => {
  const { uri, method, headers, requestParam } = params;
  let url = hostUrlCoincheck + uri;
  if (requestParam) {
    url += '?';
    for (let key in requestParam) {
      url += encodeURIComponent(key) + '=' + encodeURIComponent(requestParam[key]);
    }
  }
  try {
    const response = await fetch(url, {
      method: method || 'GET',
      headers: { ...headers },
    });
    return response;
  } catch (e) {
    return undefined;
  }
};
