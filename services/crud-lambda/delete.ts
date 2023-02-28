import { APIGatewayProxyEvent } from 'aws-lambda';
import * as mysql from 'mysql2/promise';

const RDS_HOST = 'database-2.cmuvxrqhgxjx.us-east-1.rds.amazonaws.com';
const RDS_PORT = 3306;
const RDS_USER = 'admin';
const RDS_PASSWORD = 'NonaNona';
const RDS_DATABASE = 'reservationsDb';

export const handler = async (event: APIGatewayProxyEvent): Promise<{ statusCode: number; body: string }> => {
  const connection = await mysql.createConnection({
    host: RDS_HOST,
    port: RDS_PORT,
    user: RDS_USER,
    password: RDS_PASSWORD,
    database: RDS_DATABASE,
  });

  try {
    const reservationId = event.queryStringParameters?.id;

    const [result] = await connection.execute<mysql.OkPacket>(
      'DELETE FROM reservations WHERE id = ?',
      [reservationId]
    );

    console.log(`Deleted ${result.affectedRows} reservations`);
    return {
      statusCode: 204,
      body: ''
    };
  } catch (error) {
    console.error(`Error deleting reservation: ${error}`);
    return {
      statusCode: 500,
      body: 'Error deleting reservation'
    };
  } finally {
    connection.end();
  }
};
