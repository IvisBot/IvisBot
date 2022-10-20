const { LOG_MODS } = require('../../../config.json');
const { AuditLogEvent, EmbedBuilder } = require("discord.js");

module.exports = {
    name : 'roleCreate',
    async execute(role) {
        const fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.RoleCreate,
        });

        const roleCreationLog = fetchedLogs.entries.first();

        const roleCreatedEmbed = new EmbedBuilder()
            .setColor(role.hexColor)
            .setDescription(`<@${roleCreationLog.executor.id}> has created a role`)
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
                    value: `\`\`\`ini\nRoleID = ${role.id}\nCreateurID = ${roleCreationLog.executor.id}\`\`\``
                }
            )

        await role.guild.channels.cache.get(LOG_MODS).send({embeds: [roleCreatedEmbed]})
    }
};