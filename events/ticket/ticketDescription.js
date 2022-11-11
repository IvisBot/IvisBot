const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const mongoose = require('mongoose');
const Ticket = require('../../models/ticket.model');
const { BOT_LOGO, BOT_TEXTFOOTER } = require('../../config.json');

module.exports = {
    name : 'interactionCreate',
    async execute(interaction) {
        if (interaction.isButton()) {
            if (interaction.customId === 'addDescription') {
                const ticketDescModal = new ModalBuilder()
                    .setCustomId('ticketDescModal')
                    .setTitle('Description of the ticket');
                
                const ticketReasonInput = new TextInputBuilder()
                    .setCustomId('ticketReasonInput')
                    .setLabel('Reason of the ticket')
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);
                
                const ticketDescInput = new TextInputBuilder()
                    .setCustomId('ticketDescInput')
                    .setLabel('Description of the ticket')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);
                
                const firstActionRow = new ActionRowBuilder().addComponents(ticketReasonInput);
                const secondActionRow = new ActionRowBuilder().addComponents(ticketDescInput);

                ticketDescModal.addComponents(firstActionRow, secondActionRow);

                await interaction.showModal(ticketDescModal);
            }
        }
        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'ticketDescModal') {
                const TicketModel = await Ticket.findOne({ ticketId: interaction.channel.id });
                if (!TicketModel) {
                    const TicketNewModel = new Ticket({
                        ticketId: interaction.channel.id,
                        reason: interaction.fields.getTextInputValue('ticketReasonInput'),
                        description: interaction.fields.getTextInputValue('ticketDescInput')
                    });
                    await TicketNewModel.save();

                    const ticketDescEmbed = new EmbedBuilder()
                        .setColor('Purple')
                        .setTitle('Ticket description')
                        .setDescription(`Your ticket has been created with the following description: \n\n**Reason:** ${interaction.fields.getTextInputValue('ticketReasonInput')} \n**Description:** ${interaction.fields.getTextInputValue('ticketDescInput')}`)
                        .setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO});
                    
                    await interaction.reply({ embeds: [ticketDescEmbed] });
                } else {
                    await TicketModel.updateOne({
                        reason: interaction.fields.getTextInputValue('ticketReasonInput'),
                        description: interaction.fields.getTextInputValue('ticketDescInput')
                    });

                    const ticketDescEmbed = new EmbedBuilder()
                        .setColor('Purple')
                        .setTitle('Ticket description')
                        .setDescription(`Your description has been updated with the following description: \n\n**Reason:** ${interaction.fields.getTextInputValue('ticketReasonInput')} \n**Description:** ${interaction.fields.getTextInputValue('ticketDescInput')}`)
                        .setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO});
                    
                        const messages = await interaction.channel.messages.fetch();
                        const lastMessage = messages.first();

                        lastMessage.edit({ embeds: [ticketDescEmbed] });
                        interaction.deferUpdate();
                }
            }
        }
    }
}