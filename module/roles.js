var listRoles = require("../data/roles.json");

function assign(reaction, user){
    if (listRoles.hasOwnProperty(reaction.emoji.name)){
        var role = reaction.message.guild.roles.cache.find((role => role.name === listRoles[reaction.emoji.name]));
        reaction.message.guild.member(user).roles.add(role.id).catch(console.error);
    }
}

function remove(reaction, user){
    if (listRoles.hasOwnProperty(reaction.emoji.name)){
        var role = reaction.message.guild.roles.cache.find((role => role.name === listRoles[reaction.emoji.name]));
        reaction.message.guild.member(user).roles.remove(role.id).catch(console.error);
    }
}

function sendMessage(message){
    if (message.member.hasPermission("ADMINISTRATOR")){
        var rolesMessage = [];
        for (var role in listRoles){
            rolesMessage.push({
                name: '---',
                value: role + ' - ' + listRoles[role] 
            });
        }

        const embedList = {
            color: 0x52376E,
            title: 'Vedici Auto Role',
            description: 'Welcome to Vedici Auto Role.\nYou can assign yourself to the available roles in our server.\nHere is the list of the available roles, just react to this message using emoji according to the role number to assign yourself.\nTo remove the role from your account, remove your reaction by clicking again the specified emoji.',
            fields: rolesMessage,
            timestamp: new Date(),
            footer: {
                text: 'Vedici Bot',
            },
        };

        message.channel.send({ embed: embedList }).then(sentEmbed => {
            for (var role in listRoles){
                sentEmbed.react(role);
            }
        });
    }
    else{
        message.reply("You are not Administrator!");
    }
}

function updateRoles(message){
    if (message.member.hasPermission("ADMINISTRATOR")){
        var GAMES_ROLES_ID = "805759803791376404";
        var MOVIES_ROLES_ID = "805762970604404736";

        message.guild.members.cache.forEach(member => {
            member.roles.add(GAMES_ROLES_ID).catch(console.error);
            member.roles.add(MOVIES_ROLES_ID).catch(console.error);
        });
    }
    else{
        message.reply("You are not Administrator!");
    }
}

module.exports={
    assign: assign,
    sendMessage: sendMessage,
    remove: remove,
    updateRoles: updateRoles
};