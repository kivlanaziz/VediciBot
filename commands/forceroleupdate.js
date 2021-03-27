function execute(message){
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
    name: "updateroles",
    description: "Forced Role Update for All Members",
    execute: execute,
};