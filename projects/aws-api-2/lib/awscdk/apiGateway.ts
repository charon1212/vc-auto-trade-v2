import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apiGateway from '@aws-cdk/aws-apigateway';

export type ApiGatewayParams = {
  scope: cdk.Construct,
  id: string,
  restApiName: string,
  endpointList: {
    path: string,
    method: string,
    handlerLambda: lambda.Function,
  }[],
};
/**
 * API-Gatewayを構築する。
 *
 * @param params.scope apiGateway.RestApiのコンストラクタ第1引数に渡す、cdk.Construct
 * @param params.id apiGateway.RestApiのコンストラクタ第2引数に渡す、ID。
 * @param params.restApiName API-Gatewayの名前
 * @param params.endpointList エンドポイント一覧。以下の要素を含む配列。
 * @param params.endpointList.path リソースパス。"vcat/v1/{productId}"のような文字列。最初と最後に"/"を含まないこと。
 * @param params.endpointList.method リソースの操作。GET, POST, PUT, DELETE, PATCH等々。
 * @param params.endpointList.handlerLambda 実行するLambda関数。
 * @returns 構築したAPI-Gateway
 */
export const constructApiGateway = (params: ApiGatewayParams) => {
  const { scope, id, restApiName, endpointList } = params;
  const api = new apiGateway.RestApi(scope, id, { restApiName });
  for (let endpoint of endpointList) {
    const segmentList = endpoint.path.split('/');
    let resource: apiGateway.IResource = api.root;
    for (let segment of segmentList) {
      resource = resource.getResource(segment) || resource.addResource(segment);
    }
    resource.addMethod(endpoint.method, new apiGateway.LambdaIntegration(endpoint.handlerLambda));
  }
  return api;
};
