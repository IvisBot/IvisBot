const { LOG_MODS, BOT_LOGO, BOT_TEXTFOOTER } = require('../../../config.json');
const { AuditLogEvent, EmbedBuilder } = require("discord.js");

module.exports = {
    name : 'roleCreate',
    async execute(role) {
        const fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.RoleCreate,
        });

        const RoleCreateLog = fetchedLogs.entries.first();

        const roleCreatedEmbed = new EmbedBuilder()
            .setColor(role.hexColor)
            .setDescription(`<@${RoleCreateLog.executor.id}> has created a role.`)
            .addFields(
                {
                    name: "**Name:**",
                    value: `${role.name}`
                },
                {
                    name: "**Cole:**",
                    value: `base 10: ${role.color} | base 16: ${role.hexColor}`
                },
                {
                    name: "**ID:**",
                    value: `\`\`\`ini\nRoleID = ${role.id}\nExecutorID = ${RoleCreateLog.executor.id}\`\`\``
                }
            )
            .setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO });

        await role.guild.channels.cache.get(LOG_MODS).send({embeds: [roleCreatedEmbed]})
    }
};