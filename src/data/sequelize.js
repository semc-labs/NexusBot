import Sequelize from 'sequelize';
import { config } from "dotenv";

config({ path: ".env" });

// SQLITE
// export const sequelize = new Sequelize('database', 'user', 'password', {
// 	host: 'localhost',
// 	dialect: 'sqlite',
// 	logging: false,
// 	// SQLite only
// 	storage: 'database.sqlite',
// 	//query: { raw:true } // https://github.com/sequelize/sequelize/issues/6408
// });

// POSTGRES DEV
//export const sequelize = new Sequelize('postgres://postgres:password@localhost:5432/nexusbot')
// export const sequelize = new Sequelize('nexusbot', 'postgres', 'password', {
// 	host: 'localhost',
// 	post: 5432,
// 	dialect: 'postgres',
// 	logging: false,
// });


//console.log(`postgresql://betamaxx:${process.env.DB_PASSWORD}@${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

// POSTGRES LIVE
//export const sequelize = new Sequelize(`postgresql://betamaxx:${process.env.DB_PASSWORD}@${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
export const sequelize = new Sequelize(process.env.DB_NAME, 'postgres', process.env.DB_PASSWORD, {
	host: process.env.DB_URL,
	post: process.env.DB_PORT,
	dialect: 'postgres',
	logging: false,
});
