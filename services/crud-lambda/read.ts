import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as mysql from 'mysql2/promise';
import { addCorsHeader } from '../../shared/util';
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

  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: ''
  }
  addCorsHeader(result);

  try {
    const [rows] = await connection.execute<mysql.RowDataPacket[]>('SELECT * FROM reservations');
    console.log(`Retrieved ${rows.length} reservations`);

    const formattedResults = rows.map((row: mysql.RowDataPacket) => {
      const extras = (row.extras).split(', ')
      const tags = (row.tags).split(', ')
      return {
        id: row.id,
        arrival_date: row.arrival_date,
        departure_date: row.departure_date,
        room_size: row.room_size,
        room_quantity: row.room_quantity,
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        phone: row.phone,
        street_name: row.street_name,
        street_number: row.street_number,
        zip_code: row.zip_code,
        state: row.state,
        city: row.city,
        extras,
        payment: row.payment,
        note: row.note,
        tags,
        reminder: row.reminder,
        newsletter: row.newsletter,
        confirm: row.confirm
      }
    })
    result.body = JSON.stringify(formattedResults)
  } catch (error) {
    console.error(`Error reading reservations: ${error}`);
    result.statusCode = 500,
      result.body = 'Error reading reservations'
  } finally {
    connection.end();
  }

  return result;
};
