const Discord = require('discord.js');
var util = require("../utility/canvasutil");

async function execute(member){
    const canvas = await util.generateWelcomeCanvas(member);
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

    const channel = member.guild.channels.cache.find(ch => ch.name === 'public');
    
    if (channel)
    channel.send(`Hi ${member} 😃`, attachment);
    
}

module.exports={
    name: "welcomemessage",
    description: "Send Welcome Message to the specified member",
    execute: execute,
};