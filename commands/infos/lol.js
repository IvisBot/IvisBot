const { RIOT_API, BOT_LOGO, BOT_TEXTFOOTER, BOT_LINKFOOTER } = require('../../config.json');
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
		console.log(rank.data)
		console.log(masteries.data.slice(0,3));
		console.log(profile.data.summonerLevel.toString());

		const lolAmbed = new EmbedBuilder()
			.setTitle(profile.data.name)
			.setThumbnail(`https://ddragon.leagueoflegends.com/cdn/11.16.1/img/profileicon/${profile.data.profileIconId}.png`)
			.setColor('Blue')
			.addFields(
				{name: 'Level', value: profile.data.summonerLevel.toString()},
				//{name: 'Rank Solo/Duo Q', value: rank.data[0].tier+" : "+rank.data[0].rank , inline: true},
				//{name: 'Rank Flex Q', value: rank.data[1].tier+" : "+rank.data[1].rank, inline: true},
				)
			for (r in rank.data.length) {
				console.log(r);
				lolAmbed.addFields(
					{name: rank.data[r].queueType, value: rank.data[r].tier+" : "+rank.data[r].rank, inline: true},)}
			lolAmbed.setAuthor({ name: 'Ivis', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
			.setTimestamp()
			.setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO, url: BOT_LINKFOOTER });


		interaction.reply({ embeds: [lolAmbed] });
		
    
	},

};