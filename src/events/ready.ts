import config from '../../config/config';

import log from '../utils/log';
import { logHeader } from '../utils/logExtra';
import refreshActivity from '../utils/refreshActivity';
import updateLeaderboards from '../utils/updateLeaderboards';

import { type Client } from '../typings/discord';

import data from '../utils/data.json';
import findUser from '../utils/findUser';

export default async (client: Client): Promise<void> => {
    log(`green`, `Client has started, with ${client.users.cache.size} user(s) in ${client.guilds.cache.size} guild(s).`);
    logHeader();

    await refreshActivity(client);
    await updateLeaderboards(client);

    setInterval(() => { void refreshActivity(client); }, config.cooldowns.utils.refreshActivity);
    setInterval(() => { void updateLeaderboards(client); }, config.cooldowns.utils.updateLeaderboards);

    // Grab all existing users.
    const guild = await client.guilds.fetch(config.guild);
    const members = await guild.members.fetch();

    for (const entry of Object.entries(data)) {
        const discordUser = members.get(entry[0])?.user;
        if (discordUser === undefined) continue;

        const dbUser = await findUser(client, discordUser);
        console.log(`[${entry[0]}] Added ${entry[1].xp} XP to current ${dbUser.xp} XP.`);

        dbUser.xp += entry[1].xp;

        let xpNeeded = Math.floor((100 * Math.E * dbUser.level) / 2);
        while (dbUser.xp > xpNeeded) {
            dbUser.level++;
            dbUser.xp -= xpNeeded;

            xpNeeded = Math.floor((100 * Math.E * dbUser.level) / 2);
        }

        await dbUser.save();
    }
};
