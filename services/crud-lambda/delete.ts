import { APIGatewayProxyEvent } from 'aws-lambda';
import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

export const handler = async (event: APIGatewayProxyEvent): Promise<{ statusCode: number; body: string }> => {
  const connection = await mysql.createConnection({
    host: process.env.RDS_HOST,
    port: Number(process.env.RDS_PORT),
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DATABASE,
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
