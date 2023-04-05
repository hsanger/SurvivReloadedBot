import config from '../../../config/config';

import { SlashCommandBuilder } from '@discordjs/builders';
import {
    type ChatInputCommandInteraction
} from 'discord.js';

import { type Client } from '../../typings/discord';

const cmd: SlashCommandBuilder = new SlashCommandBuilder()
    .setName(`betatester`)
    .setDescription(`Get the beta tester role.`);

const run = async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
    if (interaction.guild === null) return;

    const member = await interaction.guild.members.fetch(interaction.user.id);
    if (member?.roles.cache.has(config.roles.betaTester)) {
        await interaction.reply({ content: `You already have that role!`, ephemeral: true });
        return;
    }

    await member.roles.add(config.roles.betaTester);
    await interaction.reply({ content: `You now have the beta tester role. Welcome to the club!` });
};

export {
    cmd,
    run
};
