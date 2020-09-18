const genius = require("genius-lyrics");
const geniusclient = new genius.Client(process.env.GENIUS_TOKEN); 

function execute(message, serverQueue) {
    const args = message.content.split(" ");
    if (typeof args[1] === 'undefined'){
        getLyrics(serverQueue.songs[0].title, message);
    } 
    else{
        getLyrics(args[1], message);
    }
}

function getLyrics(title, message){
    try{
        geniusclient.songs.search(title,{limit: 1})
        .then(results => {
            const lyrics = results[0];
            message.channel.send(`**${lyrics.artist.name} - ${lyrics.title}**\n<${lyrics.lyrics()}>`)
        }).catch(err => message.reply(err));
    }
    catch(err){
        console.log(err);
    }
}

module.exports={
    execute: execute
};