const { LOG_MODS, BOT_LOGO, BOT_TEXTFOOTER } = require('../../config.json');
const { AuditLogEvent, EmbedBuilder } = require("discord.js");

module.exports = {
    name : 'channelDelete',
    async execute(channel) {
        const fetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.ChannelDelete,
        });

        const ChannelDeleteLog = fetchedLogs.entries.first();

        switch (ChannelDeleteLog.target.type) {
            case 0 :
                typeChannel = "Text";
                break;
            case 2 :
                typeChannel = "Voice";
                break;
            case 4 :
                typeChannel = "Category";
                break;
            case 5 :
                typeChannel = "News";
                break;
            case 13 :
                typeChannel = "Stage";
                break;
            case 15 :
                typeChannel = "Forum";
                break;
            default:
                typeChannel = "Unknown";
                break;
        }

        const channelDeletedEmbed = new EmbedBuilder()
            .setDescription(`<@${ChannelDeleteLog.executor.id}> has deleted a channel.`)
            .addFields(
                {
                    name: "**Name:**",
                    value: `${ChannelDeleteLog.target.name}`
                },
                {
                    name: "**Type:**",
                    value: `${typeChannel}`
                },
                {
                    name: "**ID:**",
                    value: `\`\`\`ini\nMemberID = ${ChannelDeleteLog.executor.id}\nChannelID = ${ChannelDeleteLog.target.id}\`\`\``
                }
            )
            .setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO });
        
        await channel.guild.channels.cache.get(LOG_MODS).send({embeds: [channelDeletedEmbed]})
    }
}