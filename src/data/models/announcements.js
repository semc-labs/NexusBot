import { User } from "./users.js";
import Sequelize from 'sequelize';
import { sequelize } from '../sequelize.js';
import Deps from '../../utils/deps.js';
import { Client } from 'discord.js';

export const Announcement = sequelize.define('announcements', {
	announcementId: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	channelId: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	userId: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	content: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
	pinned: {
		type: Sequelize.TINYINT,
		allowNull: false
	},
	mentions: {
		type: Sequelize.TEXT,
		allowNull: false
	},
});

export class Announcements {
	/**
	 * GET a single announcement
	 * @param {int} announcementId 
	 * @returns {Announcement}
	 */
	static async get(announcementId) {
		return await Announcement.findOne({ where: { announcementId: announcementId } });
	}

	/**
	 * CREATE a single announcement
	 * @param {Message} msg 
	 * @returns {Announcement[]}
	 */
	static async create(msg) {
		return await Announcement.create({ 
			announcementId: msg.id,
			channelId: msg.channel.id,
			userId: msg.author.id,
			//author: JSON.stringify(bot.users.cache.get(m.member.id)),
			content: msg.content,
			pinned: msg.pinned,
			mentions: JSON.stringify(msg.mentions),
			createdAt: msg.createdTimestamp
		},{
			ignoreDuplicates: true
		});
	}

	/**
	 * GET all announcementss
	 * @param {Object} where 
	 * @returns {Announcement[]}
	 */
	static async findAll(where) {
		return await Announcement.findAll({
			include: [{
				model: User,
			}],
			where: where,
		});
	}


	static setup(){
		const bot = Deps.get(Client);
		const thisAnnouncement = this;
		const channel = bot.channels.cache.get(process.env.ANNOUNCEMENTS_ID);

		channel.messages.fetch().then(async messages => {
			messages.forEach(m => {
				//const user = bot.users.cache.get(m.user.id);
				// const reactionEmoji = bot.emojis.cache.get('123456789012345678');
				//announcements.push({content: m.content, pinned: m.pinned, author: m.author, reactions: m.reactions.cache, mentions: m.mentions, created: m.createdTimestamp});
				
				thisAnnouncement.create(m);
			});

			
		});
	}

}