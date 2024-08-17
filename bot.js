/*
  If you are gonna improve on this design or use it in general (Please don't it's insecure asf) Give me credits!
  
  My discord: milw0rm.5
  My website: pedophile.cc (I know the domain name is a bit weird it's just a about me site)
  My discord server: https://discord.gg/ZFEQCDB3eW (NSFW SERVER!!!)
*/

import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import fetch from 'node-fetch';

const srv = 'http://localhost:3000'; 

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const wl = {
    name: 'whitelist',
    description: 'Add a user to the whitelist',
    options: [
        {
            name: 'username',
            type: 3, // STRING
            description: 'Roblox username to whitelist',
            required: true
        }
    ]
};

const unwl = {
    name: 'unwhitelist',
    description: 'Remove a user from the whitelist',
    options: [
        {
            name: 'username',
            type: 3, 
            description: 'Roblox username to remove from whitelist',
            required: true
        }
    ]
};

client.once('ready', async () => {
    console.log(`[INFO] Logged in as ${client.user.tag}!`);
    try {
        const rest = new REST({ version: '10' }).setToken(token);
        console.log("[INFO] Refreshing application (/) commands...");

        const guilds = client.guilds.cache.map(guild => guild.id);

        for (const guildId of guilds) {
            const existingCommands = await rest.get(Routes.applicationGuildCommands(client.user.id, guildId));
            const commandNames = [wl.name, unwl.name];
            for (const command of existingCommands) {
                if (commandNames.includes(command.name)) {
                    await rest.delete(Routes.applicationGuildCommand(client.user.id, guildId, command.id));
                    console.log(`[INFO] Deleted existing command ${command.name} for guild ${guildId}.`);
                }
            }
            await rest.put(Routes.applicationGuildCommands(client.user.id, guildId), { body: [wl, unwl] });
            console.log(`[INFO] Registered new commands for guild ${guildId}.`);
        }
        console.log("[INFO] Successfully reloaded application (/) commands for all guilds.");
    } catch (error) {
        console.error(`[ERROR] Error during bot startup: ${error.message}`);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;
    const username = interaction.options.getString('username');

    console.log(`[INFO] Command received: ${commandName} with username: ${username}`);

    if (commandName === 'whitelist') {
        try {
            const response = await fetch(`${srv}/whitelist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Username: username }),
            });
            const data = await response.json();
            console.log(`[INFO] Whitelist check response: ${JSON.stringify(data)}`);
            await interaction.reply(data.message);
        } catch (error) {
            console.error(`[ERROR] Error while checking whitelist: ${error.message}`);
            await interaction.reply('An error occurred while checking whitelist status.');
        }
    } else if (commandName === 'unwhitelist') {
        try {
            const response = await fetch(`${srv}/unwhitelist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Username: username }),
            });
            const data = await response.json();
            console.log(`[INFO] Unwhitelist response: ${JSON.stringify(data)}`);
            await interaction.reply(data.message);
        } catch (error) {
            console.error(`[ERROR] Error while unwhitelisting: ${error.message}`);
            await interaction.reply('An error occurred while removing from the whitelist.');
        }
    }
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.login('');
