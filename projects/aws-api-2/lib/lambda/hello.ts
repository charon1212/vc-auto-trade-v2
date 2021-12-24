import { Handler } from 'aws-lambda'

// Lambda エントリーポイント
export const handler: Handler = async () => {
  console.log('Hello Lambda!')
  const body = {
    message: 'hello aws-cdk!',
  };
  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: {},
    body: JSON.stringify(body),
  }
}
