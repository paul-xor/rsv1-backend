import { APIGatewayProxyHandler } from 'aws-lambda';
// import { Client } from 'pg';

// const client = new Client({
//   host: 'your-rds-endpoint',
//   port: 5432,
//   database: 'your-database-name',
//   user: 'your-username',
//   password: 'your-password',
// });

export const handler: APIGatewayProxyHandler = async (event: any, context: any) => {
  const searchTerm = event['queryStringParameters']['search']
  const creteria = event['queryStringParameters']['creteria']
  // try {
  //   await client.connect();

  //   const result = await client.query('SELECT * FROM your-table');

  //   return {
  //     statusCode: 200,
  //     body: JSON.stringify(result.rows),
  //   };
  // } catch (err) {
  //   console.error(err);

  //   return {
  //     statusCode: 500,
  //     body: JSON.stringify({ message: 'Internal server error' }),
  //   };
  // } finally {
  //   await client.end();
  // }
  return {
    statusCode: 200,
    body: `Hello from Lambda! search: ${searchTerm}, creteria: ${creteria}`
  }
}
