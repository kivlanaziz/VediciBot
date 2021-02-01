const finder = require("lyrics-finder");

const { MessageEmbed } = require('discord.js');


async function execute(message, serverQueue) {
    const args = message.content.split(" ");
    if (typeof args[1] === 'undefined'){
        getLyrics(serverQueue.songs[0].title, message);
    } 
    else{
        args.splice(0,1);
        args.join();
        getLyrics(args, message);
    }
}

async function getLyrics(title, message){
    try{
        const lyrics = await finder("", title);
        
        var fields = [];
        if (lyrics.length >= 6000){
            message.channel.send("Cannot display the lyrics!");
            return;
        }
        for(let i = 0; i < lyrics.length; i += 2000) {
            const toSend = lyrics.substring(i, Math.min(lyrics.length, i + 2000));
                  const message_embed = new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle(title)
                    .setDescription(toSend)
                  message.channel.send(message_embed)
        }
    }
    catch(err){
        console.log(err);
    }
}

module.exports={
    execute: execute
};