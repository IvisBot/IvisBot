module.exports = {
    name : 'interactionCreate',
    async execute(interaction) {
        if (interaction.isButton()) {
            if (interaction.customId === "closeTicket") {
                if (interaction.member.roles.cache.has("MODS_ID")) {
                    interaction.reply({ content: "Ticket closed.", ephemeral: true });
                    await interaction.channel.delete();
                    await interaction.user.send("Your ticket has been closed.");
                } else {
                    interaction.reply({ content: "You don't have permission to do that.", ephemeral: true });
                }
            }
        }
    }
}