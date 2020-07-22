// --- Dependency --- //
const ytdl = require("ytdl-core-discord");
const validUrl = require("valid-url");
const { connect } = require('http2');
const { google } = require('googleapis');
const { youtube } = require("googleapis/build/src/apis/youtube");
// ------------------ //

async function execute(message, serverQueue, queue) {
    const args = message.content.split(" ");
    if (typeof args[1] === 'undefined')
        return message.channel.send(
            "You need to provide the url of the song"
        );
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

    if (validUrl.isUri(args[1])){
        var youtubeUrl = args[1];
    }
    else{
        var i;
        var queryString = "";
        for (i = 1; i < args.length; i++ ){
            queryString += args[i] + " ";
        }
        try{
            var searchResult = await getYoutubeSearch(queryString);
            
            var videoId = searchResult.data.items[0].id.videoId;
            
            if (typeof videoId === 'undefined'){
                return message.channel.send(
                    "Cannot find the video"
                );
            }
            else{
                var youtubeUrl = 'https://www.youtube.com/watch?v='+videoId;
                console.log(youtubeUrl);
                songInfo = await ytdl.getInfo(youtubeUrl);
            }
        }
        catch(err){
            console.log(err);
        }
    }
    songInfo = await ytdl.getInfo(youtubeUrl);
    console.log(songInfo);
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
            play(message.guild, queueContruct.songs[0], queue);
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

async function play(guild, song, queue) {
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
            play(guild, serverQueue.songs[0], queue);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

function skip(message, serverQueue) {
    const args = message.content.split(" ");
    console.log(args[1]);
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
    if (!serverQueue)
        return message.channel.send("There is no song that I could skip!");
    
    if (typeof args[1] === 'undefined'){
        serverQueue.connection.dispatcher.end();
    }
    else{
        if (serverQueue.songs[args[1] - 1] !== 'undefined'){
            serverQueue.songs.splice(args[1] - 1,1);
        }
        else{
            return message.channel.send("There is no queued song at index " + args[1]);
        }
    }
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
    var index = 0;
    if (!serverQueue)
        return message.channel.send("Queue is Empty!");

    serverQueue.songs.forEach(song => {
        console.log(song.title);
        index++;
        if (index == 1){
            list.push({
                name: "[" + index +"] " + song.title + " (Playing)",
                value: song.url
            });
        }
        else{
            list.push({
                name: "[" + index +"] " + song.title,
                value: song.url
            });
        }
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

async function getYoutubeSearch(queryString){
    console.log('querying: ' + queryString);
    return google.youtube('v3').search.list({
        key: process.env.YOUTUBE_TOKEN,
        part: 'snippet',
        q: queryString
    });
}

module.exports={
    execute: execute,
    skip: skip,
    stop: stop,
    showQueue: showQueue
};