const TeemoJS = require('teemojs');
let api = TeemoJS('RGAPI-a8cd5405-9458-49eb-9088-9f4061b36fbb');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lol')
		.setDescription('Give league of legends informations about a player.')
		.addStringOption(option => option.setName('player').setDescription('The player nickname').setRequired(true)),
	async execute(interaction) {
      
        var sumonerName;
        api.get('euw1', 'summoner.getBySummonerName', interaction.options.getString('player'))
            .then((data) => {
                try { interaction.reply({ content: data["name"]});
                } catch (error) { 
                    console.log(error); 
                    interaction.reply({ content:"Player not found", ephemeral: true});}
            })

        
        /*
		const avatarEmbed = new EmbedBuilder()
			.setColor('Purple')
			.setTitle(username)
			.setURL(avatar)
			.setAuthor({ name: 'Ivis', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
			.setImage(avatar)
			.setTimestamp()
			.setFooter({ text: 'IvisBot, A fully modular Discord Bot', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
		
		interaction.reply({ embeds: [avatarEmbed] });
        */
	},

};