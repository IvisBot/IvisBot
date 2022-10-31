const { LOG_MODS, BOT_LOGO, BOT_TEXTFOOTER} = require('../../../config.json');
const { AuditLogEvent, EmbedBuilder } = require("discord.js");

module.exports = {
    name : 'guildUpdate',
    description : 'Logs when a guild is updated.',
    async execute (guild) {
        const fetchedLogs = await guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.GuildUpdate,
        });

        const GuildUpdateLog = fetchedLogs.entries.first();

        console.log(GuildUpdateLog);

        const GuildUpdatedEmbed = new EmbedBuilder()
            .setColor("LightGrey")
            .setDescription(`<@${GuildUpdateLog.executor.id}> updated the server.`)
            .setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO })

        for (const i in GuildUpdateLog.changes) {
            switch (GuildUpdateLog.changes[i].key) {
                case "name":
                    GuildUpdatedEmbed.addFields( {name : "Name", value : `\`\`\`ini\nOld_name = ${GuildUpdateLog.changes[i]['old']}\nNew_name = ${GuildUpdateLog.changes[i]['new']}\`\`\``} )
                    break;
                case "owner_id":
                    GuildUpdatedEmbed.addFields( {name : "Owner", value : `\`\`\`ini\nOld_owner = ${GuildUpdateLog.changes[i]['old']}\nNew_owner = ${GuildUpdateLog.changes[i]['new']}\`\`\``} )
                    break;
                case "region":
                    GuildUpdatedEmbed.addFields( {name : "Region", value : `\`\`\`ini\nOld_region = ${GuildUpdateLog.changes[i]['old']}\nNew_region = ${GuildUpdateLog.changes[i]['new']}\`\`\``} )
                    break;
                case "afk_channel_id":
                    GuildUpdatedEmbed.addFields( {name : "AFK Channel", value : `\`\`\`ini\nOld_channel = ${GuildUpdateLog.changes[i]['old']}\nNew_channel = ${GuildUpdateLog.changes[i]['new']}\`\`\``} )
                    break;
                case "afk_timeout":
                    GuildUpdatedEmbed.addFields( {name : "AFK Timeout", value : `\`\`\`ini\nOld_timeout = ${GuildUpdateLog.changes[i]['old']}\nNew_timeout = ${GuildUpdateLog.changes[i]['new']}\`\`\``} )
                    break;
                case "system_channel_id":
                    GuildUpdatedEmbed.addFields( {name : "System Channel", value : `\`\`\`ini\nOld_channel = ${GuildUpdateLog.changes[i]['old']}\nNew_channel = ${GuildUpdateLog.changes[i]['new']}\`\`\``} )
                    break;
                case "mfa_level":
                    GuildUpdatedEmbed.addFields( {name : "MFA Level", value : `\`\`\`ini\nOld_level = ${GuildUpdateLog.changes[i]['old']}\nNew_level = ${GuildUpdateLog.changes[i]['new']}\`\`\``} )
                    break;
                case "verification_level":
                    GuildUpdatedEmbed.addFields( {name : "Verification Level", value : `\`\`\`ini\nOld_level = ${GuildUpdateLog.changes[i]['old']}\nNew_level = ${GuildUpdateLog.changes[i]['new']}\`\`\``} )
                    break;
                case "explicit_content_filter":
                    GuildUpdatedEmbed.addFields( {name : "Explicit Content Filter", value : `\`\`\`ini\nOld_filter = ${GuildUpdateLog.changes[i]['old']}\nNew_filter = ${GuildUpdateLog.changes[i]['new']}\`\`\``} )
                    break;
                case "default_message_notifications":
                    GuildUpdatedEmbed.addFields( {name : "Default Message Notifications", value : `\`\`\`ini\nOld_notifications = ${GuildUpdateLog.changes[i]['old']}\nNew_notifications = ${GuildUpdateLog.changes[i]['new']}\`\`\``} )
                    break;
                case "vanity_url_code":
                    GuildUpdatedEmbed.addFields( {name : "Vanity URL Code", value : `\`\`\`ini\nOld_code = ${GuildUpdateLog.changes[i]['old']}\nNew_code = ${GuildUpdateLog.changes[i]['new']}\`\`\``} )
                    break;
                case "icon_hash":
                    GuildUpdatedEmbed.addFields( {name : "Icon Hash", value : `\`\`\`ini\nOld_hash = ${GuildUpdateLog.changes[i]['old']}\nNew_hash = ${GuildUpdateLog.changes[i]['new']}\`\`\``} )
                    break;
                case "banner_hash":
                    GuildUpdatedEmbed.addFields( {name : "Banner Hash", value : `\`\`\`ini\nOld_hash = ${GuildUpdateLog.changes[i]['old']}\nNew_hash = ${GuildUpdateLog.changes[i]['new']}\`\`\``} )
                    break;
                default :
                    GuildUpdatedEmbed.addFields( {name : "Unknown", value : `\`\`\`ini\nOld = ${GuildUpdateLog.changes[i]['old']}\nNew = ${GuildUpdateLog.changes[i]['new']}\`\`\``} )
                    break;
            }
        }

        GuildUpdatedEmbed.addFields( {name: "**ID:**", value: `\`\`\`ini\nRoleID = ${guild.id}\nExecutorID = ${GuildUpdateLog.executor.id}\`\`\``} )

        await guild.channels.cache.get(LOG_MODS).send({embeds: [GuildUpdatedEmbed]});
    }
}