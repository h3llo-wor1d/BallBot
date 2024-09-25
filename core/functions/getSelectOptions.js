const museRegistrant = require('../types/museRegistrant');

const validConnections = {
    "youtube": {
        label: "YouTube",
        value: "youtube"
    },
    "tiktok": {
        label: "TikTok",
        value: "tiktok"
    },
    "instagram": {
        label: "Instagram",
        value: "instagram"
    },
    "twitter": {
        label: "Twitter",
        value: "twitter"
    },
    "twitch": {
        label: "Twitch",
        value: "twitch"
    }
}

module.exports = async(uid) => {
    var connections = Object.keys(new museRegistrant(uid).userSocials);
    // i'm like 99% sure I can do some function to make this array faster than the code below...
    var connectedServices = []; 
    for (const connection of connections) {
        connectedServices.push(validConnections[connection]);
    }
    if (connectedServices.length === 0) {
        connectedServices = [
            {label: "Nothing Available To Select!", value: "null"}
        ]
    }

    return connectedServices;
}