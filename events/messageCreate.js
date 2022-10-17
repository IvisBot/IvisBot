const mongoose = require('mongoose');
const Level = require('../models/level.model');

module.exports = {
    name: 'messageCreate',
    async execute(msg) {
        const levelModel = await Level.findOne({ memberId: msg.author.id });

        if(levelModel) {
            levelModel.xp++;

            if(levelModel.xp == 10) {
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
        }
    }
}