var listRoles = require("../data/roles.json");

function assign(reaction, user){
    if (listRoles.hasOwnProperty(reaction.emoji.name)){
        var role = reaction.message.guild.roles.cache.find((role => role.name === listRoles[reaction.emoji.name]));
        reaction.message.guild.member(user).addRole(listRoles[reaction.emoji.name]).catch(console.error);
    }
}

function sendMessage(message){
    if (message.member.hasPermission("ADMINISTRATOR")){
        var rolesMessage = [];
        for (var role in listRoles){
            rolesMessage.push({
                name: role,
                value: listRoles[role] 
            });
        }

        const embedList = {
            color: 0x35FF07,
            title: 'Vedici Auto Role',
            description: 'Welcome to Vedici Auto Role.\nYou can assign yourself to the available roles in our server.\nHere is the list of the available roles, just click the emoji below to assign yourself.',
            fields: rolesMessage,
            timestamp: new Date(),
            footer: {
                text: 'Vedici Bot',
            },
        };

        const embedMessage = await message.channel.send({ embed: embedList });
        for (var role in listRoles){
            await embedMessage.react(role);
        }
    }
    else{
        message.reply("You are not Administrator!");
    }
}

module.exports={
    assign: assign,
    sendMessage: sendMessage
};