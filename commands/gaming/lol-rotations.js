const { RIOT_API } = require('../../config.json');
const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lol-rotations')
		.setDescription('Gives the names of the champions currently in rotation.'),

	async execute({client, interaction}) {

        await interaction.deferReply();
		
		const champions = await ( await fetch('http://ddragon.leagueoflegends.com/cdn/12.20.1/data/en_US/champion.json')).json();
		const rotations = await ( await fetch(`https://euw1.api.riotgames.com/lol/platform/v3/champion-rotations?api_key=${RIOT_API}`)).json();

		const place = [[10,10], [210,10], [410,10], [610,10], 
					   [10,210], [210,210], [410,210], [610,210],
					   [10,410], [210,410], [410,410], [610,410], 
					   [10,610], [210,610], [410,610], [610,610],]; 

		var placec = 0
        
		const canvas = Canvas.createCanvas(800, 800);
        const context = canvas.getContext('2d');

	    const background = await Canvas.loadImage('./images/rotation_bg.png');
		context.drawImage(background, 0, 0, canvas.width, canvas.height);

		for (const [key, value] of Object.entries(champions.data)) {
			if ((rotations.freeChampionIds).includes(parseInt(value.key))) {
				const champion = await Canvas.loadImage(`https://ddragon.leagueoflegends.com/cdn/12.4.1/img/champion/${key}.png`);
				context.drawImage(champion, place[placec][0], place[placec][1], 180, 180);
				placec += 1;
				console.log("added : "+key);
			}
		}

		const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'profile-image.png' });

        await interaction.editReply({ content: '🔄 Champions in rotation :', files: [attachment] });
	},

};