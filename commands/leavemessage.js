async function execute(member){
    const channelID = '826063132710666302'
    let date = new Date(Date.UTC(year, month, day, hour, minute, second))
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

    const channel = member.guild.channels.cache.get(channelID);
    
    if (channel)
    channel.send({ embed: embedMessage });
    else
    console.warn("Cannot Find Channel with ID " + channelID);
}

module.exports={
    name: "leavemessage",
    description: "Send Exit Message to the specified member",
    execute: execute,
};