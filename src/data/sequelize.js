import Sequelize from 'sequelize';

// export const sequelize = new Sequelize('database', 'user', 'password', {
// 	host: 'localhost',
// 	dialect: 'sqlite',
// 	logging: false,
// 	// SQLite only
// 	storage: 'database.sqlite',
// 	//query: { raw:true } // https://github.com/sequelize/sequelize/issues/6408
// });

export const sequelize = new Sequelize("postgresql://postgres:"+process.env.DB_PASSWORD+"@"+process.env.DB_URL+":"+process.env.DB_PORT+"/"+process.env.DB_NAME);
