import { type User as DiscordUser } from 'discord.js';

import User from '../models/user.model';

import { type Client } from '../typings/discord';
import { type UserDoc } from '../typings/models';

const createUser = async (client: Client, discordUser: DiscordUser): Promise<UserDoc> => {
    const user = new User({
        created: new Date(),
        discordID: discordUser.id
    });

    await user.save();

    return user;
};

const findUser = async (client: Client, discordUser: DiscordUser): Promise<UserDoc> => {
    const dbUser = await User.findOne({ discordID: discordUser.id });
    return await (dbUser ?? createUser(client, discordUser));
};

export default findUser;
