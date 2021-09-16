function execute(message) {
    const serverQueue = message.client.queue.get(message.guild.id);
    const args = message.content.split(" ");
    if (!message.member.voice.channel)
        return message.channel.send(
            "You have to be in a voice channel to stop the music!"
        );
    if (!serverQueue)
        return message.channel.send("There is no song that I could skip!");

    if (typeof args[1] === 'undefined') {
        serverQueue.connection.dispatcher.end();
    } else {
        if (serverQueue.songs[args[1] - 1] !== 'undefined') {
            serverQueue.songs.splice(args[1] - 1, 1);
            return message.channel.send("Song at index: " + args[1] + " is deleted from queue!");
        } else {
            return message.channel.send("There is no queued song at index " + args[1]);
        }
    }
}

module.exports = {
    name: "skip",
    description: "skip the specified song",
    execute: execute
};