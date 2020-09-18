const genius = require("genius-lyrics");
const geniusclient = new genius.Client(process.env.GENIUS_TOKEN); 

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
        if (songs === 'undefined'){
            message.reply("No result");
        }
        else{
            const lyrics = await songs[0].lyrics();
            message.channel.send(`**${songs[0].artist.name} - ${songs[0].title}**\n<${lyrics}>`)
        }
    }
    catch(err){
        console.log(err);
    }
}

module.exports={
    execute: execute
};