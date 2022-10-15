const { WELCOME_CHANNEL_ID } = require('../config.json');
const Canvas = require("canvas");

module.exports = {
    name : 'guildMemberAdd',
    async execute(member) {
		  console.log(`${member.user.tag} join the server.`);

      var canvas = Canvas.createCanvas(1024, 500);

      ctx = canvas.getContext("2d");

      var background = await Canvas.loadImage("./images/welcomeBanner.jpg");
      ctx.drawImage(background, 0, 0, 1024, 500);

      ctx.font = "42px Impact";
      ctx.fillStyle = "#ED4E2C";
      ctx.textAlign = "center";
      ctx.textBaseLine = "bottom";
      ctx.fillText("Welcome " + member.user.tag, 512, 410);

      ctx.beginPath();
      ctx.arc(512, 166, 110, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      var avatar = await Canvas.loadImage(member.user.displayAvatarURL({
          format: "jpg",
          size: 1024
      }));

      ctx.drawImage(avatar, 393, 47, 238, 238);

      var attachment = new Discord.MessageAttachment(canvas.toBuffer(), "welcome.png");

      Client.channels.cache.get(WELCOME_CHANNEL_ID).send({files: [attachment]});
    },
};