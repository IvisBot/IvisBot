const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('Get the avatar URL of the selected user, or your own avatar.')
		.addUserOption(option => option.setName('target').setDescription('The user\'s avatar to show')),
	async execute(interaction) {
		const user = interaction.options.getUser('target');
		if (user) username = `${user.username}'s avatar`, avatar = user.avatarURL();
		else username = 'Your avatar', avatar = interaction.user.avatarURL();

		console.log(username, avatar);

		const avatarEmbed = new EmbedBuilder()
			.setColor('Purple')
			.setTitle(username)
			.setURL(avatar)
			.setAuthor({ name: 'Ivis', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
			.setImage(avatar)
			.setTimestamp()
			.setFooter({ text: 'IvisBot, A fully modular Discord Bot', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
		
		interaction.reply({ embeds: [avatarEmbed] });
	},
};