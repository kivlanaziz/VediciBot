// --- Dependency --- //
const ytdl = require("ytdl-core-discord");
const validUrl = require("valid-url");
var util = require("../utility/youtubeutil");

// ------------------ //

async function execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);
    console.log(serverQueue);
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

    if (validUrl.isUri(args[1])) {
        if (args[1].includes('/playlist?')) {
            isPlaylist = true;
            url = args[1].split('?', 2);
            var urlSearchParam = new URLSearchParams('?' + url[1]);
            console.log('urlSearchParam: ' + '?' + url[1]);
            var playlistId = urlSearchParam.get('list');
            var searchResult = await util.getYoutubePlaylist(playlistId);
            console.log(searchResult);
            searchResult.data.items.forEach(item => {
                console.log('song url: https://www.youtube.com/watch?v=' + item.snippet.resourceId.videoId);
                song = {
                    title: item.snippet.title,
                    url: 'https://www.youtube.com/watch?v=' + item.snippet.resourceId.videoId
                }
                songs.push(song);
            });
        } else {
            var youtubeUrl = args[1];
            songInfo = await ytdl.getInfo(youtubeUrl);
            song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
            };
            //return message.channel.send("Sorry, feature play by url is temporarily disabled!");
        }
    } else {
        var i;
        var queryString = "";
        for (i = 1; i < args.length; i++) {
            queryString += args[i] + " ";
        }
        try {
            var searchResult = await util.getYoutubeSearch(queryString);

            var videoId = searchResult.data.items[0].id.videoId;
            if (typeof videoId === 'undefined') {
                return message.channel.send(
                    "Cannot find the video"
                );
            } else {
                var youtubeUrl = 'https://www.youtube.com/watch?v=' + videoId;
                songInfo = await ytdl.getInfo(youtubeUrl);
                song = {
                    title: songInfo.videoDetails.title,
                    url: songInfo.videoDetails.video_url,
                };
            }
        } catch (err) {
            console.log(err);
        }
    }

    if (!serverQueue) {
        // Creating the contract for our queue
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };
        // Setting the queue using our contract
        message.client.queue.set(message.guild.id, queueConstruct);
        // Pushing the song to our songs array
        if (isPlaylist) {
            queueConstruct.songs.push(...songs);
            message.channel.send(`Playlist has been added to the queue!`);
        } else {
            queueConstruct.songs.push(song);
        }

        try {
            // Here we try to join the voicechat and save our connection into our object.
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            // Calling the play function to start a song
            play(message.guild, queueConstruct.songs[0], message.client.queue);
        } catch (err) {
            // Printing the error message if the bot fails to join the voicechat
            console.log(err);
            message.client.queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        if (isPlaylist) {
            serverQueue.songs.push(...songs);
            console.log(serverQueue.songs);
            return message.channel.send(`Playlist has been added to the queue!`);
        } else {
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

    let stream = null;

    try {
        stream = await ytdl(song.url, {
            highWaterMark: 1 << 25
        });
    } catch (error) {
        serverQueue.textChannel.send(`Sorry we are unable to play: **${song.title}**, skipping to the next song!`);
        if (serverQueue) {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0], queue);
        }
    }

    const dispatcher = serverQueue.connection
        .play(stream, {
            type: 'opus'
        })
        .on("finish", () => {
            setTimeout(() => {
                console.log("Stream Ended, Waiting 200ms");
                serverQueue.songs.shift();
                play(guild, serverQueue.songs[0], queue);
            }, 200);
        })
        .on("error", (err) => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0], queue);
        });

    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

module.exports = {
    name: "play",
    aliases: ["p"],
    description: "Play Music",
    execute: execute
};