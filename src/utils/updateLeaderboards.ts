import User from '../models/user.model';
import Leaderboard from '../models/leaderboard.model';

import type { Client } from '../typings/discord';
import type { LBUser } from '../typings/models';

import log from '../utils/log';

const createLeaderboard = async (client: Client): Promise<LBUser[]> => {
    const lb: LBUser[] = [];

    // Grab all existing users.
    const users = await User.find({ banned: false });
    if (users.length === 0) return lb;

    for (const user of users) {
        const discordUser = await client.users.fetch(user.discordID);

        // Add users to the generic leaderboard.
        if (discordUser === undefined) continue;
        lb.push({
            discordID: discordUser.id,
            discordTag: discordUser.tag,

            balance: user.balance,
            level: user.level,
            xp: user.xp
        });
    }

    // Return the completed leaderboard.
    return lb;
};

const sortLeaderboard = async (type: string, lb: LBUser[]): Promise<LBUser[] | null> => {
    switch (type) {
        case `xp`:
            lb.sort((a, b) => a.level === b.level ? ((a.xp <= b.xp) ? 1 : -1) : (a.level <= b.level) ? 1 : -1);
            break;
        default:
            return null;
    }

    return lb;
};

const updateLeaderboards = async (client: Client): Promise<void> => {
    log(`cyan`, `Updating leaderboards...`);

    // Delete all existing leaderboards.
    await Leaderboard.deleteMany({});

    const leaderboard = await createLeaderboard(client);
    if (leaderboard.length === 0) return log(`yellow`, `No active users found. Skipping...`);

    const lb = new Leaderboard({
        created: new Date(),
        xp: await sortLeaderboard(`xp`, leaderboard)
    });

    // WARNING: O(n^2) moment
    const users = await User.find({ banned: false });
    for (const user of users) {
        for (const lbUser of lb.xp) {
            if (lbUser.discordID === user.discordID) {
                user.spot = lb.xp.indexOf(lbUser) + 1;
                await user.save();
                break;
            }
        }
    }

    await lb.save();
    log(`green`, `Leaderboards updated.`);
};

export default updateLeaderboards;
