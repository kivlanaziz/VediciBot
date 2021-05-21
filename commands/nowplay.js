const { MessageEmbed } = require('discord.js');

function pause(serverQueue){
    serverQueue.connection.dispatcher.pause(true);
}

function resume(serverQueue){
    serverQueue.connection.dispatcher.resume();
}

function skip(serverQueue){
    serverQueue.connection.dispatcher.end();
}

function execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);

    if (!serverQueue)
        return message.channel.send("Queue is Empty!");

    const song = serverQueue.songs[0];

    const embed = new MessageEmbed()
        .setColor('0x8dbbcc')
        .setTitle('Vedici Live Music Queue')
        .setDescription('Now Playing')
        .addFields({name:song.title,value:song.url});

    message.channel.send(embed).then(sentEmbed => {
        sentEmbed.react("⏸️");
        sentEmbed.react("▶️");
        sentEmbed.react("⏭️");

        const collector = sentEmbed.createReactionCollector(
            (reaction,user) =>
            ["⏸️", "▶️","⏭️"].includes(reaction.emoji.name) && !user.bot, 
            { time: 60000 });

        collector.on('collect', reaction => {
            if (reaction.emoji.name === "⏸️"){
                pause(serverQueue);
            }
            else if(reaction.emoji.name === "▶️"){
                resume(serverQueue);
            }
            else if(reaction.emoji.name === "⏭️"){
                skip(serverQueue);

                const newServerQueue = message.client.queue.get(message.guild.id);
                const newSong = newServerQueue.songs[0];

                sentEmbed.edit(new MessageEmbed()
                .setColor('0x8dbbcc')
                .setTitle('Vedici Live Music Queue')
                .setDescription('Now Playing')
                .addFields({name:newSong.title,value:newSong.url}))
            }
        })
    })
}

module.exports={
    name: "nowplay",
    aliases: ['np'],
    description: "Display the currently played song info",
    execute: execute
};