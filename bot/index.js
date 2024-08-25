import {
    Client,
    GatewayIntentBits,
    REST,
    Routes
  } from "discord.js";
  import p from "path-direct";
  import config from "./config.js";

  const __dirname = p.resolve();
  const x = p.join(__dirname, "config.js");
  
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
  });
  
  const cmds = [{
    name: "gen",
    description: "Generate a key from input",
    options: [{
      name: "input",
      type: 3,
      description: "Input to generate the key from",
      required: true
    }]
  }, {
    name: "blacklist",
    description: "Blacklist a user",
    options: [{
      name: "user",
      type: 6,
      description: "User to blacklist",
      required: true
    }]
  }, {
    name: "unblacklist",
    description: "Unblacklist a user",
    options: [{
      name: "user",
      type: 6,
      description: "User to unblacklist",
      required: true
    }]
  }];
  
  const blacklist = new Set();
  
  function encode(e) {
    let t = "";
    for(let n = 0; n < e.length; n++) t += ("00" + e.charCodeAt(n).toString(16)).slice(-2);
    return t.toUpperCase();
  }
  
  function gen(e) {
    return "Your key: " + encode(e);
  }
  
  client.once("ready", async () => {
    console.log(`Bot is ready and logged in as ${client.user.tag}`);
    console.log(x)
    try {
      const e = new REST({ version: "10" }).setToken(config.token);
      console.log("[INFO] Refreshing application (/) commands...");
      const t = client.guilds.cache.map(e => e.id);
      for (const n of t) {
        const t = await e.get(Routes.applicationGuildCommands(client.user.id, n));
        for (const i of t) cmds.some(e => e.name === i.name) && (
          await e.delete(Routes.applicationGuildCommand(client.user.id, n, i.id)),
          console.log(`[INFO] Deleted existing command ${i.name} for guild ${n}.`)
        );
        await e.put(Routes.applicationGuildCommands(client.user.id, n), {
          body: cmds
        });
        console.log(`[INFO] Registered new commands for guild ${n}.`);
      }
      console.log("[INFO] Successfully reloaded application (/) commands for all guilds.");
    } catch (e) {
      console.error(`[ERROR] Error during bot startup: ${e.message}`);
    }
  });
  
  client.on("interactionCreate", async e => {
    if (!e.isCommand()) return;
    const { commandName: t } = e;
    const n = e.options.getUser("user");
    const i = e.options.getString("input");
  
    if ("gen" === t) {
      if (blacklist.has(e.user.id)) return e.reply("You are blacklisted and cannot use this bot.");
      if (!e.member.roles.cache.has(config.whitelistedRoleId)) return e.reply("Get the whitelisted role.");
      if (i) {
        const t = gen(i);
        try {
          await e.user.send(t);
          await e.reply("I have sent you the key in DM.");
        } catch (t) {
          console.error(`Could not DM ${e.user.tag}:`, t);
          await e.reply("I could not DM you. Please check your DM settings.");
        }
      } else {
        await e.reply("Please provide input for the key generation.");
      }
    } else if ("blacklist" === t) {
      if (!e.member.roles.cache.has(config.blacklistRoleId)) return e.reply("You do not have permission to use this command.");
      n ? (blacklist.add(n.id), await e.reply(`User ${n.tag} has been blacklisted.`)) : await e.reply("Please specify a user to blacklist.");
    } else if ("unblacklist" === t) {
      if (!e.member.roles.cache.has(config.blacklistRoleId)) return e.reply("You do not have permission to use this command.");
      n ? (blacklist.delete(n.id), await e.reply(`User ${n.tag} has been unblacklisted.`)) : await e.reply("Please specify a user to unblacklist.");
    }
  });
  
  client.login(config.token);
  