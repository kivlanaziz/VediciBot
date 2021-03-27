var util = require("../utility/roleutil");

function execute(message){
    if (message.member.hasPermission("ADMINISTRATOR")){
        var body = util.generateBody();

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

module.exports={
    name: "rolesmessage",
    description: "Send new role message",
    execute: execute,
};