const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const mongoose = require('mongoose');
const Ticket = require('../../models/ticket.model');
const TicketModel = require('../../models/level.model');

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
                const ticketRandomId = ((Math.floor(Math.random() * (4294967296 - 0)) + 0).toString()).padEnd(10, '0'); 
                const TicketModel = await Ticket.findOne({ ticketId: ticketRandomId });
                if (!TicketModel) {
                    const TicketNewModel = new Ticket({
                        ticketId: ticketRandomId,
                        reason: interaction.fields.getTextInputValue('ticketReasonInput'),
                        description: interaction.fields.getTextInputValue('ticketDescInput')
                    });
                    await TicketNewModel.save();
                } else {
                    await TicketModel.updateOne({
                        reason: interaction.fields.getTextInputValue('ticketReasonInput'),
                        description: interaction.fields.getTextInputValue('ticketDescInput')
                    });
                }
                interaction.reply({ content: "Description added/updated to the ticket.", ephemeral: true });
            }
        }
    }
}