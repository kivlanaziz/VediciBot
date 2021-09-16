// --- Dependency --- //
const fs = require('fs');
const Discord = require('discord.js');
require('dotenv').config();
// ------------------ //

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const PREFIX = '-';

client.queue = new Map();

const getApp = (guildId) => {
    const app = client.api.applications(client.user.id)
    if (guildId){
        app.guilds(guildId)
    }
    return app
}

client.on('ready', async () => {
    console.log('VediciBot Reporting!');
    client.user.setActivity('-help')

    for (const command of client.commands){
        await getApp(process.env.guildId).commands.post({
            data: {
                name: command[1].name,
                description: command[1].description
            },
        })
    }

    const commands = await getApp(process.env.GuildId).commands.get()
    console.log(commands)
});

client.on('message', (message) => {
    if (message.content.includes('hi vedici')) {
        message.reply('Hi! :)');
    }
    if (message.content[0] != PREFIX){
        return;
    }
    let args = message.content.substring(PREFIX.length).split(" ");

    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) ||
                    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    try {
        command.execute(message, args);
    } catch (error){
        console.log(error);
        message.reply('Sorry, we encountered some error when executing the command.');
    }
    
});

client.on('guildMemberAdd', member => {
    var command = client.commands.get("welcomemessage");
    if (!command) return;

    try{
        command.execute(member);
    } catch(err){
        console.error(err);
    }

    command = client.commands.get("defaultroles");
    if (!command) return;

    try{
        command.execute(member);
    } catch(err){
        console.error(err);
    }
});

client.on('guildMemberRemove', member => {
    var command = client.commands.get("leavemessage");
    if (!command) return;

    try{
        command.execute(member);
    } catch(err){
        console.error(err);
    }
});

client.on("messageReactionAdd", async(reaction,user)=>{
    const command = client.commands.get("assignrole");
    if (!command) return;
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
    
    command.execute(reaction,user);
})

client.on("messageReactionRemove", async(reaction,user)=>{
    const command = client.commands.get("removerole");
    if (!command) return;
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
    
    command.execute(reaction,user);
})

client.login(process.env.token);
