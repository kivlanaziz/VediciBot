
// --- Dependency --- //
const Discord = require('discord.js');
const { connect } = require('http2');
const youtube = require("./module/youtube.js");
const message = require("./module/message.js");
const lyrics = require("./module/lyrics.js");
const roles = require("./module/roles.js")
// ------------------ //

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const PREFIX = '-';

const queue = new Map();

client.on('ready', () => {
    console.log('VediciBot Reporting!');
    client.user.setActivity('-help')
});

client.on('message', (msg) => {
    if (msg.content.includes('hi vedici')) {
        msg.reply('Hi! :)');
    }
    if (msg.content[0] != PREFIX){
        return;
    }
    let args = msg.content.substring(PREFIX.length).split(" ");
    const serverQueue = queue.get(msg.guild.id);

    switch (args[0]) {
        case 'help' :
            message.help(msg, PREFIX);
            break;
            
        case 'play':
            youtube.execute(msg, serverQueue, queue);
            break;
        
        case 'p':
            youtube.execute(msg, serverQueue, queue);
            break;

        case 'skip':
            youtube.skip(msg, serverQueue);
            break;

        case 'stop':
            youtube.stop(msg, serverQueue);
            break;

        case 'queue':
            youtube.showQueue(msg, serverQueue);
            break;
        
        case 'lyrics':
            lyrics.execute(msg, serverQueue);

        case 'rolesMessage':
            roles.sendMessage(msg);
    }

});

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'public');

    if (!channel) return;
    channel.send(`Welcome to the server, ${member}`);

    try{
        var role = member.guild.roles.cache.find((role => role.name === "Member"));
        member.roles.add(role);
    } catch(err){
        console.error(err);
    }
    
});

client.on("messageReactionAdd", async(reaction,user)=>{
    // When we receive a reaction we check if the reaction is partial or not
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
    }
    
    roles.assign(reaction,user);
})

client.login(process.env.token);
