import config from '../../../config/config';

import { SlashCommandBuilder } from '@discordjs/builders';
import {
    type ChatInputCommandInteraction,
    EmbedBuilder
} from 'discord.js';

import { type Client } from '../../typings/discord';

const cmd: SlashCommandBuilder = new SlashCommandBuilder()
    .setName(`links`)
    .setDescription(`View important links regarding the project.`);

const run = async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
    if (interaction.guild === null || interaction.guild.rulesChannel === null) return;

    const sEmbed = new EmbedBuilder()
        .setColor(config.colors.blue)
        .setAuthor({ name: `Useful Links`, iconURL: interaction.guild?.iconURL() ?? undefined })
        .setDescription(`[Resurviv.io - Stable](https://resurviv.io)\n[Resurviv.io - Beta](https://test.resurviv.io)\n[Discord](https://discord.resurviv.io)\n[Subreddit](https://reddit.com/r/survivreloaded)\n[GitHub](https://github.com/SurvivReloaded)\n[Bot GitHub](https://github.com/DamienVesper/SurvivReloadedBot)`)
        .setTimestamp()
        .setFooter({ text: config.footer });

    await interaction.reply({
        embeds: [sEmbed]
    });
};

export {
    cmd,
    run
};
