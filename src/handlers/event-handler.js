import { readdirSync } from "fs";
import { bot } from "../bot.js";

export class EventHandler {
  async init() {
    const filenames = readdirSync("./src/handlers/events");

    for (const name of filenames) {
      const { default: Event } = await import(`./events/${name}`);
      const event = new Event();

      if (!event.on) continue;

      bot.on(event.on, event.invoke.bind(event));
    }

    console.log(`${filenames.length - 1} events were loaded`);
  }
}
