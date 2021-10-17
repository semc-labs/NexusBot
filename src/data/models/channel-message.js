import { Client } from 'discord.js';
import Sequelize from 'sequelize';
import Deps from '../../utils/deps.js';
import { sequelize } from '../sequelize.js';
import { Channel } from "./channel.js";
import moment from 'moment';

export const ChannelMessage = sequelize.define('channel_messages', {
	channelId: {
		type: Sequelize.STRING,
		allowNull: false
	},
	date: {
		type: Sequelize.DATEONLY,
		defaultValue: Sequelize.NOW,
		allowNull: false,
	},
	usageCount: {
		type: Sequelize.INTEGER,
		defaultValue: 1,
		allowNull: false,
	},
},
{
	indexes: [
		{
			unique: true,
			fields: ['channelId', 'date']
		}
	]
});


export class ChannelMessages {
	/**
	 * FIND a channelMessages row for the specified date
	 * 
	 * @param {string} channelId The Discord Channel ID
	 * @param {string} date moment().format("YYYY-MM-DD")
	 * @returns sequelize ChannelMessage row
	 */
	static async findOne(channelId, date) {
		try {
			return await ChannelMessage.findOne({ 
				include: [{
					model: Channel,
				}],
				where: { channelId: channelId, date: date }
			});
		}catch(e){
			console.error('ChannelMessages findOne ', e);
		}

		return false;
	}

	/**
	 * INCREMENT / CREATE a channelMessages record
	 * 
	 * @param {Message} msg Discord Message object
	 * @param {string} date moment().format("YYYY-MM-DD")
	 */
	static async update(msg, date) {

		try {
			const channelMessages = await this.findOne(msg.channel.id, date);
			
			if (channelMessages) {
				channelMessages.increment('usageCount');
			}else{
				ChannelMessage.create({
					channelId: msg.channel.id
				});

			}
			return true;
		}catch(e){
			console.error('ChannelMessages update ', e);
			return false;
		}
	}

	/**
	 * GET all channel messages
	 * @param {Object} where 
	 * @returns {ChannelMessage[]}
	 */
	 static async findAll(where) {
		return await ChannelMessage.findAll({
			where: where,
			raw: true
		});
	}

	/**
	 * Grab many different channel messages to populate old data
	 */
	static setup(){
		const bot = Deps.get(Client);

		// Loop through cached channels
		bot.channels.cache.forEach(channel => {
			if(channel.id === process.env.ANNOUNCEMENTS_ID) return;
			if(channel.type === "category") return;
			if(! channel.messages) return;
			
			// Get all the messages for each channel
			channel.messages.fetch().then(messages => {
				
				let channel = []
				// build our channelMessage object based on channelId and date of message
				messages.forEach(async message => {
					const date = moment.unix(message.createdTimestamp/1000).format("YYYY-MM-DD");
					const updateChannel = channel.find(c => c.channelId === message.channel.id && c.date === date );
					if(updateChannel){
						updateChannel.usageCount++;
					}else{
						channel.push({channelId: message.channel.id, date:date, usageCount: 1});
					}
				});

				return channel
			}).then((channel)=>{
				//console.log(channel);
				ChannelMessage.bulkCreate(channel, {
					ignoreDuplicates: true
				})
			});
		});
	}

}