import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as mysql from 'mysql2/promise';
import { addCorsHeader } from '../../shared/util';

const RDS_HOST = 'database-2.cmuvxrqhgxjx.us-east-1.rds.amazonaws.com';
const RDS_PORT = 3306;
const RDS_USER = 'admin';
const RDS_PASSWORD = 'NonaNona';
const RDS_DATABASE = 'reservationsDb';

interface ISearchResult {
  id: string;
  arrival_date: string;
  departure_date: string;
  room_size: string;
  room_quantity: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street_name: string;
  street_number: string;
  zip_code: string;
  state: string;
  city: string;
  extras: string;
  payment: string;
  note: string;
  tags: string;
  reminder: boolean;
  newsletter: boolean;
  confirm: boolean;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const connection = await mysql.createConnection({
    host: RDS_HOST,
    port: RDS_PORT,
    user: RDS_USER,
    password: RDS_PASSWORD,
    database: RDS_DATABASE,
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
