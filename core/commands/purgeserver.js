const clearChannel = require("../functions/clearChannel");
const delay = require('../functions/delay');
const fs = require('fs')

const kickBlacklist = [
    "902242926577455235",
    "1023694867798441984",
    "396164047025995790"
]

const channels = [
    "1025580540792946789",
    "1023719033402568777",
    "1199843935829377064"
]

module.exports = async (interaction) => {
    await interaction.reply({content: "Purging server and data...", ephemeral: true});
    let toKick = [];
    let members = await interaction.guild.members.fetch();

    for (let member of members) {
        // Literally fuck the discord.js devs for this
        member = member[1]
        if (kickBlacklist.indexOf(member.user.id) == -1) {
            toKick.push(member);
        }
    }

    for (let i = 0; i < toKick.length; i++) {
        try {
            let member = toKick[i];
            await member.kick();
        } catch {}
        await delay(.25);
    }

    for (let channel of channels) {
        try {
            await clearChannel(channel, interaction);
        } catch {}
    }

    interaction.guild.invites.fetch().then(invites => {invites.each(i => i.delete())});
}