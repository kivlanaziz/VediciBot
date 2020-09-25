const genius = require("genius-lyrics");
const geniusclient = new genius.Client(process.env.GENIUS_TOKEN); 
const { MessageEmbed } = require('discord.js');


async function execute(message, serverQueue) {
    const args = message.content.split(" ");
    if (typeof args[1] === 'undefined'){
        getLyrics(serverQueue.songs[0].title, message);
    } 
    else{
        getLyrics(args[1], message);
    }
}

async function getLyrics(title, message){
    try{
        const songs = await geniusclient.songs.search(title,{limit: 1});
        
        const lyrics = await songs[0].lyrics();
        var fields = [];
        if (lyrics.length >= 6000){
            message.channel.send("Cannot display the lyrics!");
            return;
        }
        if (lyrics.length > 1024){
            var lowerlimit = 0;
            var upperlimit = 1024;
            while(lowerlimit < lyrics.length){
                fields.push({
                    name: "-",
                    value: lyrics.substring(lowerlimit, upperlimit)
                });
                lowerlimit = upperlimit;
                if ((lyrics.length - upperlimit) > 1024){
                    upperlimit += 1024;
                }
                else{
                    upperlimit += (lyrics.length - upperlimit);
                }
            }
        }
        else{
            fields.push({
                name: "-",
                value: lyrics
            })
        }

        const embed = new MessageEmbed()
            .setTitle(`${songs[0].artist.name} - ${songs[0].title}`)
            .addFields(fields);

        message.channel.send(embed);
    }
    catch(err){
        console.log(err);
    }
}

module.exports={
    execute: execute
};