const { LOG_MODS } = require('../../../config.json');
const { AuditLogEvent, EmbedBuilder } = require("discord.js");

module.exports = {
    name : 'roleDelete',
    async execute(role) {
        const fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.RoleDelete,
        });

        const RoleDeletionLog = fetchedLogs.entries.first();

        const RoleDeletedEmbed = new EmbedBuilder()
            .setColor(role.hexColor)
            .setDescription(`<@${RoleDeletionLog.executor.id}> has deleted a role.`)
            .addFields(
                {
                    name: "**Name:**",
                    value: `${role.name}`
                },
                {
                    name: "**Color:**",
                    value: `base 10: ${role.color} | base 16: ${role.hexColor}`
                },
                {
                    name: "**ID:**",
                    value: `\`\`\`ini\nRoleID = ${role.id}\nExecutorID = ${RoleDeletionLog.executor.id}\`\`\``
                }
            )

    await role.guild.channels.cache.get(LOG_MODS).send({embeds: [RoleDeletedEmbed]})
    }
}