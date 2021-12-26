import fetch from "node-fetch";
import { processEnv } from "../../common/dotenv/processEnv";

const slacUrl = 'https://slack.com/api/';
export const sendSlackMessage = async (text: string, isError: boolean) => {

  const token = processEnv.SLACK_BOT_AUTH_TOKEN;
  const channel = isError ? processEnv.SLACK_CHANNEL_ERROR : processEnv.SLACK_CHANNEL_INFO;

  const url = slacUrl + 'chat.postMessage';
  const method = 'POST';
  const headers = {
    'content-type': 'application/json; charset=UTF-8',
    'authorization': 'Bearer ' + token,
  };
  const body = { channel, text };

  const res = await fetch(url, {
    method,
    body: JSON.stringify(body),
    headers,
  });
  return res;

};
