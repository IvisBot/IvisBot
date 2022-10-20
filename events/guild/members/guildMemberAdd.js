const Canvas = require('canvas');

const { WELCOME_CHANNEL_ID, MEMBERS_TRACKING, WELCOME_MESSAGES, BOT_LOGO, BOT_TEXTFOOTE, BOT_LINKFOOTER } = require('../../../config.json');
const { AttachmentBuilder, EmbedBuilder } = require("discord.js");
const { registerFont} = require('canvas')

registerFont('fonts/OpenSans-Regular.ttf', { family: 'Open Sans' })
registerFont('fonts/OpenSans-SemiBold.ttf', { family: 'Open Sans Bold' })
var welcomeCanvas = {};
welcomeCanvas.create = Canvas.createCanvas(1024,500);
welcomeCanvas.context = welcomeCanvas.create.getContext('2d')
welcomeCanvas.context.fillStyle = '#ffffff';

Canvas.loadImage('images/welcomeBanner.png').then(async (img) => {
    welcomeCanvas.context.drawImage(img, 0, 0, 1024, 500)
    welcomeCanvas.context.fill()
})

module.exports = {
    name : 'guildMemberAdd',
    async execute(member) {

        let canvas = welcomeCanvas;

        canvas.context.textAlign = 'center';
        canvas.context.font = '48px Open Sans';
        canvas.context.fillText('Welcome', 512, 340);
        canvas.context.font = '60px Open Sans Bold';
        canvas.context.fillText(member.user.tag, 512,415)
        canvas.context.font = '24px Open Sans';
        canvas.context.fillText(`You are the ${member.guild.memberCount}th member of ${member.guild.name}`, 512,470)
        canvas.context.beginPath()
        canvas.context.arc(512,161,119,0, Math.PI * 2, true);
        canvas.context.closePath()
        canvas.context.clip()
        await Canvas.loadImage(member.user.displayAvatarURL({extension : 'png', size :1024, dynamic: true}))
        .then(img => {
            canvas.context.drawImage(img,393,42,238,238)
        })
        
        let atta =  new AttachmentBuilder(canvas.create.toBuffer(), {name: 'welcome.png'})

        if (WELCOME_MESSAGES != {}){
            const keys = Object.keys(WELCOME_MESSAGES);
            const randIndex = Math.floor(Math.random() * keys.length)
            const randKey = keys[randIndex]
            var msg = WELCOME_MESSAGES[randKey]
        }
        else {
            var msg = `Welcome ${user} to ${server} !`;
        }
        
        try { 
            member.guild.channels.cache.get(WELCOME_CHANNEL_ID).send({content : `Welcom ${member.user} on **${member.guild.name}**.\n${msg}`,files: [atta]})
        } catch (error) {
            console.log(error)
        }

        const joinEmbed = new EmbedBuilder()
            .setColor("#00ff00")
            .setDescription(`<@${member.id}> join the server.`)
            .setThumbnail(member.user.avatarURL())
            .addFields(
                {
                    name: "**Username:**",
                    value: `${member.user.username}` + "#" + `${member.user.discriminator}`
                },
                {
                    name: "**Joined the:**",
                    value: `<t:${Math.round((new Date()).getTime() / 1000)}:f>`
                },
                {
                    name: "**Account age:**",
                    value: `**${Math.floor((new Date() - member.user.createdAt) / 86400000)}** days`,
                    inline: true
                },
                {
                    name: "**Member cout:**",
                    value: `${member.guild.memberCount}`,
                    inline: true
                },
                {
                    name: "**ID:**",
                    value: `\`\`\`ini\nMember = ${member.id}\nGuild = ${member.guild.id}\`\`\``
                }
            )
            .setFooter({ text: BOT_TEXTFOOTE, iconURL: BOT_LOGO, url: BOT_LINKFOOTER });

        await member.guild.channels.cache.get(MEMBERS_TRACKING).send({embeds: [joinEmbed]})
	}
}