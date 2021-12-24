import { Handler } from 'aws-lambda'

// Lambda エントリーポイント
export const handler: Handler = async () => {
  console.log('Hello Lambda!')
  return {
    message: 'hello aws-cdk!',
  }
}
