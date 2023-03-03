import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const connection = await mysql.createConnection({
    host: process.env.RDS_HOST,
    port: Number(process.env.RDS_PORT),
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DATABASE,
  });

  let searchTerm = event.toString();
  if (process.env.ENVIROMENT_DEV === 'dev') {
    searchTerm = event.queryStringParameters?.searchTerm || '';
  }

  try {
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(
      `SELECT * FROM reservations WHERE city LIKE ?`,
      [`${searchTerm}%`]
    );
    console.log(`Retrieved ${rows.length} reservations`);
    return {
      statusCode: 200,
      body: JSON.stringify(rows)
    };
  } catch (error) {
    console.error(`Error reading reservations: ${error}`);
    return {
      statusCode: 500,
      body: 'Error reading reservations'
    };
  } finally {
    connection.end();
  }
};