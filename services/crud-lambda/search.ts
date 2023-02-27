import { APIGatewayProxyHandler } from 'aws-lambda';

export const handler: APIGatewayProxyHandler = async (event: any, context: any) => {
  const searchTerm = event['queryStringParameters']['search']
  const creteria = event['queryStringParameters']['creteria']

  return {
    statusCode: 200,
    body: `Hello from Lambda! search: ${searchTerm}, creteria: ${creteria}`
  }
}
