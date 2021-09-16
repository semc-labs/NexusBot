import { Client, Intents } from "discord.js";
import { config } from "dotenv";
import { EventHandler } from "./handlers/event-handler.js";
import Deps from "./utils/deps.js";
import { routes } from "./routes/index.js";


// Environment Variables
config({ path: ".env" });

// Initialize Event Handler and set it up as a dependency
Deps.get(EventHandler).init();

// https://discord.com/developers/docs/topics/gateway#gateway-intents
export const bot = Deps.add(
  Client,
  new Client({ 
	  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
	  partials: [] 
	})
);

// Connect bot to Discord
bot.login(process.env.BOT_TOKEN);
  
// Start server
const server = routes.listen(8081, function () {
	//const host = server.address().address
	const port = server.address().port
	console.log(`Nexus Aurora API listening at http://localhost:${port}`)
})