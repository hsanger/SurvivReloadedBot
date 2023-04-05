import config from '../../../config/config';

import { EmbedBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { type ChatInputCommandInteraction } from 'discord.js';

import { discord } from '../../utils/standardize';

import { type Client } from '../../typings/discord';

const cmd: SlashCommandBuilder = new SlashCommandBuilder()
    .setName(`queue`)
    .setDescription(`View the server queue.`);

const run = async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
    if (interaction.guild === null) return;

    const queue = client.queue?.get(interaction.guild.id);
    if (queue === undefined) return;

    const voiceChannel = (await interaction.guild.members.fetch(interaction.user.id)).voice.channel;
    if (voiceChannel === null) {
        await interaction.reply({ content: `You must join a voice channel to run that command!`, ephemeral: true });
        return;
    }

    const song = queue.nowPlaying;
    const queueStr = queue.history.length > 0
        ? queue.history.map((x, i) => `${i === queue.historyID - 1 ? `**↳** ` : ``}${i + 1}. [${x.author.name as string} - ${discord(x.title)}](${x.url}) \`[${x.duration.formatted}]\``).join(`\n`)
        : `No songs in queue.`;

    const sEmbed = new EmbedBuilder()
        .setTitle(`Server Queue`)
        .setDescription(queueStr)
        .setThumbnail(song?.thumbnail ?? null)
        .setFooter({ text: config.footer });

    await interaction.reply({
        embeds: [sEmbed]
    });
};

export {
    cmd,
    run
};
