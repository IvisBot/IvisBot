const lib = require('lib')
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poke-fusion')
		.setDescription('Fuse any two Pokemon of the original 151.')
		.addStringOption(option => option.setName('pokemon1').setDescription('The first pokemon').setRequired(true))
		.addStringOption(option => option.setName('pokemon2').setDescription('The second pokemon').setRequired(true)),
		
	async execute({client, interaction}) {

        

        parent1 = interaction.options.getString("pokemon1")
        parent2 = interaction.options.getString("pokemon2")

        try{
        var result = await lib.keith.pokefusion['@0.2.0']({headPokemon: parent1,bodyPokemon: parent2});
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: `One of the pokemon gived in arguments in unkown`, ephemeral: true });
        }

        console.log(result);


        
        
        
        console.log(result.name);

        await interaction.deferReply();
        
        const fusionEmbed = new EmbedBuilder()
			.setTitle(result.name+" is born !")
			.setAuthor({ name: 'Requested by '+interaction.user.tag, iconURL: 'https://i.pinimg.com/originals/2f/80/b2/2f80b2e0e756085d0f0cd931827a31fb.gif' })
			.setColor('#e74c3c')
			.setImage(result.image_url)
            .addFields({name: 'Parents', value: parent1 + ' + ' + parent2})

        await interaction.editReply({ embeds: [fusionEmbed] });
    }
};