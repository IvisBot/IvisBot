const { EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const Level = require('../../models/level.model');
const { CLIENT_ID, XP_COOLDOWN, BOT_LOGO, BOT_TEXTFOOTE, BOT_LINKFOOTER } = require('../../config.json');

const {CommandCooldown, msToMinutes} = require('discord-command-cooldown');
const ms = require('ms');
const levelModel = require('../../models/level.model');

const earnXpCooldown = new CommandCooldown('earnXp', ms(XP_COOLDOWN));

module.exports = {
    name: 'messageCreate',
    async execute(msg) {

        if (levelModel) levelModel.messageCount++;

        const userCooldowned = await earnXpCooldown.getUser(msg.author.id);

        if(!userCooldowned) {
            if (msg.author.id != CLIENT_ID) {
                const levelModel = await Level.findOne({ memberId: msg.author.id });

                if(levelModel) {
                    levelModel.xp += Math.floor(Math.random() * (25 - 15)) + 15;

                    if (levelModel.level != 0) condition = Math.floor((100 + (levelModel.level-1) * 20) ** 2 / (100 + levelModel.level));
                    else condition = 100;

                    if(levelModel.xp >= condition) {
                        levelModel.xp %= condition;
                        levelModel.level++;
                        await levelModel.save();

                        const levelUpEmbed = new EmbedBuilder()
                            .setColor('CYAN')
                            .setTitle('Level Up!')
                            .setDescription(`Congratulations ${msg.author.username}, you have leveled up to level ${levelModel.level}!`)
                            .setThumbnail(msg.author.avatarURL())
                            .setTimestamp()
                            .setFooter({ text: BOT_TEXTFOOTE, iconURL: BOT_LOGO, url: BOT_LINKFOOTER });

                        msg.reply({ embeds: [levelUpEmbed] });
                    }
                    await levelModel.save();
                } else {
                    console.log("New user detected in the database");

                    const levelM = await new Level({ memberId: msg.author.id });
                    await levelM.save();

                    msg.reply("Welcome to the server, you start at the level 1, you can now start chatting to gain xp");
                }
            }
            await earnXpCooldown.addUser(msg.author.id);
        }
    }
}