const { CLIENT_ID, BOT_LOGO, BOT_TEXTFOOTER } = require('../../config.json');

module.exports = {
    name : 'interactionCreate',
    async execute(interaction) {
        if (interaction.isButton()) {
            if (interaction.customId === "closeTicket") {
                interaction.reply({ content: "Ticket closed.", ephemeral: true });
                await interaction.channel.delete();
                await interaction.user.send("Your ticket has been closed.");
            }
        }
    }
}