const { LOG_MODS } = require('../../../config.json');
const { AuditLogEvent, EmbedBuilder } = require("discord.js");
const jsdiscordperms = require("jsdiscordperms");

module.exports = {
    name : 'roleUpdate',
    async execute (role) {
        console.log("salut");
        const fetchedLogs = await role.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.RoleUpdate,
        });

        const RoleUpdateLog = fetchedLogs.entries.first();

        const RoleUpdatedEmbed = new EmbedBuilder()
            .setColor(role.hexColor)
            .setDescription(`<@${RoleUpdateLog.executor.id}> modified a role.`)
        
        for (const i in RoleUpdateLog.changes) {
            if (RoleUpdateLog.changes[i]['key'] == 'name') {
                RoleUpdatedEmbed.addFields( {name : "Name", value : `\`\`\`ini\nOld_name = ${RoleUpdateLog.changes[i]['old']}\nNew_name = ${RoleUpdateLog.changes[i]['new']}\`\`\``} );
            } else if (RoleUpdateLog.changes[i]['key'] == 'color') {
                RoleUpdatedEmbed.addFields( {name : "Color", value : `\`\`\`ini\nOld_color = ${RoleUpdateLog.changes[i]['old']}\nNew_color = ${RoleUpdateLog.changes[i]['new']}\`\`\``} );
                RoleUpdatedEmbed.setColor(RoleUpdateLog.changes[i]['new']);
            } else if  (RoleUpdateLog.changes[i]['key'] == 'permissions') {
                const oldpermissions = jsdiscordperms.convertPerms(RoleUpdateLog.changes[i]['old']);
                const newpermissions = jsdiscordperms.convertPerms(RoleUpdateLog.changes[i]['new']);
        
                const changedpermissions = []
        
                for (const key in oldpermissions) {
                    if(oldpermissions[key] !== newpermissions[key]) {
                        if(newpermissions[key] === true) {
                            changedpermissions.push(`+${key}`)
                        } else {
                            changedpermissions.push(`-${key}`)
                        }
                    }
                }

                RoleUpdatedEmbed.addFields( {name: "**Permissions:**", value: `\`\`\`ini\n${changedpermissions.join("\n")}\`\`\``} );
            }
        }

        RoleUpdatedEmbed.addFields( {name: "**ID:**", value: `\`\`\`ini\nRoleID = ${role.id}\nExecutorID = ${RoleUpdateLog.executor.id}\`\`\``} )

        await role.guild.channels.cache.get(LOG_MODS).send({embeds: [RoleUpdatedEmbed]})
    }
}