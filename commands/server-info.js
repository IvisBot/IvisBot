const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server-info')
		.setDescription('Display info about this server.'),
	async execute(interaction) {

		icon = interaction.guild.iconURL()

		const serverInfoEmbed = new EmbedBuilder()
			.setColor('Purple')
			.setTitle(interaction.guild.name)
			.setDescription(`Total members: ${interaction.guild.memberCount}`)
			.setAuthor({ name: 'Ivis', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
			.setTimestamp()
			.setFooter({ text: 'IvisBot, A fully modular Discord Bot', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
		
		if (icon) {
			serverInfoEmbed.setImage(icon)
			serverInfoEmbed.setURL(icon)
		} else {
			serverInfoEmbed.addFields( 
				{ name : "An error occured !",
				value : "You server has no icon."}
			)
		};
		
		interaction.reply({ embeds: [serverInfoEmbed] });
	},
};