import moment from "moment";

import { ChannelMessages } from "../../data/models/channel-message.js";
import { Channels } from "../../data/models/channel.js";
import { Announcements } from "../../data/models/announcements.js";
import { Users } from "../../data/models/users.js";
import WordPress from "../../utils/wordpress.js";


export const name = 'messageCreate';
export async function execute(bot, msg) {
  if (!msg.guild || msg.author.bot) return;

  //const date = moment(new Date().toISOString()).format("YYYY-MM-DD");
  const date = moment().format("YYYY-MM-DD");

  try {
    console.log(`Message from ${msg.author.username} on channel ${msg.channel.name}`);

    // CREATE / FIND channel
    await Channels.findOrCreate(msg.channel.id);

    // INCREMENT our channel message count
    await ChannelMessages.update(msg, date);

    // Let's create this user 
    await Users.findOrCreate(msg.member.id);

    // POST this message to the wordpress site
    if(msg.channel.id === process.env.ANNOUNCEMENTS_ID){
      WordPress.postAnnouncement(msg);

      Announcements.create(msg);
    }

  }catch(e) {
    console.error(e);
  }
}