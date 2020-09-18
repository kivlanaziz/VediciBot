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
        
        const lyrics = await songs[0].lyrics();
        var fields = [];
        if (lyrics.length > 1000){
            var lowerlimit = 0;
            var upperlimit = 1000;
            while(lowerlimit < lyrics.length){
                fields.push({
                    value: lyrics.substring(lowerlimit, upperlimit)
                });
                lowerlimit = upperlimit + 1;
                if ((lyrics.length - upperlimit) > 2000){
                    upperlimit += 2000;
                }
                else{
                    upperlimit += (lyrics.length - upperlimit);
                }
            }
        }
        else{
            fields.push({
                value: lyrics
            })
        }

        const embed = new MessageEmbed()
            .setTitle(`${songs[0].artist.title} - ${songs[0].title}`)
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