const { LOG_MODS, BOT_LOGO, BOT_TEXTFOOTER } = require('../../config.json');
const { AuditLogEvent, EmbedBuilder } = require("discord.js");

module.exports = {
    name : 'channelCreate',
    async execute(channel) {
        const fetchedLogs = await channel.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.ChannelCreate,
        });

        const ChannelCreateLog = fetchedLogs.entries.first();

        switch (ChannelCreateLog.target.type) {
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

        const channelCreatedEmbed = new EmbedBuilder()
            .setDescription(`<@${ChannelCreateLog.executor.id}> has created a channel <#${ChannelCreateLog.target.id}>.`)
            .addFields(
                {
                    name: "**Name:**",
                    value: `${ChannelCreateLog.target.name}`
                },
                {
                    name: "**Type:**",
                    value: `${typeChannel}`
                },
                {
                    name: "**ID:**",
                    value: `\`\`\`ini\nMemberID = ${ChannelCreateLog.executor.id}\nChannelID = ${ChannelCreateLog.target.id}\`\`\``
                }
            )
            .setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO });
        
        await channel.guild.channels.cache.get(LOG_MODS).send({embeds: [channelCreatedEmbed]})
    }
}