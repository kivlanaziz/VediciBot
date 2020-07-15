const Discord = require('discord.js'); 
const client = new Discord.Client();
const token = GetToken();

client.login(token);

client.on('ready', () => {   
    console.log('VediciBot Reporting!'); 
});

client.on('message', (msg) => {
    if (msg.content.includes('hi vedici')) {
        msg.reply('Hi! :)');
    }
});

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'public');
    
    if (!channel) return;
    channel.send(`Welcome to the server, ${member}`);

    var role = member.guild.roles.cache.find((role => role.name === "Member"));
    member.roles.add(role);
  });

function GetToken(){
    var fs = require("fs");
    var contents = fs.readFileSync("credential.json");
    if (contents != null && contents != "undefined")
    {
        var jsonContent = JSON.parse(contents);
        if (jsonContent.hasOwnProperty('token'))
        {
            console.log('token : '+jsonContent.token);
            return jsonContent.token;
        }
        else
        {
            console.log('JSON File does not have token key');
            return null;
        }
    }
    else
    {
        console.log('Cannot Read JSON File');
        return null;
    }
}