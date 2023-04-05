import config from '../../config/config';

import log from '../utils/log';
import { logHeader } from '../utils/logExtra';
import refreshActivity from '../utils/refreshActivity';
import updateLeaderboards from '../utils/updateLeaderboards';

import { type Client } from '../typings/discord';

export default async (client: Client): Promise<void> => {
    log(`green`, `Client has started, with ${client.users.cache.size} user(s) in ${client.guilds.cache.size} guild(s).`);
    logHeader();

    await refreshActivity(client);
    await updateLeaderboards(client);

    setInterval(() => { void refreshActivity(client); }, config.cooldowns.utils.refreshActivity);
    setInterval(() => { void updateLeaderboards(client); }, config.cooldowns.utils.updateLeaderboards);
};
