const { RIOT_API, BOT_LOGO, BOT_TEXTFOOTER} = require('../../config.json');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
var request = require('request');


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
		const bestMasteries = masteries.data.slice(0,3);
		console.log(bestMasteries);

		const lolAmbed = new EmbedBuilder()
			.setTitle(profile.data.name+ "'s stats")
			.setAuthor({ name: 'Requested by '+interaction.user.tag, iconURL: 'https://developer.riotgames.com/static/img/katarina.55a01cf0560a.gif' })
			.setThumbnail(`https://ddragon.leagueoflegends.com/cdn/11.16.1/img/profileicon/${profile.data.profileIconId}.png`)
			.setColor('#a80016')
			.addFields({name: 'Level', value: profile.data.summonerLevel.toString()},)
			for (var i=0; i<rank.data.length; i++){
				lolAmbed.addFields(
					{name: rank.data[i].queueType, value: rank.data[i].tier+" : "+rank.data[i].rank, inline: true},)}

			lolAmbed.addFields({name: 'Most Played Champs', value: profile.data.summonerLevel.toString(), inline: false})
			
			for (var i=0; i<bestMasteries.length; i++){
				var champName = await getChampName(bestMasteries[i].championId);
				lolAmbed.addFields({name: champName, value: profile.data.summonerLevel.toString(), inline: false})}

			lolAmbed.setTimestamp()
			.setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO});


		interaction.reply({ embeds: [lolAmbed] });
		
		async function getChampName(id) {
			request('http://ddragon.leagueoflegends.com/cdn/11.16.1/data/de_DE/champion.json', function (error, response, body) {
		  
			  let list = JSON.parse(body);
			  let championList = list.data;
		  
			  for (var i in championList) {
		  
				if (championList[i].key == id) {
					console.log(championList[i].id);
				  	return championList[i].id
				}
		  
			  }
		  
			});
		}
	},

};