import { sendSlackMessage } from "../../lib/slack/sendSlackMessage";
import { logger } from "../log/logger";

export type ErrorParam = {
  __filename: string,
  method: string,
  args?: object,
  err?: any,
};
/**
 * エラーハンドリング
 * usage: handleError({__filename, err, args:{param1, param2}, method: 'sampleMethod'});
 *
 * @param param.filePath 呼び出し元のファイルパス
 * @param param.methodName 呼び出し元のメソッド名
 * @param param.args 呼び出し元のメソッドの引数
 * @param param.err try-catchで発生したエラーの場合、スローした例外。
 */
export const handleError = async (param: ErrorParam) => {

  const { __filename, method, args, err } = param;
  let output = `${method}でエラー\r\n`;
  output += `■ファイルパス：${__filename}\r\n`;
  if (args) output += `■引数：${JSON.stringify(args)}\r\n`;
  if (err) {
    output += `■エラー内容：${JSON.stringify({ message: err.message, trace: err.trace, err, })}`;
  };
  logger.error(output);
  await sendSlackMessage(output, true);

};
