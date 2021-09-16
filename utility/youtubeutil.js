const {
    connect
} = require('http2');
const {
    google
} = require('googleapis');
const {
    youtube
} = require("googleapis/build/src/apis/youtube");

async function getYoutubeSearch(queryString) {
    console.log('querying: ' + queryString);
    return google.youtube('v3').search.list({
        key: process.env.YOUTUBE_TOKEN,
        part: 'snippet',
        q: queryString
    });
}

async function getYoutubePlaylist(playlistId) {
    console.log('Searching for Playlist: ' + playlistId);
    return google.youtube('v3').playlistItems.list({
        key: process.env.YOUTUBE_TOKEN,
        part: 'snippet',
        playlistId: playlistId,
        maxResults: 50
    });
}

module.exports = {
    getYoutubeSearch: getYoutubeSearch,
    getYoutubePlaylist: getYoutubePlaylist
}