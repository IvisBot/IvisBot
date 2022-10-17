const mongoose = require('mongoose');
const Level = require('../models/level.model');
const { CLIENT_ID } = require('../config.json');

module.exports = {
    name: 'messageCreate',
    async execute(msg) {

        if (msg.author.id != CLIENT_ID) {
            const levelModel = await Level.findOne({ memberId: msg.author.id });

            if(levelModel) {
                levelModel.xp += Math.floor(Math.random() * (50 - 30)) + 30;
                levelModel.messageCount++;

                if(levelModel.xp == levelModel.level * 320) {
                    levelModel.xp = 0;
                    levelModel.level++;
                    levelModel.save();
                    msg.reply("Level up > " + levelModel.level);
                }

                levelModel.save();
            } else {
                console.log("New user detected in the database");

                const levelM = await new Level({ memberId: msg.author.id });
                levelM.save();

                msg.reply("Welcome to the server, you start at the level 1, you can now start chatting to gain xp");
            }
        }
    }
}