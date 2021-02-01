const finder = require("lyrics-finder");

const { MessageEmbed } = require('discord.js');

function whitelist(title){
    var newTitle = title.toString();
    var whitelist = ["Official Video", "OFFICIAL MUSIC VIDEO", "Music Video"];
    whitelist.forEach(item => {
        newTitle = newTitle.replaceAll(item,"");
    });

    return newTitle;
}

async function execute(message, serverQueue) {
    const args = message.content.split(" ");
    if (typeof args[1] === 'undefined'){
        if (serverQueue){
            var title = whitelist(serverQueue.songs[0].title);
            getLyrics(title, message);
        }
        else{
            message.channel.send("Play a song first!");
            return;
        }
    } 
    else{
        args.splice(0,1);
        var title = args.join();
        title = title.toString().replace(/(\r\n|\n|\r)/gm, "");
        getLyrics(title, message);
    }
}

async function getLyrics(title, message){
    try{
        const lyrics = await finder("", title);
        
        if (lyrics){
            if (lyrics.length >= 6000){
                message.channel.send("Cannot display the lyrics!");
                return;
            }
            for(let i = 0; i < lyrics.length; i += 2000) {
                const toSend = lyrics.substring(i, Math.min(lyrics.length, i + 2000));
                      const message_embed = new MessageEmbed()
                        .setColor(0xff271c)
                        .setTitle(title)
                        .setDescription(toSend)
                      message.channel.send(message_embed)
            }
        }
        else{
            message.channel.send("Sorry we could not find the lyrics.");
            return;
        }
    }
    catch(err){
        console.log(err);
    }
}

module.exports={
    execute: execute
};