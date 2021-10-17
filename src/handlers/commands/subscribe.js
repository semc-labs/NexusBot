import { SlashCommandBuilder } from '@discordjs/builders';
import { EMAIL_REGEX } from "../../utils/regex.js";

export const data = new SlashCommandBuilder()
  .setName('subscribe')
  .setDescription('Subscribe to Nexus Aurora emails!')
  .addStringOption(option => option.setName('email').setDescription('Enter your email'));
export async function execute(interaction) {

  const email = interaction.options.getString('email');

  if( !email ) {
    return await interaction.reply({ content: `Please provide an email address. ex: /subscribe email@gmail.com`, ephemeral: true });
  }

  if(! EMAIL_REGEX.test(email.toLowerCase())) {
    return await interaction.reply({ content: `Sorry, but the email "${email}" is invalid.`, ephemeral: true });
  }

  await interaction.reply({ content: `Thank you! Your email ${email} has been subscribed!`, ephemeral: true });
}