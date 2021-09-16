function cleanUpTitle(title) {
    var newTitle = title.toString();
    var blacklist = ["Official Video", "OFFICIAL MUSIC VIDEO", "Music Video"];
    blacklist.forEach(item => {
        var regexp = new RegExp(item, "gi");
        newTitle = newTitle.replace(regexp, "");
    });

    return newTitle;
}

module.exports = {
    cleanUpTitle: cleanUpTitle,
}