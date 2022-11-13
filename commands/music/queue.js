//a faire
const { BOT_LOGO, BOT_TEXTFOOTER} = require('../../config.json');
const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("shows first 10 songs in the queue"),
    async execute ({ client, interaction }) {
        const queue = client.player.getQueue(interaction.guildId)

        if (!queue || !queue.playing)
        {
            return interaction.reply("There are no songs in the queue");
        }

        const queueString = queue.tracks.slice(0, 10).map((song, i) => {
            return `${i+1}) ${song.title} \`[${song.duration}]\` - <@${song.requestedBy.id}>`
        }).join("\n")

        const currentSong = queue.current

        queueEmbed = new EmbedBuilder()
            //.setDescription( (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} - <@${currentSong.requestedBy.id}>` : "None")
            .setThumbnail(currentSong.setThumbnail)
            .addFields({name: 'Currently Playing :', value : `*${currentSong.title}* \`[${currentSong.duration}]\` - <@${currentSong.requestedBy.id}>`, inline: true},
                       {name: 'Queue :', value : queueString, inline: false})
            .setAuthor({ name: 'Added by '+interaction.user.tag, iconURL: BOT_LOGO })
            .setColor('#9011FF')
            .setTimestamp()
            .setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO});

        await interaction.reply({embeds: [queueEmbed]})
    }
}