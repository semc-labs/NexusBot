import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { clientId, guildId, token } from './config.js';
import { readdirSync } from "fs";

// const commands = [
// 	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
// 	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
// 	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
// 	new SlashCommandBuilder().setName('test').setDescription('Testing command adding!'),
// ]
// 	.map(command => command.toJSON());

const commands = [];
const commandFiles  = readdirSync('./src/handlers/commands');

for (const file of commandFiles) {
	const command = await import(`../handlers/commands/${file}`);

	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);