import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as mysql from 'mysql2/promise';
import { ReservationData }  from '../types/lambdaTypes';
import * as dotenv from 'dotenv';

dotenv.config();

const updateReservationQuery = `
  UPDATE reservations SET
    arrival_date = ?,
    departure_date = ?,
    room_size = ?,
    room_quantity = ?,
    first_name = ?,
    last_name = ?,
    email = ?,
    phone = ?,
    street_name = ?,
    street_number = ?,
    zip_code = ?,
    state = ?,
    city = ?,
    extras = ?,
    payment = ?,
    note = ?,
    tags = ?,
    reminder = ?,
    newsletter = ?,
    confirm = ?
  WHERE id = ?;
`;

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const connection = await mysql.createConnection({
    host: process.env.RDS_HOST,
    port: Number(process.env.RDS_PORT),
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DATABASE,
  });

  const reservationId = event.queryStringParameters?.id;
   const reservationData: ReservationData = event.body ? JSON.parse(JSON.stringify(event.body)) : null;

  if (!reservationData) {
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
  } = reservationData;

  try {
    const [result] = await connection.execute(updateReservationQuery, [
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
      reservationId,
    ]);
    console.log('Reservation updated successfully');
    return {
      statusCode: 200,
      body: `Reservation updated successfully: ${JSON.stringify(result)}`,
    };
  } catch (error) {
    console.error(`Error updating reservation: ${error}`);
    return {
      statusCode: 500,
      body: 'Error updating reservation',
    };
  } finally {
    connection.end();
  }
};
