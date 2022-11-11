const { TICKETS_CATEGORY, CLIENT_ID, BOT_LOGO, BOT_TEXTFOOTER } = require('../../config.json');
const { SelectMenuBuilder, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    name : 'interactionCreate',
    async execute(interaction) {
	    if (interaction.isButton()) {
            if (interaction.customId === 'ticket') {
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
                        .setTitle('🎫 Ticket created')
                        .setDescription(`Your ticket has been created, please wait for a staff member to answer you.
                        Describe your problem as much as possible by clicking on the button below.
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
                        ).addComponents(
                            new ButtonBuilder()
                                .setCustomId('addDescription')
                                .setLabel('Add a description to the ticket')
                                .setStyle(1)
                        )
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('openTicket')
                                .setLabel('Open the ticket')
                                .setStyle(3)
                        );
                    
                    interaction.guild.channels.cache.get(channel.id).send({ embeds: [newTicketEmbed], components: [newTicketButton] });
                    interaction.reply({ content: `🎫 Your ticket has been created.`, ephemeral: true });
                });
            }
        }
    }
}