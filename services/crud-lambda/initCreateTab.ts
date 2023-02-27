import { APIGatewayProxyHandler } from 'aws-lambda';
import * as mysql from 'mysql2/promise';

const RDS_HOST = 'database-2.cmuvxrqhgxjx.us-east-1.rds.amazonaws.com';
const RDS_PORT = 3306;
const RDS_USER = 'admin';
const RDS_PASSWORD = 'NonaNona';
const RDS_DATABASE = 'reservationsDb';

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
    host: RDS_HOST,
    port: RDS_PORT,
    user: RDS_USER,
    password: RDS_PASSWORD,
    database: RDS_DATABASE,
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