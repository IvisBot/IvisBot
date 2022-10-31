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
            return `${i}) [${song.duration}]\` ${song.title} - <@${song.requestedBy.id}>`
        }).join("\n")

        const currentSong = queue.current

        queueEmbed = new EmbedBuilder()
            .setDescription(`**Currently Playing**\n` + 
            (currentSong ? `\`[${currentSong.duration}]\` ${currentSong.title} - <@${currentSong.requestedBy.id}>` : "None") +
            `\n\n**Queue**\n${queueString}`)
            .setThumbnail(currentSong.setThumbnail)

        await interaction.reply({embeds: [queueEmbed]})
    }
}