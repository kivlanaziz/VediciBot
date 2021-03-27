const paginationEmbed = require('discord.js-pagination');
const { MessageEmbed } = require('discord.js');

function execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);
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

module.exports={
    name: "queue",
    description: "Display the Song Queue",
    execute: execute
};