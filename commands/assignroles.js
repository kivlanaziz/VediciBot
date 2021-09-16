var util = require("../utility/roleutil");

function execute(reaction, user) {
    var roleName = util.getEmojiRole(reaction.emoji.name);
    if (roleName) {
        var role = reaction.message.guild.roles.cache.find((role => role.name === roleName));
        if (role) {
            reaction.message.guild.member(user).roles.add(role.id).catch(console.error);
        } else {
            console.log("Cannot Find Role [" + roleName + "]");
        }
    }
}

module.exports = {
    name: "assignrole",
    description: "Assign role based on reaction emoji",
    execute: execute,
};