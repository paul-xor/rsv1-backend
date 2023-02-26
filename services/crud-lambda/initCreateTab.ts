import { APIGatewayProxyHandler } from 'aws-lambda';
import * as mysql from 'mysql2/promise';

const RDS_HOST = 'reservestack-dbinstance310a317f-gjixavyg2vyd.cllg7wiabaco.ca-central-1.rds.amazonaws.com';
const RDS_PORT = 3306;
const RDS_USER = 'admin';
const RDS_PASSWORD = 'B0su6-OQBIjX=W-xtJc80fh6iyoB_W';
const RDS_DATABASE = 'reservationsDb';

const createTableQuery = `
    CREATE TABLE Reservations (
        id INT NOT NULL AUTO_INCREMENT,
        arrivalDate DATETIME,
        departureDate DATETIME,
        roomSize VARCHAR(255),
        roomQuantity INT,
        firstName VARCHAR(255),
        lastName VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(255),
        PRIMARY KEY (id)
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



// import * as AWS from 'aws-sdk';
// const rdsDataService = new AWS.RDSDataService();



// export const handler: APIGatewayProxyHandler = async (event, context) => {
//   const createTableQuery = `
//     CREATE TABLE Reservations (
//         id INT NOT NULL AUTO_INCREMENT,
//         firstName VARCHAR(255),
//         lastName VARCHAR(255),
//         email VARCHAR(255),
//         phone VARCHAR(255),
//         PRIMARY KEY (id)
//     );
//   `;

//   const params = {
//     resourceArn: 'arn:aws:rds:ca-central-1:201682123230:db:reservestack-dbinstance310a317f-gjixavyg2vyd',
//     secretArn: 'arn:aws:secretsmanager:ca-central-1:201682123230:secret:ReserveStackdbinstanceSecre-ODm947ED1NFz-XPwT45',
//     sql: createTableQuery,
//     database: 'reservationsDb'
//   };

//   try {
//     const result = await rdsDataService.executeStatement(params).promise();
//     console.log(result);
//     return {
//       statusCode: 200,
//       body: 'Table created successfully'
//     };
//   } catch (err) {
//     console.error(err);
//     return {
//       statusCode: 500,
//       body: 'Error creating table'
//     };
//   }
// };