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

interface LambdaEvent {
  pathParameters: {
    id: string;
  };
  body: string;
}

interface LambdaContext {
  awsRequestId: string;
  callbackWaitsForEmptyEventLoop: boolean;
  functionName: string;
  functionVersion: string;
  memoryLimitInMB: string;
  logGroupName: string;
  logStreamName: string;
  invokedFunctionArn: string;
}

export const handler = async (event: LambdaEvent, context: LambdaContext) => {
  const connection = await mysql.createConnection({
    host: RDS_HOST,
    port: RDS_PORT,
    user: RDS_USER,
    password: RDS_PASSWORD,
    database: RDS_DATABASE,
  });

  const reservationId = event.pathParameters.id;
  const reservationData: ReservationData = JSON.parse(event.body);

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
