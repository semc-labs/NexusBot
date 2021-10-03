import Event from "./event.js";
import { bot } from "../../bot.js";
import { CommandHandler } from "../command-handler.js";
import Deps from "../../utils/deps.js";
// import { MessageEmbed } from "discord.js";

import { ChannelMessage, ChannelMessages } from "../../data/models/channel-message.js";
import { Channel, Channels } from "../../data/models/channel.js";
import { Announcement, Announcements } from "../../data/models/announcements.js";
import { User, Users } from "../../data/models/users.js";
import WordPress from "../../utils/wordpress.js";


// const embed = new MessageEmbed()
// 	.setTitle('Some Title')
// 	.setColor('#0099ff');

export default class extends Event {
  on = "ready";

  constructor() {
    super();
    this.commandHandler = Deps.get(CommandHandler);
  }

  async invoke() {
    console.log(`${bot.user.username} is online`);
    bot.user.setActivity('Everything', { type: 'WATCHING'});

    // force will reset and rebuild the sqlite databases
    const force = true;
  
    Channel.sync({ force: force }).then(() => {
      Channels.setup().then(() => {
        ChannelMessage.sync({ force: force }).then(() => ChannelMessages.setup());
        Announcement.sync({ force: force }).then(() => Announcements.setup());

        ChannelMessage.belongsTo(Channel, { foreignKey: 'channelId' });
        Announcement.belongsTo(User, { foreignKey: 'userId' });

        Channel.hasMany(ChannelMessage, { foreignKey: 'channelId' });
      });
    });

    User.sync({ force: force }).then(() => Users.setup());
    User.hasMany(Announcement, { foreignKey: 'userId' });

    WordPress.authenticate();

    await this.commandHandler.init();
  }
}