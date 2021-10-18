import Sequelize from 'sequelize';
import { sequelize } from '../sequelize.js';
// import Deps from '../../utils/deps.js';
// import { Client } from 'discord.js';

export const Subscriber = sequelize.define('na_subscribers', {
	subscriber_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
	},
	active: {
		type: Sequelize.INTEGER,
		allowNull: false,
		defaultValue: 1,
	},
	from_discord: {
		type: Sequelize.INTEGER,
		allowNull: false,
		defaultValue: 0,
	}
},
{
	indexes: [
		{
			unique: true,
			name: 'email',
			fields: ['email']
		}
	]
});

// TODO: Should we setup get_by_id / get_by_email functions? 
// TODO Should we try to get dynamically depending on string or int?
export class Subscribers {
	/**
	 * GET a single subscriber
	 * @param {email} email 
	 * @returns {Subscriber}
	 */
	static async get(email) {
		return await Subscriber.findOne({
			where: { email: email }
		});
	}

	/**
	 * CREATE / GET a single subscriber
	 * @param {string} email 
	 * @returns {Subscriber}
	 */
	static async findOrCreate(email) {
		// -------------------------------------
		// Check our DB before creating from the bot.cache

		const subscriber = await this.get( email );

		if(subscriber){
			return subscriber;
		}

		return await Subscriber.create({ 
			email: email, 
			active: 1, 
			from_discord: 1
		});

	}

	/**
	 * GET all subscribers
	 * @param {Object} where 
	 * @returns {Subscriber[]}
	 */
	static async findAll(where) {
		return await Subscriber.findAll({
			where: where,
			raw: true
		});
	}
}