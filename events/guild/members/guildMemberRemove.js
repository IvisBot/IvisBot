const { MEMBERS_TRACKING } = require('../../../config.json');
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name : 'guildMemberRemove',
    execute(member) {
        const leaveEmbed = new EmbedBuilder()
            .setColor("#bb0b0b")
            .setDescription(`<@${member.id}> just left the server.`)
            .setThumbnail(member.user.avatarURL())
            .addFields(
                {
                    name: "**Information on the user:**",
                    value: `${member.user.username}` + "#" + `${member.user.discriminator}`
                },
                {
                    name: "**Joined the:**",
                    value: `${new Date(member.joinedAt).toUTCString()} (${Math.abs(((new Date().getTime() - member.joinedAt) / 1000 / 60 / 60 / 24)).toFixed(0)} jours)`
                },
                {
                    name: "**Account created the:**",
                    value: `${new Date(member.user.createdAt).toUTCString()} (${Math.abs(((new Date().getTime() - member.user.createdAt) / 1000 / 60 / 60 / 24)).toFixed(0)} jours`
                },
                {
                    name: "**ID:**",
                    value: `\`\`\`ini\nUser = ${member.id}\`\`\``
                }
            )
        member.guild.channels.cache.get(MEMBERS_TRACKING).send({embeds: [leaveEmbed]});
    }
}