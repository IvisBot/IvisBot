const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('level')
		.setDescription('Display level of someone.'),
	async execute(interaction) {
		return interaction.reply(`You are level 0`);
	},
};