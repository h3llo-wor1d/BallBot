const { REST } = require('@discordjs/rest');
const { Routes, ApplicationCommandType } = require('discord-api-types/v9');
const { SlashCommandBuilder, PermissionFlagsBits, ContextMenuCommandBuilder } = require('discord.js');
const { config } = require('../../config.js');

const commands = [
    new SlashCommandBuilder()
        .setName('gachapull')
        .setDescription('You will most-likely never be able to use this command.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    new SlashCommandBuilder()
        .setName('lockserver')
        .setDescription('You will most-likely never be able to use this command.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    new SlashCommandBuilder()
        .setName('purgeserver')
        .setDescription('You will most-likely never be able to use this command.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    new SlashCommandBuilder()
        .setName('form')
        .setDescription("View your current request form, if you have set one."),
    new SlashCommandBuilder()
        .setName('postuser')
        .setDescription('You will most-likely never be able to use this command.')
        .addUserOption(
            option => 
            option
                .setName('target')
                .setDescription('user to post embed for')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    new SlashCommandBuilder()
        .setName('makemenu')
        .setDescription("You will most-likely never be able to use this command.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    new SlashCommandBuilder()
        .setName('makeinfo')
        .setDescription("You will most-likely never be able to use this command.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    new SlashCommandBuilder()
        .setName('status')
        .setDescription('You will most-likely never be able to use this command.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    new SlashCommandBuilder()
        .setName('edit')
        .setDescription('Edit your registration form!')
]; 

const rest = new REST({ version: '9' }).setToken(config.token);

module.exports = async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        console.log(PermissionFlagsBits.Administrator);

        await rest.put(
        Routes.applicationGuildCommands(config.clientID, config.guildID),
        { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}