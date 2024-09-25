const { config } = require('../../config');
const getMembers = require('../functions/getMembers');
//const updateClient = require('../functions/socket/updateClient');
const delay = require('../functions/delay');
const broadcastEvent = require('../functions/broadcastEvent');
//const startUserConfig = require('../functions/startUserConfig');;
/*
    GACHAPULL.JS

    Function - Gets an array of all registered users and picks them at random for interview + music

    Status - Completed! Don't edit lol
*/

module.exports = async(i) => {
    await i.reply({content: "...", ephemeral: true});
    let members = await getMembers(i);

    while (members.length > 0) { 
        var pulled = members[Math.floor(Math.random()*members.length)];

        global.registeredMembers = global.registeredMembers.filter(function(item) {
            return item !== pulled
        })

        let message = await i.channel.send(`<@${pulled}>, you have been selected! You have 60 seconds to join <#${config.gachaVC}>!`);
        var isSelected = false;
        var member = i.guild.members.cache.get(pulled);

        /*
        // Todo: Replace with new WS function that actually fucking works better
        setTimeout(async () => {
            await updateClient("newPullVC", {
                username: member.displayName
            })
        })*/

        setTimeout(() => {
            broadcastEvent('vc-select', member.displayName)
        })

        member.roles.add(i.guild.roles.cache.find(r => r.name === "Selected"));
       
        let pickInterval;
        let pickTimes = 0

        broadcastEvent('vc-timer', 60)

        pickInterval = setInterval(() => {
            pickTimes += 1
            broadcastEvent('vc-refresh', member.displayName);
            broadcastEvent('vc-timer', 60-pickTimes);
        }, 1000)

        for (let i = 0; i < 60; i++) {
            if (global.currentConnections.indexOf(pulled) !== -1) {
                isSelected = true;
                break;
            }
            
            message.edit(`<@${pulled}>, you have been selected! You have ${60-i} seconds to join <#${config.gachaVC}>!`);
            await delay(1);
        }
        clearInterval(pickInterval);
        pickTimes = 0;

        if (isSelected) {
            // also alert on ws that this is the current user
            global.currentUser = member.displayName;
            global.currentUserData = global.rawMemberData.filter(i => i.id === member.user.id)[0].content;
            global.currentUserAvatar = member.user.displayAvatarURL();
            
            // Broadcast newUser event
            broadcastEvent('newUser', {
                currentUser: global.currentUser,
                currentUserData: global.currentUserData,
                avatar: global.currentUserAvatar
            })
            
            await message.edit(`<@${pulled}>, you have been selected! Have fun!`);
            member.roles.remove(i.guild.roles.cache.find(r => r.name === "Selected"));
            member.roles.add(i.guild.roles.cache.find(r => r.name === "In Progress"));
            break;
        } else {
            broadcastEvent('vc-timer', false)
            await message.edit(`~~<@${pulled}>, you have been selected! You have 0 seconds to join <#${config.gachaVC}>!~~`)
            member.roles.remove(i.guild.roles.cache.find(r => r.name === "Selected"));
            member.roles.add(i.guild.roles.cache.find(r => r.name === "Skipped"));
            global.skippedList.push(pulled);
        } 

        members = await getMembers(i);
    }
}