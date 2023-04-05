import * as path from 'path';

import { type Client } from '../typings/discord';

import log from '../utils/log';
import { logHeader } from '../utils/logExtra';

import readDirectory from '../utils/readDirectory';

/**
 * Load all commands.
 * @author DamienVesper
 * @param client The client to register commands to.
 */
const loadCommands = async (client: Client): Promise<void> => {
    logHeader();

    // Initialize the commands array.
    client.commands = new Map();

    const files = readDirectory(path.resolve(__dirname, `../commands`));

    for (const file of files) {
        const fileName = (file.split(process.platform === `win32` ? `\\` : `/`).pop() as string).split(`.`)[0];

        const command = await import(file);
        if (command.cmd !== undefined) {
            log(`yellow`, `Loaded command ${fileName}.`);
            client.commands.set(fileName, {
                cmd: command.cmd,
                run: command.run
            });
        }
    }
};

/**
 * Load all events.
 * @author DamienVesper
 * @param client The client to register events to.
 */
const loadEvents = async (client: Client): Promise<void> => {
    logHeader();

    // Initialize client events.
    client.events = new Map();

    const files = readDirectory(path.resolve(__dirname, `../events`));

    for (const file of files) {
        const fileName = (file.split(process.platform === `win32` ? `\\` : `/`).pop() as string).split(`.`)[0];
        log(`yellow`, `Loaded event ${fileName}.`);

        const event = await import(file);

        client.on(fileName, event.default.bind(null, client));
        client.events.set(fileName, { callback: event });
    }
};

export {
    loadCommands,
    loadEvents
};
