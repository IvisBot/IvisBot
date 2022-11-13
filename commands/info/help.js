const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { BOT_LOGO, BOT_TEXTFOOTER} = require('../../config.json');
const { EmbedBuilder } = require('discord.js');
const { type } = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists all available commands')
        .addSubcommand(subcommand =>
            subcommand
                .setName("all")
                .setDescription('Give all the commands')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("category")
                .setDescription('Give the category commands')
                .addStringOption(option => option.setName("category").setDescription("the category").setRequired(true)
                .addChoices(
                    { name: 'Info commands', value: 'info' },
                    { name: 'Level commands', value: 'level' },
                    { name: 'Music commands', value: 'music' },
                    { name: 'Gaming commands', value: 'gaming' },
                    { name: 'Moderation commands', value: 'moderation' },
                ))
        ),

    async execute({ client, interaction }) {
        let str
        let embed = new EmbedBuilder()
        let types = ["info", "level", "music", "gaming", "moderation"]
        let commandFiles = ''

        embed
        .setThumbnail(BOT_LOGO)
        .setAuthor({ name: 'Requested by '+interaction.user.tag, iconURL: interaction.user.avatarURL() })
        .setColor('#9011FF')
        .setTimestamp()
        .setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO});

        if (interaction.options.getSubcommand() === "all") {

            for (const type of types) {
                commandFiles = fs.readdirSync(`./commands/${type}`).filter(file => file.endsWith('.js'));

                str = ""

                for (const file of commandFiles) {
                    const command = require(`../${type}/${file}`);
                    str += `- ${command.data.name} : ${command.data.description}\n`;
                    }

                embed.addFields({name :`${type} commands :`, value : "```ini\n"+str+"```", inline: false});
            }
        }

        else if (interaction.options.getSubcommand() === "category") {
            let category = interaction.options.getString("category")
            commandFiles = fs.readdirSync(`./commands/${category}`).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const command = require(`../${category}/${file}`);
                str += `- ${command.data.name} : ${command.data.description}\n`;
                }

            embed.addFields({name :`${category} commands :`, value : "```ini\n"+str+"```", inline: false});
        }

        await interaction.reply({embeds: [embed], ephemeral: false});
    },
};