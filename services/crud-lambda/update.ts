import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as mysql from 'mysql2/promise';

const RDS_HOST = 'database-2.cmuvxrqhgxjx.us-east-1.rds.amazonaws.com';
const RDS_PORT = 3306;
const RDS_USER = 'admin';
const RDS_PASSWORD = 'NonaNona';
const RDS_DATABASE = 'reservationsDb';

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

interface ReservationData {
  arrival_date: string,
  departure_date: string,
  room_size: string,
  room_quantity: string,
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
  reminder: string;
  newsletter: string;
  confirm: string;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const connection = await mysql.createConnection({
    host: RDS_HOST,
    port: RDS_PORT,
    user: RDS_USER,
    password: RDS_PASSWORD,
    database: RDS_DATABASE,
  });

  const reservationId = event.queryStringParameters?.id;
   const reservationData: ReservationData = event.body ? JSON.parse(JSON.stringify(event.body)) : null;

  console.log('#reservationId: ', reservationId)
  console.log('#reservationData: ', reservationData)

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
