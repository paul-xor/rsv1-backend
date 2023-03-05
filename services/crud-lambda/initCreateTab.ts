import { APIGatewayProxyHandler } from 'aws-lambda';
import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

const createTableQuery = `
    CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    arrival_date TIMESTAMP,
    departure_date TIMESTAMP,
    room_size VARCHAR(20) NOT NULL,
    room_quantity INTEGER NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    street_name VARCHAR(100) NOT NULL,
    street_number VARCHAR(20) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    state VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    extras VARCHAR(200),
    payment VARCHAR(10) NOT NULL,
    note TEXT,
    tags VARCHAR(200),
    reminder BOOLEAN NOT NULL,
    newsletter BOOLEAN NOT NULL,
    confirm BOOLEAN NOT NULL
  );
`;

export const handler: APIGatewayProxyHandler = async (event: any, context: any) => {
  const connection = await mysql.createConnection({
    host: process.env.RDS_HOST,
    port: Number(process.env.RDS_PORT),
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DATABASE,
  });

  try {
    const [results] = await connection.execute(createTableQuery);
    console.log('Table created successfully');
    return {
      statusCode: 200,
      body: `Table created successfully: ${results}`
    };
  } catch (error) {
    console.error(`Error creating table: ${error}`);
    return {
      statusCode: 500,
      body: 'Error creating table'
    }
  } finally {
    connection.end();
  }
};