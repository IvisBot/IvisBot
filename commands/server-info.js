const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const { SERVER_DESCRIPTION } = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server-info')
		.setDescription('Display info about this server.'),
	async execute(interaction) {

		icon = interaction.guild.iconURL()

		const serverInfoEmbed = new EmbedBuilder()
			.setColor('Purple')
			.setTitle(interaction.guild.name)
			.setDescription(`${SERVER_DESCRIPTION}`)
			.addFields(
				{
					name : "Creation date :",
					value : `${`\`${interaction.guild.createdAt}`.split(' ').slice(0, 4).join(" ")}\``,
					inline : true
				},
				{
					name : "Server owner :",
					value : `<@${interaction.guild.ownerId}>`,
					inline : true
				},
				{
					name : '\u200b',
					value : '\u200b',
					inline : true
				},
				{
					name : "Total members :",
					value : `\`${interaction.guild.memberCount}\``,
					inline : true
				},
				{
					name : "Amount of nitro boost :",
					value : `\`${interaction.guild.premiumSubscriptionCount}\``,
					inline : true
				},
				{
					name : '\u200b',
					value : '\u200b',
					inline : true
				},
				{
					name : "Rule channel :",
					value : `<#${interaction.guild.rulesChannelId}>`
				}
			)
			.setAuthor({ name: 'Ivis', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
			.setTimestamp()
			.setFooter({ text: 'IvisBot, A fully modular Discord Bot', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
		
		if (icon) {
			serverInfoEmbed.setImage(icon)
			serverInfoEmbed.setURL(icon)
		} else {
			serverInfoEmbed.addFields({ name : "An error occured !", value : "You server has no icon." })
		};
		
		interaction.reply({ embeds: [serverInfoEmbed] });
	},
};