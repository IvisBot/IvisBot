const { RIOT_API, BOT_LOGO, BOT_TEXTFOOTER} = require('../../config.json');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('lol')
		.setDescription('Give league of legends informations about a player.')
		.addStringOption(option => option.setName('player').setDescription('The player nickname').setRequired(true))
		.addStringOption(option => option.setName('region').setDescription('The region').setRequired(false)),
	async execute(interaction) {

		var player = interaction.options.getString('player');
		var region = interaction.options.getString('region');
		if (region == null) {
			region = 'euw1';
		}

		try {
			var profile = await axios.get(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${player}?api_key=${RIOT_API}`);
		}
		catch (error) {
			console.error(error);
			return interaction.reply({ content: `No player nammed ${player} on ${region}`, ephemeral: true });
		}
		
		const masteries = await axios.get(`https://${region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${profile.data.id}?api_key=${RIOT_API}`);
		const rank = await axios.get(`https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${profile.data.id}?api_key=${RIOT_API}`);
		const bestMasteries = masteries.data.slice(0,3);

		const lolAmbed = new EmbedBuilder()
			.setTitle("🧙 "+profile.data.name+ "'s stats")
			.setAuthor({ name: 'Requested by '+interaction.user.tag, iconURL: 'https://developer.riotgames.com/static/img/katarina.55a01cf0560a.gif' })
			.setThumbnail(`https://ddragon.leagueoflegends.com/cdn/11.16.1/img/profileicon/${profile.data.profileIconId}.png`)
			.setColor('#a80016')
			.setImage('https://www.dracik.sk/galeria/1_354103/puzzle-1000-panorama-league-of-legends-original.jpg')
			.addFields({name: 'Level', value: profile.data.summonerLevel.toString(), inline: true},
			{name: 'Region', value: region.toUpperCase(), inline: true},
			{name: '\u200B', value: '**⚔️ Ranked stats**'})
			for (var i=0; i<rank.data.length; i++){
				lolAmbed.addFields(
					{name: rank.data[i].queueType.substring(0, 11), value: rank.data[i].tier+" : "+rank.data[i].rank +` (${rank.data[i].leaguePoints} LP)`, inline: true},)}

			lolAmbed.addFields({name: '\u200B', value: "**⭐ Most played champs**", inline: false})
			
			for (var i=0; i<bestMasteries.length; i++){

				const req = await axios.get('http://ddragon.leagueoflegends.com/cdn/12.20.1/data/en_US/champion.json');
				const championList = req.data.data;
				
				for (var j in championList) {
					if (championList[j].key == bestMasteries[i].championId) {
						var champName = championList[j].id
						break;
					}
				}

				lolAmbed.addFields({name: champName + ` (${bestMasteries[i].championLevel.toString()})`, value: `MP : ${bestMasteries[i].championPoints.toString()}`, inline: true})}

			lolAmbed.setTimestamp()
			.setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO});


		interaction.reply({ embeds: [lolAmbed] });
		
	},

};