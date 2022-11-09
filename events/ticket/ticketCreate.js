const { TICKET } = require('../../config.json');
const { ActionRowBuilder, SelectMenuBuilder} = require('discord.js');

module.exports = {
    name : 'interactionCreate',
    async execute(interaction) {
	    if (interaction.isButton()) {
            if (interaction.customId === 'ticket') {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new SelectMenuBuilder()
                            .setCustomId('ticketCreate')
                            .setPlaceholder('Select the reason of your ticket')
                            .addOptions(
                                {
                                    label: '⚜️ role asking',
                                    description: 'Select this if you are asking for a role',
                                    value: 'first_option',
                                },
                                {
                                    label: '🚩 Report',
                                    description: 'Select this if you want to report a user',
                                    value: 'second_option',
                                }
                            )
                    );
                
                await interaction.reply({ ephemeral: true, components: [row] });
            }
        }
    }
}