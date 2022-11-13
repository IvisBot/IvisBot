const { SlashCommandBuilder } = require('discord.js');

const Level = require('../../models/level.model');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addlevel')
        .setDescription('Add level to someone.')
        .addUserOption((option) => option
            .setName('pseudo')
            .setDescription('The member nickname')
            .setRequired(true))
        .addIntegerOption((option) => option
            .setName('amount')
            .setDescription('The amount of level to add')
            .setRequired(true)),
    async execute({ client, interaction }) {
        const pseudo = interaction.options.getUser('pseudo');
        const amount = interaction.options.getInteger('amount');

        const levelModel = await Level.findOne({ memberId: pseudo.id });

        try { if (levelModel) {
            levelModel.level += amount;
            levelModel.save();
            interaction.reply({ content: `Level of ${pseudo.username} has been added by ${amount}`, ephemeral: true });
        }} catch (error) {
            console.log(error);
            interaction.reply({ content: "Player not found", ephemeral: true });
        }
    }
}