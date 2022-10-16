const Canvas = require('canvas');
const Discord = require('discord.js');
const config = require('../config.json');
const { AttachmentBuilder } = require("discord.js");
const { registerFont} = require('canvas')

registerFont('fonts/OpenSans-Regular.ttf', { family: 'Open Sans' })
registerFont('fonts/OpenSans-SemiBold.ttf', { family: 'Open Sans Bold' })
var welcomeCanvas = {};
welcomeCanvas.create = Canvas.createCanvas(1024,500);
welcomeCanvas.context = welcomeCanvas.create.getContext('2d')
welcomeCanvas.context.fillStyle = '#ffffff';

Canvas.loadImage('img/bg.png').then(async (img) => {
  welcomeCanvas.context.drawImage(img, 0, 0, 1024, 500)
  welcomeCanvas.context.fill()
})

module.exports = {
  name : 'guildMemberAdd',
  async execute(member) {

    let canvas = welcomeCanvas;

    canvas.context.textAlign = 'center';
    canvas.context.font = '48px Open Sans';
    canvas.context.fillText('Bienvenue', 512, 340);
    canvas.context.font = '60px Open Sans Bold';
    canvas.context.fillText(member.user.tag, 512,415)
    canvas.context.font = '24px Open Sans';
    canvas.context.fillText(`Tu es le ${member.guild.memberCount}e membre de ${member.guild.name}`, 512,470)
    canvas.context.beginPath()
    canvas.context.arc(512,161,119,0, Math.PI * 2, true);
    canvas.context.closePath()
    canvas.context.clip()
    await Canvas.loadImage(member.user.displayAvatarURL({extension : 'png', size :1024, dynamic: true}))
    .then(img => {
      canvas.context.drawImage(img,393,42,238,238)
    })
    
    let atta =  new AttachmentBuilder(canvas.create.toBuffer(), {name: 'welcome.png'})
    messages = config["welcome-messages"]
    const keys = Object.keys(messages);
    const randIndex = Math.floor(Math.random() * keys.length)
    const randKey = keys[randIndex]
    const msg = messages[randKey]

    try { 
      member.guild.channels.cache.get('935858233191579707').send({content : `Bienvenue ${member.user} sur **${member.guild.name}**. ${msg}`,files: [atta]})
      
    } catch (error) {
      console.log(error)
    }

	}
}
