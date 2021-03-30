async function execute(member){
    const embedMessage = {
        color: 0xff4d00,
        author: {
            name: "See you again " + member.user.username + "!",
            icon_url: member.user.displayAvatarURL()
        },
        fields: [
            {
                name: "Left: " + new Date(),
                value: "Profile: <@" + member.id + ">"
            }
        ],
        timestamp: new Date(),
        footer: {
            text: 'User Left',
        },
    };

    const channel = member.guild.channels.cache.find(ch => ch.name === 'public');
    
    if (channel)
    channel.send({ embed: embedMessage });
    
}

module.exports={
    name: "leavemessage",
    description: "Send Exit Message to the specified member",
    execute: execute,
};