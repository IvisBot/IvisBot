const { LOG_MODS, BOT_LOGO, BOT_TEXTFOOTER} = require('../../../config.json');
const { AuditLogEvent, EmbedBuilder } = require("discord.js");

module.exports = {
    name : 'emojiCreate',
    description : 'Logs when an emoji is created.',
    async execute (emoji) {
        const fetchedLogs = await emoji.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.EmojiCreate,
        });

        const EmojiCreateLog = fetchedLogs.entries.first();

        const EmojiCreatedEmbed = new EmbedBuilder()
            .setColor("LightGrey")
            .setDescription(`<@${EmojiCreateLog.executor.id}> created an emoji.`)
            .setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO })
        
        if(emoji.animated) {
            EmojiCreatedEmbed.setImage(`https://cdn.discordapp.com/emojis/${emoji.id}.gif`);
        } else {
            EmojiCreatedEmbed.setImage(`https://cdn.discordapp.com/emojis/${emoji.id}.png`);
        }

        await emoji.guild.channels.cache.get(LOG_MODS).send({embeds: [EmojiCreatedEmbed]});
    }
}