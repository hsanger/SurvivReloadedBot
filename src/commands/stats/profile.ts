import config from '../../../config/config';

import { SlashCommandBuilder } from '@discordjs/builders';
import { type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import findUser from '../../utils/findUser';
import { calculateMaxExp } from '../../utils/functions';
import { discord, num } from '../../utils/standardize';

import { type Client } from '../../typings/discord';

const cmd: Omit<SlashCommandBuilder, `addSubcommand` | `addSubcommandGroup`> = new SlashCommandBuilder()
    .setName(`profile`)
    .addUserOption(option => option.setName(`user`).setDescription(`The user to check.`))
    .setDescription(`View a user's profile.`);

const run = async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
    const user = interaction.options.getUser(`user`) ?? interaction.user;
    const dbUser = await findUser(client, user);

    const sEmbed = new EmbedBuilder()
        .setColor(config.colors.blue)
        .setThumbnail(user.avatarURL() ?? user.defaultAvatarURL)
        .setAuthor({ name: `Profile | ${discord(user.tag)}`, iconURL: interaction.guild?.iconURL() as string })
        .setDescription(`**Level:** ${dbUser.level}\n**XP:** ${num(Math.round(dbUser.xp))} / ${num(calculateMaxExp(dbUser.level))}`)
        .setTimestamp()
        .setFooter({ text: config.footer });

    await interaction.reply({ embeds: [sEmbed] });
};

export {
    cmd,
    run
};
