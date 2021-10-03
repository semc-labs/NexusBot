// import Event from "./event.js";
// //import { CommandHandler } from "../command-handler.js";
// //import Deps from "../../utils/deps.js";
// import WordPress from "../../utils/wordpress.js";

// import { ChannelMessages } from "../../data/models/channel-message.js";
// import { Channels } from "../../data/models/channel.js";

// import moment from "moment";
// import { Announcements } from "../../data/models/announcements.js";
// import { Users } from "../../data/models/users.js";



// export default class extends Event {
//   on = "message";

//   async invoke(msg) {
//     console.log(`Message:`, msg);

//     // Don't reply to bots
//     if (!msg.guild || msg.author.bot) return;

//     //const date = moment(new Date().toISOString()).format("YYYY-MM-DD");
//     const date = moment().format("YYYY-MM-DD");

//     try {
//       console.log(`Message from ${msg.author.username} on channel ${msg.channel.name}`);

//       // CREATE / FIND channel
//       await Channels.findOrCreate(msg.channel.id);

//       // INCREMENT our channel message count
//       await ChannelMessages.update(msg, date);

//       // Let's create this user 
//       await Users.findOrCreate(msg.member.id);

//       // POST this message to the wordpress site
//       if(msg.channel.id === process.env.ANNOUNCEMENTS_ID){
//         WordPress.postAnnouncement(msg);

//         Announcements.create(msg);
//       }

//     }catch(e) {
//       console.error(e);
//     }
//   }
// }


export const name = 'messageCreate';
export function execute(msg) {
  console.log(`Message from ${msg.author.username} on channel ${msg.channel.name}`);
}