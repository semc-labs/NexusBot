import { SlashCommandBuilder } from '@discordjs/builders';
import { EMAIL_REGEX } from "../../utils/regex.js";
import axios from "axios";

export const data = new SlashCommandBuilder()
  .setName('subscribe')
  .setDescription('Subscribe to Nexus Aurora emails!')
  .addStringOption(option => option.setName('email').setRequired(true).setDescription('Enter your email'));
export async function execute(interaction) {

  const email = interaction.options.getString('email');

  if( !email ) {
    return await interaction.reply({ content: `Please provide an email address.`, ephemeral: true });
  }

  if(! EMAIL_REGEX.test(email.toLowerCase())) {
    return await interaction.reply({ content: `Sorry, but the email "${email}" is invalid.`, ephemeral: true });
  }

  
  try{
    const subscriber = await axios.post(`https://${process.env.WP_DOMAIN}/wp-json/newsletter/v1/subscribe`,
      {
        email: email,
        lists: [1],
        api_key: process.env.NEWSLETTER_KEY // NOTE: Newsletter supports v2 Rest API however it clashes with our other JWT login for creating posts. This is a workaround to avoid going through basic auth
      },
    )

    //console.log(subscriber);

    if(subscriber){
      console.log(`${email} Subscribed!`);
      return await interaction.reply({ content: `Thank you! "${email}" has been subscribed!`, ephemeral: true });
    }
  }catch(e){
    // Error
    return await interaction.reply({ content: `! ${e}`, ephemeral: true });
  } 

  await interaction.reply({ content: `Unable to subscribe`, ephemeral: true });
}