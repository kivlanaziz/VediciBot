const {
    Permissions
} = require('discord.js');

async function execute(message) {
    if (message.member.hasPermission("ADMINISTRATOR")) {
        const args = message.content.split(" ");
        if (!message.guild.roles.cache.find((role => role.name === args[1]))) { // Check if role not exists
            await createRole(message.guild, args[1]);
        }

        await createPrivateChannel(message.guild, args[1])
    }
}

async function createRole(guild, roleName) {
    try {
        await guild.roles.create({
            data: {
                name: roleName
            }
        });
    } catch (e) {
        console.error(e)
    }
}

async function createPrivateChannel(guild, channelName) {
    const everyoneRole = guild.roles.everyone;
    var channelRole = guild.roles.cache.find(role => role.name === channelName)
    if (channelRole) {
        const channel = await guild.channels.create(channelName, 'text');
        await channel.overwritePermissions([{
                type: 'role',
                id: everyoneRole.id,
                deny: [Permissions.FLAGS.VIEW_CHANNEL]
            },
            {
                type: 'role',
                id: channelRole.id,
                allow: [Permissions.FLAGS.VIEW_CHANNEL]
            },
        ]);
    } else {
        console.warn("Cannot Find Role for Channel " + channelName + "Role is " + channelRole)
    }
}

module.exports = {
    name: "createprivatechannel",
    aliases: ["cp"],
    description: "Create a Private Channel",
    execute: execute,
};