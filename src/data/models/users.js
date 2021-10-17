import Sequelize from 'sequelize';
import { sequelize } from '../sequelize.js';
import Deps from '../../utils/deps.js';
import { Client } from 'discord.js';

export const User = sequelize.define('na_members', {
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
	bot: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	info: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
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
	 * @param {int} userId 
	 * @returns {User}
	 */
	static async findOrCreate(userId) {
		// -------------------------------------
		// Check our DB before creating from the bot.cache

		const user = await this.get( userId );

		if(user){
			return user;
		}

		const bot = Deps.get(Client);
		const newUser = bot.users.cache.get(userId);

		if(newUser){
			return await User.create({ 
				userId: userId, 
				name: newUser.username, 
				info: JSON.stringify(newUser) 
			});
		}

		return null;

	}

	/**
	 * GET all users
	 * @param {Object} where 
	 * @returns {User[]}
	 */
	static async findAll(where) {
		return await User.findAll({
			where: where,
			raw: true
		});
	}

	static async setup(){
		const bot = Deps.get(Client);

		const guild = bot.guilds.cache.get(process.env.SERVER_ID);

		guild.members.fetch().then(members => {
			let dbMembers = []

			members.forEach(async member => {
				dbMembers.push({userId: member.id, name:member.displayName, bot: member.user.bot?1:0, info: JSON.stringify(member),  });
			});
			
			return dbMembers

		}).then((dbMembers)=>{
			User.bulkCreate(dbMembers, {
				ignoreDuplicates: true
			})
		});
	}
}