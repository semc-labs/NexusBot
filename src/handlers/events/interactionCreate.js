import Event from "./event.js";
// import { CommandHandler } from "../command-handler.js";
// import Deps from "../../utils/deps.js";
import { bot } from "../../bot.js";

// import moment from "moment";

export default class extends Event {
  on = "interactionCreate";

  constructor() {
    super();
  }

  async invoke(interaction) {
    if (!interaction.isCommand()) return;

	const command = bot.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
  }
}
