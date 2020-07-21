
// --- Dependency --- //
const Discord = require('discord.js');
const ytdl = require("ytdl-core-discord");
const { connect } = require('http2');
// ------------------ //

const client = new Discord.Client();
const PREFIX = '-';

const queue = new Map();

client.on('ready', () => {
    console.log('VediciBot Reporting!');
});

client.on('message', (msg) => {
    if (msg.content.includes('hi vedici')) {
        msg.reply('Hi! :)');
    }

    let args = msg.content.substring(PREFIX.length).split(" ");
    const serverQueue = queue.get(msg.guild.id);

    switch (args[0]) {
        case 'start':
            execute(msg, serverQueue);
            break;

        case 'skip':
            skip(msg, serverQueue);
            break;

        case 'stop':
            stop(msg, serverQueue);
            break;

        case 'queue':
            showQueue(msg, serverQueue);
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

async function execute(message, serverQueue) {
    const args = message.content.split(" ");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
        return message.channel.send(
            "You need to be in a voice channel to play music!"
        );
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
            "I need the permissions to join and speak in your voice channel!"
        );
    }

    const songInfo = await ytdl.getInfo(args[1]);
    const song = {
        title: songInfo.title,
        url: songInfo.video_url,
    };

    if (!serverQueue) {
        // Creating the contract for our queue
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };
        // Setting the queue using our contract
        queue.set(message.guild.id, queueContruct);
        // Pushing the song to our songs array
        queueContruct.songs.push(song);

        try {
            // Here we try to join the voicechat and save our connection into our object.
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            // Calling the play function to start a song
            play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            // Printing the error message if the bot fails to join the voicechat
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        return message.channel.send(`${song.title} has been added to the queue!`);
    }
}

async function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    const dispatcher = serverQueue.connection
        .play(await ytdl(song.url, {
            highWaterMark: 1024 * 1024 * 15
        }),{
            type: 'opus',
            highWaterMark: 50
        })
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

function skip(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
    if (!serverQueue)
        return message.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function showQueue(message, serverQueue) {
    var list = [];
    if (!serverQueue)
        return message.channel.send("Queue is Empty!");

    serverQueue.songs.forEach(song => {
        console.log(song.title);
        list.push({
            name: song.title,
            value: song.url
        });
    });

    const embedList = {
        color: 0x0099ff,
        title: 'Vedici Live Music Queue',
        author: {
            name: message.member.user.username
        },
        fields: list,
        timestamp: new Date(),
        footer: {
            text: 'Vedici Bot',
        },
    };
    console.log(embedList);
    return message.channel.send({ embed: embedList });
}

client.login(process.env.token);
