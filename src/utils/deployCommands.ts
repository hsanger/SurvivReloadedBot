
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

import log from './log';

import { type Client } from '../typings/discord';

const deployCommands = async (client: Client): Promise<void> => {
    if (process.env.DISCORD_TOKEN === undefined ||
        process.env.DISCORD_ID === undefined ||
        process.env.GUILD_ID === undefined ||
        client?.commands === undefined) { log(`yellow`, `Failed to deploy commands.`); return; }

    const rest = new REST({ version: `10` }).setToken(process.env.DISCORD_TOKEN);

    const commands: Array<Record<string, unknown>> = [];

    for (const [name, command] of client.commands) {
        log(`yellow`, `Registering command ${name}...`);
        commands.push(((command.cmd.toJSON() as unknown) as Record<string, unknown>));
    }

    // await rest.put(Routes.applicationCommands(process.env.DISCORD_ID), { body: commands })
    await rest.put(Routes.applicationGuildCommands(process.env.DISCORD_ID, process.env.GUILD_ID), { body: commands })
        .then(() => {
            log(`green`, `Successfully registered application commands.`);
        }).catch(err => { log(`red`, err); });
};

export default deployCommands;
