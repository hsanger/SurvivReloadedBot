import config from '../../../config/config';

import { SlashCommandBuilder } from '@discordjs/builders';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    type ChatInputCommandInteraction,
    EmbedBuilder
} from 'discord.js';

import { type Client } from '../../typings/discord';

const cmd: SlashCommandBuilder = new SlashCommandBuilder()
    .setName(`faq`)
    .setDescription(`View FAQ regarding the project.`);

const run = async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
    if (interaction.guild === null || interaction.guild.rulesChannel === null) return;

    const sEmbed = new EmbedBuilder()
        .setColor(config.colors.blue)
        .setAuthor({ name: `Help`, iconURL: interaction.guild?.iconURL() ?? undefined })
        .addFields([
            {
                name: `What is this server?`,
                value: `The community area for Surviv Reloaded, an open-source server for the now defunct online game surviv.io.`
            },
            {
                name: `What is this bot?`,
                value: `This bot was originally made by DamienVesper & Killaship to save the hassle of explaining exactly what this project is to everyone.`
            },
            {
                name: `What is SurvivReloaded?`,
                value: `An open source server implementation of surviv.io, utilizing the client from the original game. In other words, it's surviv.io, just hosted on a different server.`
            },
            {
                name: `Where can I get more info?`,
                value: `More information can be found on our [GitHub](https://github.com/SurvivReloaded).`
            }
        ])
        .setTimestamp()
        .setFooter({ text: config.footer });

    const sRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setURL(`https://resurviv.io`)
            .setLabel(`Website`)
            .setStyle(ButtonStyle.Link)
    );

    await interaction.reply({
        embeds: [sEmbed],
        components: [sRow]
    });
};

export {
    cmd,
    run
};
