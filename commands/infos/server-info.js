const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { SERVER_DESCRIPTION } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server-info')
		.setDescription('Display info about this server.'),
	async execute(interaction) {

		console.log("salut");

		icon = interaction.guild.iconURL()

		const serverInfoEmbed = new EmbedBuilder()
			.setColor('Purple')
			.setTitle(interaction.guild.name)
			.setDescription(`${SERVER_DESCRIPTION}`)
			.addFields(
				{
					name : "Creation date :",
					value : `<t:${`${interaction.guild.createdTimestamp}`.slice(0, 10)}:d>`,
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
					name : "Total nitro boosts :",
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
		
		if (interaction.guild.vanityURLCode) interaction.channel.send(`Invite your friends :  ${interaction.guild.vanityURLCode}`);
		interaction.reply({ embeds: [serverInfoEmbed] });
	},
};