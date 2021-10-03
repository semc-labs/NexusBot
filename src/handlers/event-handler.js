import { readdirSync } from "fs";
import { bot } from "../bot.js";

export class EventHandler {
  async init() {
    const eventFiles = readdirSync("./src/handlers/events");

    for (const file of eventFiles) {
      const { default: Event } = await import(`./events/${file}`);
      const event = new Event();

      if (!event.on) continue;

      bot.on(event.on, event.invoke.bind(event));
    }

    console.log(`${eventFiles.length - 1} events were loaded`);


    bot.commands = new Map();
    const commandFiles = readdirSync('./src/handlers/commands');

    for (const file of commandFiles) {
      const command = await import(`./commands/${file}`);
      // Set a new item in the Collection
      // With the key as the command name and the value as the exported module
      bot.commands.set(command.data.name, command);
    }

    console.log(`${commandFiles.length} commands were loaded`);
  }
}
