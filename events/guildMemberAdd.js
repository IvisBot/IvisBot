const Canvas = require('canvas');
const Discord = require('discord.js');
const { AttachmentBuilder } = require("discord.js");
const { registerFont} = require('canvas')

registerFont('fonts/DejaVuSansCondensed-Bold.ttf', { family: 'DejaVuSansCondensed-Bold' })
var welcomeCanvas = {};
welcomeCanvas.create = Canvas.createCanvas(1024,500)
welcomeCanvas.context = welcomeCanvas.create.getContext('2d')
welcomeCanvas.context.font = '72px "DejaVuSansCondensed-Bold"';
welcomeCanvas.context.fillStyle = '#ffffff';

Canvas.loadImage('img/bg.jpeg').then(async (img) => {
  welcomeCanvas.context.drawImage(img, 0, 0, 1024, 500)
  welcomeCanvas.context.fillText('welcome', 360, 360);
  welcomeCanvas.context.beginPath();
  welcomeCanvas.context.arc(512,128,0, Math.PI * 2, true);
  welcomeCanvas.context.stroke()
  welcomeCanvas.context.fill()
})

module.exports = {
  name : 'guildMemberAdd',
  async execute(member) {
    console.log("Joined")
    member.guild.channels.cache.get('935858233191579707').send(`${member} has joined the server`);
    
    let canvas = welcomeCanvas;
    canvas.context.font = '42px "DejaVuSansCondensed-Bold"';
    canvas.context.textAlign = 'center';
    canvas.context.fillText(member.user.tag.toUpperCase(), 512,410)
    canvas.context.font = '32px sans serif';
    canvas.context.fillText('You', 512,455)
    canvas.context.beginPath()
    canvas.context.arc(512,166,119,0, Math.PI * 2, true);
    canvas.context.closePath()
    canvas.context.clip()
    await Canvas.loadImage(member.user.displayAvatarURL({format : 'png', size :1024}))
    .then(img => {
      canvas.context.drawImage(img,393,47,238,238)
    })
    
    let atta =  new AttachmentBuilder(canvas.create.toBuffer(), {name: 'welcome.png'})
    try {
      member.guild.channels.cache.get('935858233191579707').send({files: [atta]})
      
    } catch (error) {
      console.log(error)
    }

	}
}
