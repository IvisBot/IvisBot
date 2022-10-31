const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pauses the current song"),
	async execute ({ client, interaction }) {
		const queue = client.player.getQueue(interaction.guildId)

		if (!queue)
		{
			await interaction.reply("There are no songs in the queue")
			return;
		}

		queue.setPaused(true);

        await interaction.reply("Player has been paused.")
	},
}