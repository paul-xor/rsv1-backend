import { APIGatewayProxyHandler } from 'aws-lambda';
import * as mysql from 'mysql2/promise';

const RDS_HOST = 'database-2.cmuvxrqhgxjx.us-east-1.rds.amazonaws.com';
const RDS_PORT = 3306;
const RDS_USER = 'admin';
const RDS_PASSWORD = 'NonaNona';
const RDS_DATABASE = 'reservationsDb';

interface Reservation {
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
  extras?: string;
  payment: string;
  note?: string;
  tags?: string;
  reminder: boolean;
  newsletter: boolean;
  confirm: boolean;
}

export const handler: APIGatewayProxyHandler = async (event: any, context: any) => {
  const connection = await mysql.createConnection({
    host: RDS_HOST,
    port: RDS_PORT,
    user: RDS_USER,
    password: RDS_PASSWORD,
    database: RDS_DATABASE,
  });

  try {
    const body = JSON.parse(event.body);
    const {
      arrival_date,
      departure_date,
      room_size,
      room_quantity,
      first_name,
      last_name,
      email,
      phone,
      street_name,
      street_number,
      zip_code,
      state,
      city,
      extras,
      payment,
      note,
      tags,
      reminder,
      newsletter,
      confirm,
    } = body as Reservation;

    const [result] = await connection.execute<mysql.OkPacket>('INSERT INTO reservations (arrival_date, departure_date, room_size, room_quantity, first_name, last_name, email, phone, street_name, street_number, zip_code, state, city, extras, payment, note, tags, reminder, newsletter, confirm) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
      arrival_date,
      departure_date,
      room_size,
      room_quantity,
      first_name,
      last_name,
      email,
      phone,
      street_name,
      street_number,
      zip_code,
      state,
      city,
      extras,
      payment,
      note,
      tags,
      reminder,
      newsletter,
      confirm
    ]);

    const insertId = result.insertId;
    console.log(`Inserted reservation with ID ${insertId}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Successfully created reservation with ID ${insertId}` })
    };
  } catch (error) {
    console.error(`Error creating reservation: ${error}`);
    return {
      statusCode: 500,
      body: 'Error creating reservation'
    };
  } finally {
    connection.end();
  }
};
