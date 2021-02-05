// --- Dependency --- //
const ytdl = require("ytdl-core-discord");
const validUrl = require("valid-url");
const { connect } = require('http2');
const { google } = require('googleapis');
const { youtube } = require("googleapis/build/src/apis/youtube");
const paginationEmbed = require('discord.js-pagination');
const { MessageEmbed } = require('discord.js');
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

    var songs = [];
    var song;
    var isPlaylist = false;

    if (validUrl.isUri(args[1])){
        if (args[1].includes('/playlist?')){
            isPlaylist = true;
            url = args[1].split('?',2);
            var urlSearchParam = new URLSearchParams('?'+url[1]);
            console.log('urlSearchParam: '+'?'+url[1]);
            var playlistId = urlSearchParam.get('list');
            var searchResult = await getYoutubePlaylist(playlistId);
            console.log(searchResult);
            searchResult.data.items.forEach(item => {
                console.log('song url: https://www.youtube.com/watch?v=' + item.snippet.resourceId.videoId);
                song = {
                    title: item.snippet.title,
                    url: 'https://www.youtube.com/watch?v=' + item.snippet.resourceId.videoId
                }
                songs.push(song);
            });
        }
        else{
            /*
            var youtubeUrl = args[1];
            songInfo = await ytdl.getInfo(youtubeUrl);
            song = {
                title: songInfo.title,
                url: songInfo.video_url,
            };
            */
            return message.channel.send("Sorry, feature play by url is temporarily disabled!");
        }
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
            var title = searchResult.data.items[0].snippet.title;
            if (typeof videoId === 'undefined'){
                return message.channel.send(
                    "Cannot find the video"
                );
            }
            else{
                var youtubeUrl = 'https://www.youtube.com/watch?v='+videoId;
                song = {
                    title: title,
                    url: youtubeUrl,
                };
            }
        }
        catch(err){
            console.log(err);
        }
    }

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
        if (isPlaylist){
            queueContruct.songs.push(...songs);
            message.channel.send(`Playlist has been added to the queue!`);
        }
        else{
            queueContruct.songs.push(song);
        }

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
        if (isPlaylist){
            serverQueue.songs.push(...songs);
            console.log(serverQueue.songs);
            return message.channel.send(`Playlist has been added to the queue!`);
        }
        else{
            serverQueue.songs.push(song);
            console.log(serverQueue.songs);
            return message.channel.send(`${song.title} has been added to the queue!`);
        }
        
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
        }).catch(error => {
            console.error(error);
            serverQueue.textChannel.send('Cannot play the song!');
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0], queue);
        }),{
            type: 'opus',
            highWaterMark: 50
        })
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0], queue);
        });
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
    var pages = [];
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

        if (index % 10 == 0){
            const embed = new MessageEmbed()
                .setColor('0x0099ff')
                .setTitle('Vedici Live Music Queue')
                .setAuthor('Requested by: '+message.member.user.username)
                .setDescription('Vedici Bot')
                .addFields(list);
            
            pages.push(embed);
            list = [];
        }
    });

    if (typeof list != "undefined" && list != null && list.length != null
    && list.length > 0){
        const embed = new MessageEmbed()
            .setColor('0x0099ff')
            .setTitle('Vedici Live Music Queue')
            .setAuthor('Requested by: '+message.member.user.username)
            .setDescription('Vedici Bot')
            .addFields(list);
        
        pages.push(embed);
        list = [];
    }

    paginationEmbed(message, pages);
}

async function getYoutubeSearch(queryString){
    console.log('querying: ' + queryString);
    return google.youtube('v3').search.list({
        key: process.env.YOUTUBE_TOKEN,
        part: 'snippet',
        q: queryString
    });
}

async function getYoutubePlaylist(playlistId){
    console.log('Searching for Playlist: ' + playlistId);
    return google.youtube('v3').playlistItems.list({
        key: process.env.YOUTUBE_TOKEN,
        part: 'snippet',
        playlistId: playlistId,
        maxResults: 50
    });
}

module.exports={
    execute: execute,
    skip: skip,
    stop: stop,
    showQueue: showQueue
};