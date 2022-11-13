const { BOT_LOGO, BOT_TEXTFOOTER} = require('../../config.json');
const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the current song"),

	async execute ({ client, interaction }) {

		const queue = client.player.getQueue(interaction.guildId)

		if (!queue)
        {
            await interaction.reply("There are no songs in the queue");
            return;
        }

        const currentSong = queue.current

        console.log(currentSong)
        const skipEmbed = new EmbedBuilder()
            .setDescription(`${currentSong.title} \`[${currentSong.duration}]\` - <@${currentSong.requestedBy.id}>`);

            if (queue.tracks[0]) {
                skipEmbed.addFields({name: 'Now playing :', value : `${queue.tracks[0].title} \`[${queue.tracks[0].duration}]\` - <@${queue.tracks[0].requestedBy.id}>`, inline: false});
            }

            skipEmbed
                .setAuthor({ name: 'Skipped by '+interaction.user.tag, iconURL: interaction.user.avatarURL() })
                .setThumbnail(currentSong.thumbnail)
                .setColor('#9011FF')
                .setTimestamp()
                .setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO});

        
		queue.skip()
        
        await interaction.reply({embeds: [skipEmbed]});
	},
}