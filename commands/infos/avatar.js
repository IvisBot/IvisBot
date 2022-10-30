const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { BOT_LOGO, BOT_TEXTFOOTER } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Get the avatar URL of the selected user, or your own avatar.')
		.addUserOption(option => option.setName('target').setDescription('The user\'s avatar to show')),
	async execute({ client, interaction }) {
		const user = interaction.options.getUser('target');
		if (user) username = `${user.username}'s avatar`, avatar = user.avatarURL();
		else username = 'Your avatar', avatar = interaction.user.avatarURL();

		const avatarEmbed = new EmbedBuilder()
			.setColor('Purple')
			.setTitle(username)
			.setURL(avatar)
			.setAuthor({ name: 'Ivis', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
			.setImage(avatar)
			.setTimestamp()
			.setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO });
		
		interaction.reply({ embeds: [avatarEmbed] });
	},
};