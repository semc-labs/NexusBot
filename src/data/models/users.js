import Sequelize from 'sequelize';
import { sequelize } from '../sequelize.js';
import Deps from '../../utils/deps.js';
import { Client } from 'discord.js';

export const User = sequelize.define('users', {
	userId: {
		type: Sequelize.STRING,
		primaryKey: true,
		unique: true,
		allowNull: false,
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	info: {
		type: Sequelize.TEXT,
		allowNull: false,
	}
});

export class Users {
	/**
	 * GET a single user
	 * @param {int} userId 
	 * @returns {User}
	 */
	static async get(userId) {
		return await User.findOne({
			where: { userId: userId }
		});
	}

	/**
	 * CREATE / GET a single user
	 * @param {Message} msg 
	 * @returns {User[]}
	 */
	static async findOrCreate(userId) {
		// -------------------------------------
		// Check out SQLITE before creating from the bot.cache

		const user = await this.get( userId );

		if(user){
			return user;
		}

		const bot = Deps.get(Client);
		const newUser = bot.users.cache.get(userId);

		return await User.create({ 
			userId: userId, 
			name: newUser.username, 
			info: JSON.stringify(newUser) 
		});
		

		// -------------------------------------
		// Find user in out bot.cache. Find or Create them in our SQLITE

		// const bot = Deps.get(Client);
		// const newUser = bot.users.cache.get(userId);

		// return await User.findOrCreate({
		// 	where: { userId: userId },
		// 	defaults: { 
		// 		userId: userId, 
		// 		name: newUser.username, 
		// 		info: JSON.stringify(newUser) 
		// 	}
		// });
	}

	/**
	 * GET all users
	 * @param {Object} where 
	 * @returns {Channel[]}
	 */
	static async findAll(where) {
		return await User.findAll({
			where: where,
			raw: true
		});
	}

	static setup(){
		const bot = Deps.get(Client);

		bot.users.cache.forEach(user => {
			this.findOrCreate(user.id);
		})

		// const guild = bot.guilds.cache.get(process.env.SERVER_ID);

		// let members = [];
	
		
		// guild.members.cache.forEach(m => {
		// 	const user = bot.users.cache.get(m.user.id);
		// 	let roles = [];
		// 	m.roles.cache.forEach((role) => {
		// 		roles.push(guild.roles.cache.get(role.id));
		// 	}) 
			
		// 	members.push({...user, avatarURL: m.user.displayAvatarURL(), presence: m.presence, role: roles});
		// });
	}
}