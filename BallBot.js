const { Client, GatewayIntentBits, Partials } = require('discord.js');
const { config } = require('./config');
const createServer = require('./core/server/createServer');
const getRegisteredMembers = require('./core/functions/getRegisteredMembers');
const createSockets = require('./core/socket/createSockets');
require('dotenv').config()

global.registeredMembers = [];
global.rawMemberData = [];
global.skippedList = [];
global.twitch = null;
global.currentConnections = [];
global.wsConnections = [];
global.currentUser = "";
global.currentUserAvatar = "";
global.currentUserData = {};
global.requestsFinished = 0;
global.userCount = 0;
global.songCount = 6;
global.timer;
global.timeRem = 59;
global.paused = false;
global.endTime = false;

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildScheduledEvents
    ],
    'partials': [Partials.Channel]
});

client.once('ready', async (i) => {
    console.log("BallBot v2.0.0 is Now Online!");

    global.rawMemberData = await getRegisteredMembers()
    global.registeredMembers = global.rawMemberData.map(i => i.id);

    setTimeout(() => createServer());
    setTimeout(() => createSockets());
});

client.on('interactionCreate', async interaction => {
    switch (interaction.type) {
        case 2:
            try {
                let command = require(`./core/commands/${interaction.commandName}`);
                command(interaction);
            } catch (err) {
                console.error(`InteractionCreate >> ${err}`)
                interaction.reply({
                    content: "failed to use command.", 
                    ephemeral: true
                })
            }
            break;
    }
});


client.on("voiceStateUpdate", async (oldVoiceState, newVoiceState) => {
    if (newVoiceState.channelId === config.gachaVC) {
        global.currentConnections.push(newVoiceState.member.user.id);
    } else if (oldVoiceState.channelId === config.gachaVC) { 
        global.currentConnections.splice(global.currentConnections.indexOf(oldVoiceState.member.user.id), 1);
    };
});

client.on('guildMemberAdd', async member => {
    global.userCount += 1;
    if (global.registeredMembers.indexOf(member.user.id) !== -1) {
        member.roles.add(member.guild.roles.cache.find(r => r.name === "Registered"));
    }
});

client.login(process.env.DISCORD_TOKEN);