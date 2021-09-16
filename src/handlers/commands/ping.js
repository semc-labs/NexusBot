import Command from "./commands.js";

export default class extends Command {
  name = "ping";

  async execute(msg) {
    // console.log("Ping Test!");
    await msg.reply("Pong!");
  }
}
