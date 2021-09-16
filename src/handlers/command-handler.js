import { readdirSync } from "fs";

export class CommandHandler {
  commands = new Map();

  async init() {
    const filenames = readdirSync("./src/handlers/commands");

    for (const name of filenames) {
      const { default: Command } = await import(`./commands/${name}`);
      const command = new Command();

      if (!command.name) continue;

      this.commands.set(command.name, command);
    }

    console.log(`${filenames.length - 1} commands were loaded`);
  }

  async handle(prefix, msg) {
    try {
      const words = msg.content.slice(prefix.length).split(" ");
      await this.commands.get(words[0])?.execute(msg, ...words.slice(1));
    } catch (e) {
      //console.log("Error: ", e);
      await msg.reply(`⚠ Error: ${e.message}`);
    }
  }
}
