const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Display level of someone.'),
	async execute({ client, interaction }) {
		return interaction.reply(`You are level 0`);
	},
};