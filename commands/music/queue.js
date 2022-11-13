const { BOT_LOGO, BOT_TEXTFOOTER} = require('../../config.json');
const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("shows first 10 songs in the queue"),
    async execute ({ client, interaction }) {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue.current)
        {
            return interaction.reply("There is no song in the queue");
        }

        const queueString = queue.tracks.slice(0, 10).map((song, i) => {
            return `${i+1}) ${song.title} \`[${song.duration}]\` - <@${song.requestedBy.id}>`
        }).join("\n")

        const currentSong = queue.current

        queueEmbed = new EmbedBuilder()
            .setThumbnail(currentSong.setThumbnail)
            .addFields({name: 'Currently Playing :', value : `${currentSong.title} \`[${currentSong.duration}]\` - <@${currentSong.requestedBy.id}>`, inline: true},);

        if (queue.tracks[0]) {
            queueEmbed.addFields({name: 'Queue :', value : queueString, inline: false});

        }
        queueEmbed
            .setAuthor({ name: 'Asked by '+interaction.user.tag, iconURL: interaction.user.avatarURL() })
            .setColor('#9011FF')
            .setTimestamp()
            .setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO});

        await interaction.reply({embeds: [queueEmbed]})
    }
}