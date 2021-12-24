import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import { makeLambdaFunc } from './awscdk/lambda';
import { constructApiGateway } from './awscdk/apiGateway';
// import * as sqs from '@aws-cdk/aws-sqs';

export class AwsApi2Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const testLambda = makeLambdaFunc({
      scope: this,
      id: 'vcat2HelloLambda',
      handler: 'hello.handler',
      codeDirPath: 'lib/lambda',
    });
    constructApiGateway({
      scope: this,
      id: 'vcat2ApiGateway',
      restApiName: 'vcat2ApiGateway',
      endpointList: [
        { path: 'vcat2/v1/test', method: 'GET', handlerLambda: testLambda },
      ],
    });

  }
}
