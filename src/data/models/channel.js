import Sequelize from 'sequelize';
import { sequelize } from '../sequelize.js';
import Deps from '../../utils/deps.js';
import { Client } from 'discord.js';

export const Channel = sequelize.define('channels', {
	channelId: {
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

export class Channels {
	/**
	 * GET a single channel
	 * @param {int} channelID 
	 * @returns {Channel}
	 */
	static async get(channelId) {
		return await Channel.findOne({ 
			where: { channelId: channelId }
		});
	}

	/**
	 * CREATE / GET a single channel
	 * @param {Message} msg 
	 * @returns {Channel[]}
	 */
	static async findOrCreate(channelId) {
		const channel = await this.get(channelId);

		if(channel){
			return channel;
		}

		const bot = Deps.get(Client);
		const newChannel = bot.channels.cache.get(channelId);

		return await Channel.create({ 
			channelId: channelId, 
			name: newChannel.name, 
			info: JSON.stringify(newChannel) 
		});

		// return await Channel.findOrCreate({
		// 	where: { channelId: msg.channel.id },
		// 	defaults: {
		// 		channelId: msg.channel.id,
		// 		name: msg.channel.name
		// 	}
		// });
	}

	/**
	 * GET all channels
	 * @param {Object} where 
	 * @returns {Channel[]}
	 */
	static async findAll(where) {
		return await Channel.findAll({
			where: where,
			raw: true
		});
	}

	static setup(){
		const bot = Deps.get(Client);

		bot.channels.cache.forEach(channel => {
			this.findOrCreate(channel.id);
		})
	}
}