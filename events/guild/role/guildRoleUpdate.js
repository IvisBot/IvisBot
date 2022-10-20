const { LOG_MODS } = require('../../../config.json');
const { AuditLogEvent, EmbedBuilder } = require("discord.js");
const jsdiscordperms = require("jsdiscordperms");

module.exports = {
    name : 'roleUpdate',
    async execute (role) {
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
                RoleUpdatedEmbed.addFields( {name : "Name", value : `\`\`\`ini\nOld_name = ${RoleUpdateLog.changes[i]['old']}\nNew_name = ${RoleUpdateLog.changes[i]['new']}\`\`\``} )
            } else if (RoleUpdateLog.changes[i]['key'] == 'color') {
                RoleUpdatedEmbed.addFields( {name: "**Color:**", value: `\`\`\`ini\nAncient_color: #${RoleUpdateLog.changes[i]['old'].toString(16)}\nNew_color: #${RoleUpdateLog.changes[i]['new'].toString(16)}\`\`\``} )
            } else if  (RoleUpdateLog.changes[i]['key'] == 'permissions') {
                RoleUpdatedEmbed.addFields( {name: "**Permissions:**", value: `\`\`\`ini\nOld_permissions: ${jsdiscordperms(RoleUpdateLog.changes[i]['old'])}\nNew_permissions: ${jsdiscordperms(RoleUpdateLog.changes[i]['new'])}\`\`\``} )
            }
        }

        RoleUpdatedEmbed.addFields( {name: "**ID:**", value: `\`\`\`ini\nRoleID = ${role.id}\nExecutorID = ${RoleUpdateLog.executor.id}\`\`\``} )

        await role.guild.channels.cache.get(LOG_MODS).send({embeds: [RoleUpdatedEmbed]})

        /*
        if(RoleUpdateLog.changes[1] === undefined) {
            if(RoleUpdateLog.changes[0]['key'] === 'color') {
                const RoleUpdatedEmbed = new EmbedBuilder()
                    .setColor(role.hexColor)
                    .setDescription(`<@${RoleUpdateLog.executor.id}> modified a role.`)
                    .addFields(
                        {
                            name: "**Name:**",
                            value: `${role.name}`
                        },
                        {
                            name: "**Color:**",
                            value: `Ancient color: #${RoleUpdateLog.changes[0]['old'].toString(16)}\nNew color: #${RoleUpdateLog.changes[0]['new'].toString(16)}`
                        },
                        {
                            name: "**ID:**",
                            value: `\`\`\`ini\nRoleID = ${role.id}\nExecutorID = ${RoleUpdateLog.executor.id}\`\`\``
                        }
                    )
    
                await role.guild.channels.cache.get(LOG_MODS).send({embeds: [RoleUpdatedEmbed]})
            } else {
    
                var oldpermissions = jsdiscordperms.convertPerms(RoleUpdateLog.changes[0]['old']);
                var newpermissions = jsdiscordperms.convertPerms(RoleUpdateLog.changes[0]['new']);
    
                var changedpermissions = []
    
                for (let key in oldpermissions) {
                    if(oldpermissions[key] !== newpermissions[key]) {
                        if(newpermissions[key] === true) {
                            changedpermissions.push(`+${key}`)
                        } else {
                            changedpermissions.push(`-${key}`)
                        }
                    }
                }
    
                const RoleUpdatedEmbed = new EmbedBuilder()
                    .setColor(role.hexColor)
                    .setDescription(`<@${RoleUpdateLog.executor.id}> modified a role.`)
                    .addFields(
                        {
                            name: "**Name:**",
                            value: `${role.name}`
                        },
                        {
                            name: '**changed permissions:**',
                            value: changedpermissions.join('\n')
                        },
                        {
                            name: "**ID:**",
                            value: `\`\`\`ini\nRoleID = ${role.id}\nExecutorID = ${RoleUpdateLog.executor.id}\`\`\``
                        }
                    )
                
                await role.guild.channels.cache.get(LOG_MODS).send({embeds: [RoleUpdatedEmbed]})
            }
        } else {
            var oldpermissions = jsdiscordperms.convertPerms(RoleUpdateLog.changes[0]['old']);
            var newpermissions = jsdiscordperms.convertPerms(RoleUpdateLog.changes[0]['new']);
    
            var changedpermissions = []
    
            for (let key in oldpermissions) {
                if(oldpermissions[key] !== newpermissions[key]) {
                    if(newpermissions[key] === true) {
                        changedpermissions.push(`+${key}`)
                    } else {
                        changedpermissions.push(`-${key}`)
                    }
                }
            }
    
            const RoleUpdatedEmbed = new EmbedBuilder()
                .setColor(role.hexColor)
                .setDescription(`<@${RoleUpdateLog.executor.id}> modified a role.`)
                .addFields(
                    {
                        name: "**Name:**",
                        value: `${role.name}`
                    },
                    {
                        name: "**Color:**",
                        value: `Ancient color: #${RoleUpdateLog.changes[0]['old'].toString(16)}\nNew color: #${RoleUpdateLog.changes[0]['new'].toString(16)}`
                    },
                    {
                        name: '**changed permissions:**',
                        value: changedpermissions.join('\n')
                    },
                    {
                        name: "**ID:**",
                        value: `\`\`\`ini\nRoleID = ${role.id}\nExecutorID = ${RoleUpdateLog.executor.id}\`\`\``
                    }
                )
            
            await role.guild.channels.cache.get(LOG_MODS).send({embeds: [RoleUpdatedEmbed]})
        }
        */
    }
}