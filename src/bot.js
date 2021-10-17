import { Client, Intents, Collection } from "discord.js";
import { Sequelize } from 'sequelize';
import { config } from "dotenv";
//import { EventHandler } from "./handlers/event-handler.js";
import Deps from "./utils/deps.js";
import { routes } from "./routes/index.js";
import { readdirSync } from "fs";


// Environment Variables
config({ path: ".env" });


// https://discord.com/developers/docs/topics/gateway#gateway-intents
export const bot = Deps.add(
  Client,
  new Client({ 
	  intents: [
			Intents.FLAGS.GUILDS, 
			Intents.FLAGS.GUILD_PRESENCES, 
			Intents.FLAGS.GUILD_MEMBERS, 
			Intents.FLAGS.GUILD_MESSAGES,
			Intents.FLAGS.DIRECT_MESSAGES
		],
		partials: ["CHANNEL"]
	})
);

// Initialize Event Handler and set it up as a dependency
//Deps.get(EventHandler).init();

bot.commands = new Collection();
const commandFiles = readdirSync('./src/handlers/commands');

for (const file of commandFiles) {
	const command = await import(`./handlers/commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	bot.commands.set(command.data.name, command);
}

console.log(`${commandFiles.length} commands were loaded`);

const eventFiles = readdirSync("./src/handlers/events");

for (const file of eventFiles) {
	const event = await import(`./handlers/events/${file}`);
	if (event.once) {
		bot.once(event.name, (...args) => event.execute(bot, ...args));
	} else {
		bot.on(event.name, (...args) => event.execute(bot, ...args));
	}
}

console.log(`${eventFiles.length} events were loaded`);


// Connect bot to Discord
bot.login(process.env.BOT_TOKEN);

// Start server
const server = routes.listen(process.env.PORT, function () {
	//const host = server.address().address
	const port = server.address().port
	console.log(`Nexus Aurora API listening at http://localhost:${port}`)
})