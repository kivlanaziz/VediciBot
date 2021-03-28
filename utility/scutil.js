const scdl = require("soundcloud-downloader").default
const scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;

async function getSong(song, url){
    try {
        const trackInfo = await scdl.getInfo(url, process.env.SOUNDCLOUD_CLIENT_ID);
        song = {
          title: trackInfo.title,
          url: trackInfo.permalink_url
        };
    } catch (error) {
        console.error(error);
    }

    return song;
}

module.exports = {
    getSong: getSong,
    scRegex: scRegex
}