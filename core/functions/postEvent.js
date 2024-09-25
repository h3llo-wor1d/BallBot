const { GuildScheduledEventManager, GuildScheduledEventPrivacyLevel, GuildScheduledEventEntityType } = require("discord.js");
const getMuseTime = require("./getMuseTime");

module.exports = async(guild) => {
    const event_manager = new GuildScheduledEventManager(guild);
    const channel = await guild.channels.cache.get("1084831240600948847");
    const times = getMuseTime();
    await event_manager.create({
        name: 'Show Schedule',
        scheduledStartTime: new Date(times[0]*1000),
        scheduledEndTime: new Date(times[1]*1000),
        privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
        entityType: GuildScheduledEventEntityType.External,
        description: 'Come down and watch Project Muse!',
        channel: channel,
        image: null,
        reason: 'Testing with creating a Scheduled Event',
        entityMetadata: {location: "https://twitch.tv/h3llo_wor1d"}
    });
}