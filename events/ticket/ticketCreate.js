const { TICKETS_CATEGORY, CLIENT_ID, BOT_LOGO, BOT_TEXTFOOTER } = require('../../config.json');
const { SelectMenuBuilder, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

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
                    }).then((channel) => {
                        const newTicketEmbed = new EmbedBuilder()
                            .setTitle('Ticket created')
                            .setDescription(`Your ticket has been created, please wait for a staff member to answer you.
                            Describe your problem as much as possible.
                            You can close the ticket by clicking on the button below. 
                            \n**__Ticket information__** \n**User :** ${interaction.user.username}
                            **Reason :** role asking
                            **Channel :** <#${channel.id}>`)
                            .setColor('Purple')
                            .setThumbnail(interaction.user.avatarURL())
                            .setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO});
                            
                        const newTicketButton = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('closeTicket')
                                    .setLabel('Close the ticket')
                                    .setStyle(4)
                            );
                        
                        interaction.guild.channels.cache.get(channel.id).send({ embeds: [newTicketEmbed], components: [newTicketButton] });
                        interaction.reply({ content: `You have selected the [⚜️ Role asking] option`, ephemeral: true });
                    });
                } else {
                    await interaction.reply({ content: `You have selected the [🚩 Report] option`, ephemeral: true });
                }
            }
        }
    }
}