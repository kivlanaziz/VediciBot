function execute(member) {
    var MEMBER_ROLES_ID = "732758382087503984";
    var GAMES_ROLES_ID = "805759803791376404";
    var MOVIES_ROLES_ID = "805762970604404736";
    var MUSIC_ROLES_ID = "805776467333873665";

    console.log("Updating Roles of: " + member);
    member.roles.add(MEMBER_ROLES_ID).catch(console.error);
    member.roles.add(GAMES_ROLES_ID).catch(console.error);
    member.roles.add(MOVIES_ROLES_ID).catch(console.error);
    member.roles.add(MUSIC_ROLES_ID).catch(console.error);

}

module.exports = {
    name: "defaultroles",
    description: "Assign Default Role for Specific Member",
    execute: execute,
};