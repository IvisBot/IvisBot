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

        const GuildUpdatedEmbed = new EmbedBuilder()
            .setColor("LightGrey")
            .setDescription(`<@${GuildUpdateLog.executor.id}> updated the server.`)
            .setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO })

        for (const i in GuildUpdateLog.changes) {
            if (GuildUpdateLog.changes[i].key == "name") {
                GuildUpdatedEmbed.addFields( {name : "Name", value : `\`\`\`ini\nOld_name = ${GuildUpdateLog.changes[i]['old']}\nNew_name = ${GuildUpdateLog.changes[i]['new']}\`\`\``} )
            } else if (GuildUpdateLog.changes[i].key == "icon_hash") {
                GuildUpdatedEmbed.addFields( {name : "Icon", value : `\`\`\`ini\nOld_icon = ${GuildUpdateLog.changes[i]['old']}\nNew_icon = ${GuildUpdateLog.changes[i]['new']}\`\`\``} )
            } else if (GuildUpdateLog.changes[i].key == "splash_hash") {
                GuildUpdatedEmbed.addFields( {name : "Splash", value : `\`\`\`ini\nOld_splash = ${GuildUpdateLog.changes[i]['old']}\nNew_splash = ${GuildUpdateLog.changes[i]['new']}\`\`\``} )
            } else if (GuildUpdateLog.changes[i].key == "discovery_splash_hash") {
                GuildUpdatedEmbed.addFields( {name : "Discovery Splash", value : `\`\`\`ini\nOld_discovery_splash = ${GuildUpdateLog.changes[i]['old']}\nNew_discovery_splash = ${GuildUpdateLog.changes[i]['new']}\`\`\``} )
            } else if (GuildUpdateLog.changes[i].key == "banner_hash") {
                GuildUpdatedEmbed.addFields( {name : "Banner", value : `\`\`\`ini\nOld_banner = ${GuildUpdateLog.changes[i]['old']}\nNew_banner = ${GuildUpdateLog.changes[i]['new']}\`\`\``} )
            } else if (GuildUpdateLog.changes[i].key == "owner_id") {
                GuildUpdatedEmbed.addFields( {name : "Owner", value : `\`\`\`ini\nOld_owner = ${GuildUpdateLog.changes[i]['old']}\nNew_owner = ${GuildUpdateLog.changes[i]['new']}\`\`\``} )
            } else if (GuildUpdateLog.changes[i].key == "region") {
                GuildUpdatedEmbed.addFields( {name : "Region", value : `\`\`\`ini\nOld_region = ${GuildUpdateLog.changes[i]['old']}\nNew_region = ${GuildUpdateLog.changes[i]['new']}\`\`\``} )
            }
        }

        GuildUpdatedEmbed.addFields( {name: "**ID:**", value: `\`\`\`ini\nRoleID = ${guild.id}\nExecutorID = ${GuildUpdateLog.executor.id}\`\`\``} )

        await guild.channels.cache.get(LOG_MODS).send({embeds: [GuildUpdatedEmbed]});
    }
}