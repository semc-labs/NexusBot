import express from 'express';
import { ChannelMessages } from "../data/models/channel-message.js";
import { Channels } from "../data/models/channel.js";
import { Users } from '../data/models/users.js';
import { Announcements } from "../data/models/announcements.js";
import Deps from '../utils/deps.js';
import { Client } from 'discord.js';
import moment from 'moment';
import WordPress from '../utils/wordpress.js';



export const routes = express();

routes.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	// res.header("Access-Control-Allow-Origin", "localhost:8080"); // update to match the domain you will make the request from
	// res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// Online notice
routes.get('/', (req, res) => {
	res.end( 'Nexus Aurora Discord Bot is online' );
});

// GET single channel by parameter 'channelId
routes.get('/channels/:id', (req, res) => {
	if(req.params.id){
		Channels.findOrCreate(req.params.id).then(channel => {
			res.end( JSON.stringify(channel) );
		});
	}else{
		res.end( JSON.stringify({}) );
	}

	// if(req.params.id){
	// 	const bot = Deps.get(Client);

	// 	// Get our stats channels
	// 	const channel = bot.channels.cache.get(req.params.id);

	// 	res.end( JSON.stringify(channel) );
	// }else{
	// 	res.end( JSON.stringify([]) );
	// }
});

// GET all channels
routes.get('/channels', (req, res) => {
	// Channels.findAll().then(channelList => {
	// 	res.end( JSON.stringify(channelList) );
	// });

	const bot = Deps.get(Client);

	res.end( JSON.stringify(bot.channels.cache) );
});


// GET all channel messages
routes.get('/messages', (req, res) => {
	const bot = Deps.get(Client);

	let where = {};

	if(req.query.channelId){
		where.channelId = req.query.channelId;
	}

	// const announcementChannel = bot.channels.cache.get(process.env.ANNOUNCEMENTS_ID);

	ChannelMessages.findAll(where).then(channelMessages => {
		let messages = [];

		channelMessages.forEach(m => {
			if(m.channelId == process.env.ANNOUNCEMENTS_ID) return true;
			if(! m.usageCount) return true;

			const channel = bot.channels.cache.get(m.channelId)
			// channel.name = channel.name.replace('[\u1000-\uFFFF]+', ''); // need to remove emojis to order them
			var message = messages.find(m => m.name === channel.name );
			var dateISO = new Date(m.date).toISOString();
			var unixTimestamp = parseInt(moment(dateISO).format('x'));
			
			if(message){
				message.data.push([unixTimestamp, m.usageCount])
			}else{
				var message = {
					name: channel.name,
					data: [[unixTimestamp,m.usageCount]]
				}
				messages.push(message)
			}
			
		});

		// messages.sort((a, b) => a.name.localeCompare(b.name));
		res.end( JSON.stringify(messages));
	});
});


// GET all announcements
routes.get('/announcements', (req, res) => {

	// ---------------------------------------------------
	// Get announcements from discord
	// const bot = Deps.get(Client);

	// const channel = bot.channels.cache.get(process.env.ANNOUNCEMENTS_ID);
	// let announcements = [];
	// channel.messages.fetch().then(async messages => {
	// 	messages.forEach(m => {
	// 		//const user = bot.users.cache.get(m.user.id);
	// 		// const reactionEmoji = bot.emojis.cache.get('123456789012345678');
	// 		announcements.push({content: m.content, pinned: m.pinned, author: m.author, reactions: m.reactions.cache, mentions: m.mentions, created: m.createdTimestamp});
	// 	});
	
	// 	res.end( JSON.stringify(announcements) );
	// });

	// ---------------------------------------------------
	// Get announcements from the database
	let where = {};

	if(req.query.channelId){
		where.channelId = req.query.channelId;
	}

	if(req.query.userId){
		where.userId = req.query.userId;
	}

	Announcements.findAll(where).then(announcements => {
		announcements.forEach(a => {
			a.mentions = JSON.parse(a.mentions);
			a.user.info = JSON.parse(a.user.info);
		})
		res.end( JSON.stringify(announcements) );
	});
});

// GET a list of all our members
routes.get('/members', async (req, res) => {

	// -----------------------------------------------------
	// GET all users from discord [ INCLUDES PRESENCE ]

	const bot = Deps.get(Client);

	// Get our server
	const guild = bot.guilds.cache.get(process.env.SERVER_ID);

	let members = [];

	guild.members.cache.forEach(m => {
		const user = bot.users.cache.get(m.user.id);
		let roles = [];
		m.roles.cache.forEach((role) => {
			roles.push(guild.roles.cache.get(role.id));
		}) 
		
		members.push({...user, avatarURL: m.user.displayAvatarURL(), presence: m.presence, roles: roles});
	});

	res.end( JSON.stringify(members) );

	// -----------------------------------------------------
	// GET all users from sqlite [ NO PRESENCE ]

	// const users = await Users.findAll();
	// users.forEach(m => {
	// 	m.info = JSON.parse(m.info);
	// });

	// res.end( JSON.stringify(users) );

	// -----------------------------------------------------
	// GET user counts

	// var userCount = guild.memberCount;
	// console.log(guild.members.cache)
	// var onlineCount = guild.members.cache.filter(m => m.presence.status === 'online').size

	// // console.log('%c Guild Info', 'color: green; font-weight: bold;')
	// console.log("userCount: ", userCount)
	// console.log("onlineCount: ", onlineCount)
	// res.end( JSON.stringify(guild.members.cache) );
});


// GET single member by parameter :id
routes.get('/members/:id', (req, res) => {
	if(req.params.id){
		// ------------------------------------------------------
		// Get users from Discord
		const bot = Deps.get(Client);

		const guild = bot.guilds.cache.get(process.env.SERVER_ID);
		const member = guild.members.cache.get(req.params.id);

		let roles = [];
		member.roles.cache.forEach((role) => {
			roles.push(guild.roles.cache.get(role.id));
		}) 

		res.end( JSON.stringify({...member.user, avatarURL: member.user.displayAvatarURL(), presence: member.presence, roles: roles}) );
		
		// ------------------------------------------------------
		// Get users from DB

		// Users.findOrCreate(req.params.id).then(user => {
		// 	user.info = JSON.parse(user.info);

		// 	res.end( JSON.stringify(user) );
		// });
	}else{
		res.end( JSON.stringify({}) );
	}
});


// REFRESH our SQLITE cache.
routes.get('/refresh', (req, res) => {

	try {
		Channels.setup();
		ChannelMessages.setup();
		Users.setup();
		Announcements.setup();

		WordPress.authenticate();

		res.end( JSON.stringify({success: true}) );
	}catch(e) {
		console.log("Refresh: ", e)
	}

});