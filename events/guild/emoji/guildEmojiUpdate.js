const { LOG_MODS, BOT_LOGO, BOT_TEXTFOOTER} = require('../../../config.json');
const { AuditLogEvent, EmbedBuilder } = require("discord.js");

module.exports = {
    name : 'emojiUpdate',
    description : 'Logs when an emoji is updated.',
    async execute (emoji) {
        const fetchedLogs = await emoji.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.EmojiUpdate,
        });

        const EmojiUpdateLog = fetchedLogs.entries.first();

        const EmojiUpdatedEmbed = new EmbedBuilder()
            .setColor("LightGrey")
            .setDescription(`<@${EmojiUpdateLog.executor.id}> updated an emoji.`)
            .addFields( {name : "Name", value : `\`\`\`ini\nOld_name = ${EmojiUpdateLog.changes[0]['old']}\nNew_name = ${EmojiUpdateLog.changes[0]['new']}\`\`\``} )
            .setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO })
        
        if(emoji.animated) {
            EmojiUpdatedEmbed.setImage(`https://cdn.discordapp.com/emojis/${emoji.id}.gif`);
        } else {
            EmojiUpdatedEmbed.setImage(`https://cdn.discordapp.com/emojis/${emoji.id}.png`);
        }

        await emoji.guild.channels.cache.get(LOG_MODS).send({embeds: [EmojiUpdatedEmbed]});
    }
}