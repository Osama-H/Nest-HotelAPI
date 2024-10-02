// import * as dotenv from 'dotenv';

// import { IDatabaseConfig } from './interfaces/dbConfig.interface';

// dotenv.config();

// export const databaseConfig: IDatabaseConfig = {
//   development: {
//     username: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME_DEVELOPMENT,
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: 'postgres',
//   },
//   test: {
//     username: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME_TEST,
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: process.env.DB_DIALECT,
//   },
//   production: {
//     username: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME_PRODUCTION,
//     host: process.env.DB_HOST,
//     dialect: process.env.DB_DIALECT,
//   },
// };

import * as dotenv from 'dotenv';
import { Dialect } from 'sequelize';

dotenv.config();

export const databaseConfig = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_DEVELOPMENT,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: 'postgres' as Dialect,
    autoLoadModels: true,
    synchronize: true,
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_TEST,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: 'postgres' as Dialect,
    autoLoadModels: true,
    synchronize: true,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME_PRODUCTION,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    dialect: 'postgres' as Dialect,
    autoLoadModels: true,
    synchronize: false, // Disable it when You on Production mode ..
  },
};
