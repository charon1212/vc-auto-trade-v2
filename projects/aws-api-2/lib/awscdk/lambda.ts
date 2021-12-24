import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import { LayerVersion } from '@aws-cdk/aws-lambda';

export type LambdaProp = {
  scope: cdk.Construct,
  id: string,
  codeDirPath: string,
  handler: string,
  environment?: { [key: string]: string; },
  layersArn?: string[],
};

/**
 * Lambda関数を構築する。
 * @param params.scope lambda.Functionのコンストラクタ第1引数に渡すscope。
 * @param params.id lambda.Functionのコンストラクタ第2引数に渡すID。このLambda関数を表す一意識別子で、多分同一AWSアカウント内で被らないように設定する。
 * @param params.codeDirPath lambda関数に渡すコードアセットのディレクトリ。プロジェクトディレクトリからの相対パス。
 * @param params.handler ハンドラーのファイル名と関数名。codeDirPathで指定したルートディレクトリからの相対パスと、関数名を指定する。例："Handler/Hoge/Top.handler"。
 * @param params.environment Lambda関数の環境変数。
 * @param params.layersArn lambda関数に設定するAWS Lambda LayerのARNの配列
 * @returns 構築したLambda関数。
 */
export const makeLambdaFunc = (params: LambdaProp) => {
  const { scope, id, codeDirPath, handler, environment, layersArn, } = params;

  const layers = layersArn?.map((arn) => (LayerVersion.fromLayerVersionArn(scope, id + '-layer-' + arn, arn)));
  const func = new lambda.Function(scope, id, {
    runtime: lambda.Runtime.NODEJS_14_X,
    code: lambda.Code.fromAsset(codeDirPath),
    handler: handler,
    environment: environment,
    layers: layers,
  });

  return func;
};
