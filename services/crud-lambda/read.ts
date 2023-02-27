import { APIGatewayProxyHandler } from 'aws-lambda';
import * as mysql from 'mysql2/promise';

const RDS_HOST = 'database-2.cmuvxrqhgxjx.us-east-1.rds.amazonaws.com';
const RDS_PORT = 3306;
const RDS_USER = 'admin';
const RDS_PASSWORD = 'NonaNona';
const RDS_DATABASE = 'reservationsDb';

export const handler: APIGatewayProxyHandler = async (event: any, context: any) => {
  const connection = await mysql.createConnection({
    host: RDS_HOST,
    port: RDS_PORT,
    user: RDS_USER,
    password: RDS_PASSWORD,
    database: RDS_DATABASE,
  });

  try {
    const [rows] = await connection.execute<mysql.RowDataPacket[]>('SELECT * FROM reservations');
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