var util = require("../utility/roleutil");

function execute(message) {
    if (message.member.hasPermission("ADMINISTRATOR")) {
        var body = util.generateBody();

        message.channel.messages.fetch(util.configuration.RoleMessageID).then((message) => {
            message.edit({
                embed: body.embedList
            });
            message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
            for (let i = 0; i < body.emojiList.length; i++) {
                message.react(body.emojiList[i]);
            }
        }).catch(error => {
            console.log(error);
        });
    } else {
        message.reply("You are not Administrator!");
    }
}

module.exports = {
    name: "updateroles",
    description: "Update existing role message",
    execute: execute,
};