import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as mysql from 'mysql2/promise';
import { ReservationData } from '../types/lambdaTypes';
import * as dotenv from 'dotenv';

dotenv.config();

const query = `
  INSERT INTO reservations (
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
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const connection = await mysql.createConnection({
    host: process.env.RDS_HOST,
    port: Number(process.env.RDS_PORT),
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DATABASE,
  });

  try {
    const body = event.body ? JSON.parse(JSON.stringify(event.body)) : null;

    if (!body) {
      return {
        statusCode: 400,
        body: 'Invalid reservation data',
      };
    }

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
    } = body as ReservationData;

    const [result] = await connection.execute<mysql.OkPacket>(query, [
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
