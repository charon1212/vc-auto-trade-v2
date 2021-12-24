import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as events from '@aws-cdk/aws-events';
import { Duration } from '@aws-cdk/core';
import { LayerVersion } from '@aws-cdk/aws-lambda';
import * as targets from '@aws-cdk/aws-events-targets';

export type LambdaProp = {
  scope: cdk.Construct,
  id: string,
  codeDirPath: string,
  handler: string,
  environment?: { [key: string]: string; },
  timeoutSecond?: number,
  memorySize?: number,
  schedule?: {
    id: string,
    cron: events.CronOptions,
  },
  layersArn?: string[],
};

/**
 * Lambda関数を構築する。
 * @param params.scope lambda.Functionのコンストラクタ第1引数に渡すscope。
 * @param params.id lambda.Functionのコンストラクタ第2引数に渡すID。このLambda関数を表す一意識別子で、多分同一AWSアカウント内で被らないように設定する。
 * @param params.codeDirPath lambda関数に渡すコードアセットのディレクトリ。プロジェクトディレクトリからの相対パス。
 * @param params.handler ハンドラーのファイル名と関数名。codeDirPathで指定したルートディレクトリからの相対パスと、関数名を指定する。例："Handler/Hoge/Top.handler"。
 * @param params.environment Lambda関数の環境変数。
 * @param params.timeoutSecond タイムアウト。秒数で指定する。
 * @param params.memorySize メモリサイズ。
 * @param params.schedule Cloud Watch Eventで定期実行する場合は指定する。IDは構築するCloud Watch Eventの一意識別子。cronは定期実行のタイミングを表すcron。例：{ minute: '0', hour: '0', day: '*', month: '*', year: '*' }は毎日AM９時(UTC 0時)に定期実行する。
 * @param params.layersArn lambda関数に設定するAWS Lambda LayerのARNの配列
 * @returns 構築したLambda関数。
 */
export const makeLambdaFunc = (params: LambdaProp) => {
  const { scope, id, codeDirPath, handler, environment, timeoutSecond, memorySize, layersArn, } = params;

  const timeout = (timeoutSecond === undefined) ? undefined : Duration.seconds(timeoutSecond);
  const layers = layersArn?.map((arn) => (LayerVersion.fromLayerVersionArn(scope, id + '-layer-' + arn, arn)));

  const func = new lambda.Function(scope, id, {
    runtime: lambda.Runtime.NODEJS_14_X,
    code: lambda.Code.fromAsset(codeDirPath),
    handler: handler,
    environment: environment,
    timeout: timeout as any,
    memorySize: memorySize,
    layers: layers,
    retryAttempts: 0,
  });

  if (params.schedule) {
    const rule = new events.Rule(scope, params.schedule.id, {
      schedule: events.Schedule.cron(params.schedule.cron),
    });
    rule.addTarget(new targets.LambdaFunction(func));
  }

  return func;
};
