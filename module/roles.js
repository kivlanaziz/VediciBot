var listRoles = require("../data/roles.json");
var configuration = require("../data/configuration.json");

function assign(reaction, user){
    var roleName = getEmojiRole(reaction.emoji.name);
    if (roleName){
        var role = reaction.message.guild.roles.cache.find((role => role.name === roleName));
        if (role){
            reaction.message.guild.member(user).roles.add(role.id).catch(console.error);
        }
        else{
            console.log("Cannot Find Role ["+roleName+"]");
        }
    }
}

function remove(reaction, user){
    var roleName = getEmojiRole(reaction.emoji.name);
    if (roleName){
        var role = reaction.message.guild.roles.cache.find((role => role.name === roleName));
        if (role){
            reaction.message.guild.member(user).roles.remove(role.id).catch(console.error);
        }
        else{
            console.log("Cannot Find Role ["+roleName+"]");
        }
    }
}

function getEmojiRole(emoji){
    for (let i=0; i < listRoles.games.length; i++){
        if (listRoles.games[i].emoji == emoji){
            return listRoles.games[i].name;
        }
    }

    for (let i=0; i < listRoles.movies.length; i++){
        if (listRoles.movies[i].emoji == emoji){
            return listRoles.movies[i].name;
        }
    }

    for (let i=0; i < listRoles.musics.length; i++){
        if (listRoles.musics[i].emoji == emoji){
            return listRoles.musics[i].name;
        }
    }
}

function generateBody(){
    var rolesMessage = [];
    var emojiList = [];
    
    var OptionList = ""
    for (let i=0; i < listRoles.games.length; i++){
        OptionList += listRoles.games[i].emoji + "-" + listRoles.games[i].name + "\n";
        emojiList.push(listRoles.games[i].emoji);
    }
    rolesMessage.push({
        name: "Games",
        value: OptionList
    });

    OptionList = ""
    for (let i=0; i < listRoles.movies.length; i++){
        OptionList += listRoles.movies[i].emoji + "-" + listRoles.movies[i].name + "\n";
        emojiList.push(listRoles.movies[i].emoji);
    }
    rolesMessage.push({
        name: "Movies",
        value: OptionList
    });

    OptionList = ""
    for (let i=0; i < listRoles.musics.length; i++){
        OptionList += listRoles.musics[i].emoji + "-" + listRoles.musics[i].name + "\n";
        emojiList.push(listRoles.musics[i].emoji);
    }
    rolesMessage.push({
        name: "Musics",
        value: OptionList
    });

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

    console.log(emojiList);
    return {
        embedList,
        emojiList
    };
}

function sendMessage(message){
    if (message.member.hasPermission("ADMINISTRATOR")){
        var body = generateBody();

        message.channel.send({ embed: body.embedList }).then(sentEmbed => {
            for (let i=0; i<body.emojiList.length; i++){
                sentEmbed.react(body.emojiList[i]);
            }
        });
    }
    else{
        message.reply("You are not Administrator!");
    }
}

function updateMessage(message){
    if (message.member.hasPermission("ADMINISTRATOR")){
        var body = generateBody();

        message.channel.messages.fetch(configuration.RoleMessageID).then((message) => {
            message.edit({ embed: body.embedList });
            message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
            for (let i=0; i<body.emojiList.length; i++){
                message.react(body.emojiList[i]);
            }
        }).catch(error =>{
            console.log(error);
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
        var MUSIC_ROLES_ID = "805776467333873665";

        message.guild.members.cache.forEach(member => {
            console.log("Updating Roles of: " + member);
            member.roles.add(GAMES_ROLES_ID).catch(console.error);
            member.roles.add(MOVIES_ROLES_ID).catch(console.error);
            member.roles.add(MUSIC_ROLES_ID).catch(console.error);
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
    updateRoles: updateRoles,
    updateMessage: updateMessage
};