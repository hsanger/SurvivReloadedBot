import config from '../../../config/config';

import { SlashCommandBuilder } from '@discordjs/builders';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    type ChatInputCommandInteraction,
    EmbedBuilder
} from 'discord.js';

import axios, { type AxiosError } from 'axios';

import { type Client } from '../../typings/discord';

const cmd: SlashCommandBuilder = new SlashCommandBuilder()
    .setName(`status`)
    .setDescription(`Check the status of the game.`);

const translateCode = (code: number | undefined): string => {
    switch (code) {
        case 200:
            return `The server is currently up (200 OK).`;
        case 301:
        case 302:
            return `The server redirected the bot. The link may have been moved or unavailable.`;
        default:
            return `The server sent an abnormal response and may not be available.`;
    }
};

const run = async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
    await interaction.deferReply();

    const res = await axios.get(`https://resurviv.io`).then(res => res.status).catch((err: AxiosError) => err.response?.status);
    const sRes = await axios.get(`https://survivreloaded.com`).then(res => res.status).catch((err: AxiosError) => err.response?.status);
    const xRes = await axios.get(`https://resurviv.io`).then(res => res.status).catch((err: AxiosError) => err.response?.status);

    const sEmbed = new EmbedBuilder()
        .setColor(config.colors.orange)
        .setAuthor({ name: `Server Status`, iconURL: interaction.guild?.iconURL() ?? undefined, url: `https://resurviv.io` })
        .setDescription(`Current status of all Surviv Reloaded servers.\n\n**NOTE:** If your game is frozen, it's most likely that the client froze or crashed. The game is still relatively unstable, you'll have to reload the game.`)
        .addFields([
            { name: `resurviv.io`, value: translateCode(res) },
            { name: `survivreloaded.com`, value: translateCode(sRes) },
            { name: `taskjourney.org:449`, value: translateCode(xRes) }
        ])
        .setTimestamp()
        .setFooter({ text: config.footer });

    const sRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setURL(`https://resurviv.io`)
            .setLabel(`resurviv.io`)
            .setStyle(ButtonStyle.Link),
        new ButtonBuilder()
            .setURL(`https://survivreloaded.com`)
            .setLabel(`survivreloaded.com`)
            .setStyle(ButtonStyle.Link),
        new ButtonBuilder()
            .setURL(`https://taskjourney.org:449`)
            .setLabel(`taskjourney.org`)
            .setStyle(ButtonStyle.Link)
    );

    void interaction.followUp({
        embeds: [sEmbed],
        components: [sRow]
    });
};

export {
    cmd,
    run
};
