async function execute(member){
    const embedMessage = {
        color: 0x00ffa6,
        author: {
            name: "Hi " + member.user.username,
            icon_url: member.user.displayAvatarURL()
        },
        fields: [
            {
                name: "Joined: " + member.joinedAt,
                value: "Profile: <@" + member.id + ">"
            }
        ],
        timestamp: new Date(),
        footer: {
            text: 'User Joined',
        },
    };

    const channel = member.guild.channels.cache.find(ch => ch.name === 'arrival');
    
    if (channel)
    channel.send({ embed: embedMessage });
    
}

module.exports={
    name: "welcomemessage",
    description: "Send Welcome Message to the specified member",
    execute: execute,
};