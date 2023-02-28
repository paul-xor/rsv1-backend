import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as mysql from 'mysql2/promise';

const RDS_HOST = 'database-2.cmuvxrqhgxjx.us-east-1.rds.amazonaws.com';
const RDS_PORT = 3306;
const RDS_USER = 'admin';
const RDS_PASSWORD = 'NonaNona';
const RDS_DATABASE = 'reservationsDb';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const connection = await mysql.createConnection({
    host: RDS_HOST,
    port: RDS_PORT,
    user: RDS_USER,
    password: RDS_PASSWORD,
    database: RDS_DATABASE,
  });

  const searchTerm = event.queryStringParameters?.city || '';

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