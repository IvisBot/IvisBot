const { BOT_LOGO, BOT_TEXTFOOTER} = require('../../config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song')
        .addSubcommand(subcommand =>
            subcommand
                .setName("search")
                .setDescription('Search a song')
                .addStringOption(option => option.setName("searchterms").setDescription("search keywords").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("playlist")
                .setDescription('Play a playlist')
                .addStringOption(option => option.setName("url").setDescription("the playlist's url").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("song")
                .setDescription('Play a song from a url')
                .addStringOption(option => option.setName("url").setDescription("the song's url").setRequired(true))
        ),

    async execute({ client, interaction }) {

        if (!interaction.member.voice.channel) return interaction.reply({content: `You're not in a voice channel!`, ephemeral: true});

        const queue = await client.player.createQueue(interaction.guild);

        if (!queue.connection) await queue.connect(interaction.member.voice.channel);

        let embed = new EmbedBuilder()

        if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString('url');

            const result  = await client.player.search( url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO,
            });

            if(result.tracks.length === 0) {
                await interaction.reply({content: 'No results found!', ephemeral: true});
                return;
            };

            const song = result.tracks[0];

            console.log(song);
            
            await queue.addTrack(song);
            
            if(!queue.playing) await queue.play();

            embed
                .setDescription(`${song.title} \`${song.duration}\` - <@${song.requestedBy.id}>`)
                .setThumbnail(song.thumbnail)
                .addFields({name: 'Duration :', value : `\`${song.duration}\``, inline: true})
                .setAuthor({ name: 'Added by '+interaction.user.tag, iconURL: interaction.user.avatarURL() })
                .setColor('#9011FF')
                .setTimestamp()
			    .setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO});
            
        } else if (interaction.options.getSubcommand() === 'playlist') {
            let url = interaction.options.getString('url');

            const result  = await client.player.search( url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST,
            });

            if(result.tracks.length === 0) {
                await interaction.reply({content: 'No playlist found!', ephemeral: true});
                return;
            };

            const playlist = result.playlist;
            await queue.addTracks(result.tracks)

            embed
                .setDescription(`${playlist.title} \`${playlist.duration}\` - <@${playlist.requestedBy.id}>`)
                .setThumbnail(`${playlist.thumbnail}.jpg`)
                .setAuthor({ name: 'Added by '+interaction.user.tag, iconURL: interaction.user.avatarURL() })
                .setColor('#9011FF')
                .setTimestamp()
			    .setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO});
            
        } else if (interaction.options.getSubcommand() === 'search') {
            let url = interaction.options.getString('searchterms');

            const result  = await client.player.search( url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            });

            if(result.tracks.length === 0) {
                return interaction.reply({content: 'No results found!', ephemeral: true});
            };

            const song = result.tracks[0];
            await queue.addTrack(song);
            
            if(!queue.playing) await queue.play();

            embed
                .setDescription(`${song.title} \`${song.duration}\` - <@${song.requestedBy.id}>`)
                .setThumbnail(song.thumbnail)
                .setAuthor({ name: 'Added by '+interaction.user.tag, iconURL: interaction.user.avatarURL() })
                .setColor('#9011FF')
                .setTimestamp()
			    .setFooter({ text: BOT_TEXTFOOTER, iconURL: BOT_LOGO});
            
        }

        if(!queue.playing) await queue.play();

        await interaction.reply({embeds: [embed]});
        
    },
};