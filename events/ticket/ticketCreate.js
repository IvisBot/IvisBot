const { TICKETS_CATEGORY, CLIENT_ID } = require('../../config.json');
const { ActionRowBuilder, SelectMenuBuilder, PermissionsBitField } = require('discord.js');

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
        } else if (interaction.isSelectMenu()) {
            if (interaction.customId === 'ticketCreate') {
                const selected = interaction.values[0];

                if (selected === 'first_option') {
                    interaction.guild.channels.create({
                        name : `ticket-${interaction.user.username}`,
                        parent: TICKETS_CATEGORY,
                        permissionOverwrites: [
                            {
                                id: interaction.guild.roles.everyone,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow: [
                                    PermissionsBitField.Flags.ViewChannel,
                                    PermissionsBitField.Flags.SendMessages,
                                    PermissionsBitField.Flags.AttachFiles,
                                    PermissionsBitField.Flags.AddReactions
                                ],
                            },
                            {
                                id: CLIENT_ID,
                                allow: [
                                    PermissionsBitField.Flags.ViewChannel,
                                    PermissionsBitField.Flags.SendMessages,
                                    PermissionsBitField.Flags.AttachFiles,
                                    PermissionsBitField.Flags.AddReactions,
                                    PermissionsBitField.Flags.ManageChannels,
                                    PermissionsBitField.Flags.ManageMessages
                                ],
                            }
                        ],
                    }).then(async (channel) => {
                        await channel.send({ content: `Hello ${interaction.user}!` });
                    });
                    await interaction.reply({ content: `You selected the [⚜️ role asking] option`, ephemeral: true });
                } else {
                    await interaction.reply({ content: `You selected the [🚩 Report] option`, ephemeral: true });
                }
            }
        }
    }
}