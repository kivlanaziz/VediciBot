function help (message, PREFIX){
    var helpMessage = [];
    //Play message
    helpMessage.push({
        name: PREFIX + "play *-youtubeURL*",
        value: "Play an audio from youtube URL"
    })
    helpMessage.push({
        name: PREFIX + "play *-songName*",
        value: "Play an audio based on the song name"
    })
    helpMessage.push({
        name: PREFIX + "lyrics *-songName*",
        value: "Display the lyrics from the requested song"
    })
    helpMessage.push({
        name: PREFIX + "lyrics",
        value: "Display the lyrics of the currently played song"
    })
    //Skip message
    helpMessage.push({
        name: PREFIX + "skip",
        value: "Skip the current audio"
    })
    helpMessage.push({
        name: PREFIX + "skip *-songIndex*",
        value: "Remove the selected audio from the queue"
    })
    //Stop message
    helpMessage.push({
        name: PREFIX + "stop",
        value: "Stop the current audio & clear the queue"
    })
    //ShowQueue message
    helpMessage.push({
        name: PREFIX + "queue",
        value: "Show the audio queue"
    })
    const embedList = {
        color: 0x04d9c4,
        title: 'Vedici Help Center',
        author: {
            name: "Hi " + message.member.user.username
        },
        fields: helpMessage,
        timestamp: new Date(),
        footer: {
            text: 'Vedici Bot',
        },
    };
    console.log(embedList);
    return message.channel.send({ embed: embedList });
}

module.exports={
    help: help
};