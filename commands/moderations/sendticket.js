const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { BOT_LOGO, BOT_TEXTFOOTER, TICKET} = require('../../config.json');

module.exports = {
    data : new SlashCommandBuilder ()
        .setName('sendticket')
        .setDescription('Create a ticket for support.'),
    
    async execute({client, interaction}) {
        
        const ticketEmbed = new EmbedBuilder()
            .setColor('Purple')
            .setTitle('Create a ticket')
            .setDescription('Click on the button below to create a ticket.')
            .setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO});
        
        const ticketButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('ticket')
                    .setLabel('Create a ticket')
                    .setStyle(1)
            );
        
        await interaction.reply({ embeds: [ticketEmbed], components: [ticketButton] });     
    }
}