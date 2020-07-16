const Discord = require('discord.js'); 
const client = new Discord.Client();

client.login(process.env.token);

client.on('ready', () => {   
    console.log('VediciBot Reporting!'); 
});

client.on('message', (msg) => {
    if (msg.content.includes('hi vedici')) {
        msg.reply('Hi! :)');
    }
});