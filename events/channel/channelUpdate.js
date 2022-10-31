const { LOG_MODS, BOT_LOGO, BOT_TEXTFOOTER } = require('../../config.json');
const { AuditLogEvent, EmbedBuilder } = require("discord.js");
const jsdiscordperms = require("jsdiscordperms");

module.exports = {
    name : 'channelUpdate',
    async execute(oldChannel, newChannel) {
        const fetchedLogs = await newChannel.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.ChannelUpdate,
        });

        const ChannelUpdateLog = fetchedLogs.entries.first();

        const channelUpdatedEmbed = new EmbedBuilder()
            .setDescription(`<@${ChannelUpdateLog.executor.id}> has updated a channel <#${ChannelUpdateLog.target.id}>.`)
            .setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO });
        
        for (const i in ChannelUpdateLog.changes) {
            switch (ChannelUpdateLog.changes[i].key) {
                case "name":
                    channelUpdatedEmbed.addFields(
                        {
                            name: "**Name:**",
                            value: `\`\`\`ini\nOld = ${ChannelUpdateLog.changes[i].old}\nNew = ${ChannelUpdateLog.changes[i].new}\`\`\``
                        }
                    );
                    break;
                case "nsfw":
                    channelUpdatedEmbed.addFields(
                        {
                            name: "**NSFW:**",
                            value: `\`\`\`ini\nOld = ${ChannelUpdateLog.changes[i].old}\nNew = ${ChannelUpdateLog.changes[i].new}\`\`\``
                        }
                    );
                    break;
                case "parent":
                    channelUpdatedEmbed.addFields(
                        {
                            name: "**Category:**",
                            value: `\`\`\`ini\nOld = ${ChannelUpdateLog.changes[i].old}\nNew = ${ChannelUpdateLog.changes[i].new}\`\`\``
                        }
                    );
                    break;
                case "rate_limit_per_user":
                    channelUpdatedEmbed.addFields(
                        {
                            name: "**Slowmode:**",
                            value: `\`\`\`ini\nOld = ${ChannelUpdateLog.changes[i].old}\nNew = ${ChannelUpdateLog.changes[i].new}\`\`\``
                        }
                    );
                    break;
                case "topic":
                    channelUpdatedEmbed.addFields(
                        {
                            name: "**Topic:**",
                            value: `\`\`\`ini\nOld = ${ChannelUpdateLog.changes[i].old}\nNew = ${ChannelUpdateLog.changes[i].new}\`\`\``
                        }
                    );
                    break;
                case "bitrate":
                    channelUpdatedEmbed.addFields(
                        {
                            name: "**Bitrate:**",
                            value: `\`\`\`ini\nOld = ${ChannelUpdateLog.changes[i].old}\nNew = ${ChannelUpdateLog.changes[i].new}\`\`\``
                        }
                    );
                    break;
                case "user_limit":
                    channelUpdatedEmbed.addFields(
                        {
                            name: "**User limit:**",
                            value: `\`\`\`ini\nOld = ${ChannelUpdateLog.changes[i].old}\nNew = ${ChannelUpdateLog.changes[i].new}\`\`\``
                        }
                    );
                    break;
                case "position":
                    channelUpdatedEmbed.addFields(
                        {
                            name: "**Position:**",
                            value: `\`\`\`ini\nOld = ${ChannelUpdateLog.changes[i].old}\nNew = ${ChannelUpdateLog.changes[i].new}\`\`\``
                        }
                    );
                    break;
                case "type":
                    ChannelUpdateLog.changes[i].new == 5 ? newType = "Announcement" : newType = "Text";
                    ChannelUpdateLog.changes[i].old == 5 ? oldType = "Announcement" : oldType = "Text";
                    channelUpdatedEmbed.addFields(
                        {
                            name: "**Type:**",
                            value: `\`\`\`ini\nOld = ${oldType}\nNew = ${newType}\`\`\``
                        }
                    );
                case "video_quality_mode":
                    channelUpdatedEmbed.addFields(
                        {
                            name: "**Video quality mode:**",
                            value: `\`\`\`ini\nOld = ${ChannelUpdateLog.changes[i].old}\nNew = ${ChannelUpdateLog.changes[i].new}\`\`\``
                        }
                    );
                    break;
                case "default_auto_archive_duration":
                    channelUpdatedEmbed.addFields(
                        {
                            name: "**Default auto archive duration:**",
                            value: `\`\`\`ini\nOld = ${ChannelUpdateLog.changes[i].old}\nNew = ${ChannelUpdateLog.changes[i].new}\`\`\``
                        }
                    );
                    break;
                case "permission_overwrites":
                    const oldpermissions = jsdiscordperms.convertPerms(ChannelUpdateLog.changes[i]['old']);
                    const newpermissions = jsdiscordperms.convertPerms(ChannelUpdateLog.changes[i]['new']);
            
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

                    channelUpdatedEmbed.addFields(
                        {
                            name: "**Permission overwrites:**",
                            value: `\`\`\`ini\n${changedpermissions.join("\n")}\`\`\``
                        }
                    );
                default:
                    channelUpdatedEmbed.addFields(
                        {
                            name: "**Unknown:**",
                            value: `\`\`\`ini\nOld = ${ChannelUpdateLog.changes[i].old}\nNew = ${ChannelUpdateLog.changes[i].new}\`\`\``
                        }
                    );
                    break;
            }
        }

        channelUpdatedEmbed.addFields( {name: "**ID:**", value: `\`\`\`ini\nChannelID = ${oldChannel.id}\nExecutorID = ${ChannelUpdateLog.executor.id}\`\`\``} )
        
        await newChannel.guild.channels.cache.get(LOG_MODS).send({embeds: [channelUpdatedEmbed]})
    }
}