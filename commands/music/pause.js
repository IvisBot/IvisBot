const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require('discord.js');
const { BOT_LOGO, BOT_TEXTFOOTER} = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the current song"),
	async execute ({ client, interaction }) {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue)
		{
			await interaction.reply("There is no song in this playlist.")
			return;
		}

		queue.setPaused(true);

		embed = new EmbedBuilder()
            .setDescription(`⏸️ Player has been paused.`)
            .setAuthor({ name: 'Paused by '+interaction.user.tag, iconURL: interaction.user.avatarURL() })
            .setColor('#9011FF')
            .setTimestamp()
            .setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO});

        await interaction.reply({embeds:[embed]})

	},
}