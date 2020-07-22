
// --- Dependency --- //
const Discord = require('discord.js');
const { connect } = require('http2');
const youtube = require("./module/youtube.js");
// ------------------ //

const client = new Discord.Client();
const PREFIX = '-';

const queue = new Map();

client.on('ready', () => {
    console.log('VediciBot Reporting!');
    client.user.setActivity('-help')
});

client.on('message', (msg) => {
    if (msg.content.includes('hi vedici')) {
        msg.reply('Hi! :)');
    }
    if (msg.content[0] != PREFIX){
        return;
    }
    let args = msg.content.substring(PREFIX.length).split(" ");
    const serverQueue = queue.get(msg.guild.id);

    switch (args[0]) {
        case 'help' :
            help(msg);
            break;
        case 'play':
            youtube.execute(msg, serverQueue, queue);
            break;

        case 'skip':
            youtube.skip(msg, serverQueue);
            break;

        case 'stop':
            youtube.stop(msg, serverQueue);
            break;

        case 'queue':
            youtube.showQueue(msg, serverQueue);
            break;
    }

});

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'public');

    if (!channel) return;
    channel.send(`Welcome to the server, ${member}`);

    var role = member.guild.roles.cache.find((role => role.name === "Member"));
    member.roles.add(role);
});

function help (message){
    var helpMessage = [];
    //Play message
    helpMessage.push({
        name: PREFIX + "play -youtubeURL",
        value: "Play an audio from youtube URL"
    })
    //Skip message
    helpMessage.push({
        name: PREFIX + "skip",
        value: "Skip the current audio"
    })
    //Stop message
    helpMessage.push({
        name: PREFIX + "stop",
        value: "Stop the current audio & clear the queue"
    })
    //ShowQueue message
    helpMessage.push({
        name: PREFIX + "queue",
        value: "Show the audio queue"
    })
    const embedList = {
        color: 0x04d9c4,
        title: 'Vedici Help Center',
        author: {
            name: "Hi " + message.member.user.username
        },
        fields: helpMessage,
        timestamp: new Date(),
        footer: {
            text: 'Vedici Bot',
        },
    };
    console.log(embedList);
    return message.channel.send({ embed: embedList });
}

client.login(process.env.token);
