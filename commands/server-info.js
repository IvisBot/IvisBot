const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server-info')
		.setDescription('Display info about this server.'),
	async execute(interaction) {

		console.log(interaction.guild.iconURL())
		
		const serverInfoEmbed = new EmbedBuilder()
			.setColor('Purple')
			.setTitle(interaction.guild.name)
			.setDescription(`Total members: ${interaction.guild.memberCount}`)
			.setURL(interaction.guild.iconURL())
			.setAuthor({ name: 'Ivis', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
			.setImage(interaction.guild.iconURL())
			.setTimestamp()
			.setFooter({ text: 'IvisBot, A fully modular Discord Bot', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
		
		interaction.reply({ embeds: [serverInfoEmbed] });
	},
};