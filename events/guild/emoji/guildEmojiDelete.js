const { LOG_MODS, BOT_LOGO, BOT_TEXTFOOTER} = require('../../../config.json');
const { AuditLogEvent, EmbedBuilder } = require("discord.js");

module.exports = {
    name : 'emojiDelete',
    description : 'Logs when an emoji is deleted.',
    async execute (emoji) {
        const fetchedLogs = await emoji.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.EmojiDelete,
        });

        const EmojiDeleteLog = fetchedLogs.entries.first();

        const EmojiDeletedEmbed = new EmbedBuilder()
            .setColor("LightGrey")
            .setDescription(`<@${EmojiDeleteLog.executor.id}> deleted an emoji.`)
            .setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO })
        
        if(emoji.animated) {
            EmojiDeletedEmbed.setImage(`https://cdn.discordapp.com/emojis/${emoji.id}.gif`);
        } else {
            EmojiDeletedEmbed.setImage(`https://cdn.discordapp.com/emojis/${emoji.id}.png`);
        }

        await emoji.guild.channels.cache.get(LOG_MODS).send({embeds: [EmojiDeletedEmbed]});
    }
}