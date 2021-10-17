import Sequelize from 'sequelize';
import { config } from "dotenv";

config({ path: ".env" });

// SQLITE
// export const sequelize = new Sequelize('database', 'user', 'password', {
// 	host: 'localhost',
// 	dialect: 'sqlite',
// 	logging: false,
// 	storage: 'database.sqlite',
// 	//query: { raw:true } // https://github.com/sequelize/sequelize/issues/6408
// });

// TODO: Nexus Aurora WordPress / MySQL DB
export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
	host: process.env.DB_URL,
	//post: process.env.DB_PORT,
	dialect: 'mysql',
	logging: false,
});

  // const subscribers = await sequelize.query("SELECT * FROM `na_subscribers`", { type: QueryTypes.SELECT });

  // console.log(subscribers);

// POSTGRES DEV
//export const sequelize = new Sequelize('postgres://postgres:password@localhost:5432/nexusbot')
// export const sequelize = new Sequelize('nexusbot', 'postgres', 'password', {
// 	host: 'localhost',
// 	post: 5432,
// 	dialect: 'postgres',
// 	logging: false,
// });


// POSTGRES LIVE
// export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
// 	host: process.env.DB_URL,
// 	post: process.env.DB_PORT,
// 	dialect: 'postgres',
// 	logging: false,
// });
