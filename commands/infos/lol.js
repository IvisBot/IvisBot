const { RIOT_API } = require('../../config.json');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('lol')
		.setDescription('Give league of legends informations about a player.')
		.addStringOption(option => option.setName('player').setDescription('The player nickname').setRequired(true)),
	async execute(interaction) {

		const profile = await axios.get(`https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${interaction.options.getString('player')}?api_key=${RIOT_API}`);
		const masteries = await axios.get(`https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${profile.data.id}?api_key=${RIOT_API}`);
		
		const rank = await axios.get(`https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${profile.data.id}?api_key=${RIOT_API}`);

		console.log(profile.data);
		console.log(masteries.data[0,3]);

		console.log(profile.data.summonerLevel);
		const lolAmbed = new EmbedBuilder()
			.setTitle(profile.data.name)
			.setThumbnail(`https://ddragon.leagueoflegends.com/cdn/11.16.1/img/profileicon/${profile.data.profileIconId}.png`)
			.setColor('Blue')
			.addFields(
				{name: 'Level', value: "sdf"},
				)
			.setAuthor({ name: 'Ivis', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
			.setTimestamp()
			.setFooter({ text: 'IvisBot, A fully modular Discord Bot', iconURL: 'https://i.imgur.com/AfFp7pu.png' })


		interaction.reply({ embeds: [lolAmbed] });
		
    
	},

};