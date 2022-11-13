const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require('discord.js');
const { BOT_LOGO, BOT_TEXTFOOTER} = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Resumes the current song"),
	async execute ({ client, interaction }) {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue)
        {
            await interaction.reply("No songs in the queue");
            return;
        }

		queue.setPaused(false);

        embed = new EmbedBuilder()
            .setDescription(`▶️ Music player has been resumed!`)
            .setAuthor({ name: 'Resumed by '+interaction.user.tag, iconURL: interaction.user.avatarURL() })
            .setColor('#9011FF')
            .setTimestamp()
            .setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO});

        await interaction.reply({embeds:[embed]})
	},
}