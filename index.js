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

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'public');

    if (!channel) return;
    channel.send(`Welcome to the server, ${member}`);

    var role = member.guild.roles.cache.find((role => role.name === "Member"));
    member.roles.add(role);
});
