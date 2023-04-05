import { Client, GatewayIntentBits, Partials } from 'discord.js';
import mongoose from 'mongoose';
import { config as dotenv } from 'dotenv';

import * as loader from './modules/loader';

import log from './utils/log';
import * as logExtra from './utils/logExtra';
import deployCommands from './utils/deployCommands';

import { type Client as DCClient } from './typings/discord';

dotenv();

const client: DCClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Channel
    ]
});

/**
 * Start up the bot.
 */
const main = async (): Promise<void> => {
    // Clear console and log program headers.
    console.clear();
    logExtra.logSplash();

    client.queue = new Map();

    if (process.env.MONGODB_URI !== undefined) {
        logExtra.logHeader();
        await mongoose.connect(process.env.MONGODB_URI);
        log(`green`, `Connected to database.`);
    }

    await loader.loadCommands(client);
    await loader.loadEvents(client);

    if (process.env.NODE_ENV === `development`) {
        logExtra.logHeader();
        await deployCommands(client);
    }

    logExtra.logHeader();
    await client.login(process.env.DISCORD_TOKEN).catch(() => { log(`red`, `Failed to authenticate client with application.`); });
};

// Start the program.
void main();

export default client;
