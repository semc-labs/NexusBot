import { ChannelMessage, ChannelMessages } from "../../data/models/channel-message.js";
import { Channel, Channels } from "../../data/models/channel.js";
import { Announcement, Announcements } from "../../data/models/announcements.js";
import { User, Users } from "../../data/models/users.js";
import WordPress from "../../utils/wordpress.js";



export const name = 'ready';
export const once = true;
export async function execute(bot, client) {
  //console.log(`Ready! Logged in as ${client.user.tag}`);
  console.log(`${bot.user.username} is online`);
  bot.user.setActivity('Everything', { type: 'WATCHING'});

  // force will reset and rebuild the database
  const force = true;

  await Channel.sync({ force: force })
  await Channels.setup();
  await ChannelMessage.sync({ force: force });
  await ChannelMessages.setup();
  await Announcement.sync({ force: force });
  await Announcements.setup();
  await User.sync({ force: force });
  await Users.setup();

  ChannelMessage.belongsTo(Channel, { foreignKey: 'channelId' });
  Announcement.belongsTo(User, { foreignKey: 'userId' });

  Channel.hasMany(ChannelMessage, { foreignKey: 'channelId' });
  User.hasMany(Announcement, { foreignKey: 'userId' });

  WordPress.authenticate();
}