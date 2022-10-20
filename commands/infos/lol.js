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
			.setTitle(profile.data.name+ "'s stats")
			.setThumbnail(`https://ddragon.leagueoflegends.com/cdn/11.16.1/img/profileicon/${profile.data.profileIconId}.png`)
			.setColor('Blue')
			.addFields({name: 'Level', value: profile.data.summonerLevel.toString()},)
			for (var i=0; i<rank.data.length; i++){
				lolAmbed.addFields(
					{name: rank.data[i].queueType, value: rank.data[i].tier+" : "+rank.data[i].rank, inline: true},)}

			lolAmbed.setAuthor({ name: 'Requested by '+interaction.user.id, iconURL: 'https://i.imgur.com/AfFp7pu.png' })
			.setTimestamp()
			.setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO});


		interaction.reply({ embeds: [lolAmbed] });
		
    
	},

};