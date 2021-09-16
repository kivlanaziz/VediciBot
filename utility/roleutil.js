var roleData = require("../data/roles.json");
var configuration = require("../data/configuration.json");

function getEmojiRole(emoji) {
    for (let i = 0; i < roleData.games.length; i++) {
        if (roleData.games[i].emoji == emoji) {
            return roleData.games[i].name;
        }
    }

    for (let i = 0; i < roleData.movies.length; i++) {
        if (roleData.movies[i].emoji == emoji) {
            return roleData.movies[i].name;
        }
    }

    for (let i = 0; i < roleData.musics.length; i++) {
        if (roleData.musics[i].emoji == emoji) {
            return roleData.musics[i].name;
        }
    }
}

function getRoleData() {
    if (roleData) {
        return roleData
    }

    return null;
}

function generateBody() {
    var rolesMessage = [];
    var emojiList = [];

    var OptionList = ""
    for (let i = 0; i < roleData.games.length; i++) {
        OptionList += roleData.games[i].emoji + "-" + roleData.games[i].name + "\n";
        emojiList.push(roleData.games[i].emoji);
    }
    rolesMessage.push({
        name: "Games",
        value: OptionList
    });

    OptionList = ""
    for (let i = 0; i < roleData.movies.length; i++) {
        OptionList += roleData.movies[i].emoji + "-" + roleData.movies[i].name + "\n";
        emojiList.push(roleData.movies[i].emoji);
    }
    rolesMessage.push({
        name: "Movies",
        value: OptionList
    });

    OptionList = ""
    for (let i = 0; i < roleData.musics.length; i++) {
        OptionList += roleData.musics[i].emoji + "-" + roleData.musics[i].name + "\n";
        emojiList.push(roleData.musics[i].emoji);
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

module.exports = {
    getEmojiRole: getEmojiRole,
    getRoleData: getRoleData,
    generateBody: generateBody,
    configuration: configuration
}