const { SlashCommandBuilder } = require('discord.js');

const Level = require('../../models/level.model');
const levelModel = require('../../models/level.model');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resetlevel')
		.setDescription('Reset level of someone.')
		.addUserOption((option) => option
            .setName('pseudo')
            .setDescription('The member nickname')
            .setRequired(true)),
	async execute(interaction) {
		const pseudo = interaction.options.getUser('pseudo');

        if (levelModel) {
            const levelModel = await Level.findOne({ memberId: pseudo.id });
            
            try { if(levelModel) {
                levelModel.level = 0;
                levelModel.xp = 0;
                levelModel.save();
                interaction.reply({ content: `Level of ${pseudo.username} has been reset to 0`, ephemeral: true });
            }} catch (error) {
                console.log(error);
                interaction.reply({ content: "Player not found", ephemeral: true });
            }
        }
	},
};