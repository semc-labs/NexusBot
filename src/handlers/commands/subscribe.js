import { SlashCommandBuilder } from '@discordjs/builders';
import Sequelize from 'sequelize';
import { EMAIL_REGEX } from "../../utils/regex.js";
import { Subscribers } from '../../data/models/subscribers.js';

const { QueryTypes } = Sequelize;

export const data = new SlashCommandBuilder()
  .setName('subscribe')
  .setDescription('Subscribe to Nexus Aurora emails!')
  .addStringOption(option => option.setName('email').setDescription('Enter your email'));
export async function execute(interaction) {

  const email = interaction.options.getString('email');

  if( !email ) {
    return await interaction.reply({ content: `Please provide an email address.`, ephemeral: true });
  }

  if(! EMAIL_REGEX.test(email.toLowerCase())) {
    return await interaction.reply({ content: `Sorry, but the email "${email}" is invalid.`, ephemeral: true });
  }

  const subscriber = await Subscribers.findOrCreate(email);

  if(subscriber){
    console.log(`${email} Subscribed!`);
    return await interaction.reply({ content: `Thank you! "${email}" has been subscribed!`, ephemeral: true });
  }

  await interaction.reply({ content: `Unable to subscribe`, ephemeral: true });
}