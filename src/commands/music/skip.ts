import config from '../../../config/config';

import { EmbedBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { type ChatInputCommandInteraction } from 'discord.js';

import { discord } from '../../utils/standardize';

import { type Client } from '../../typings/discord';

const cmd: SlashCommandBuilder = new SlashCommandBuilder()
    .setName(`skip`)
    .setDescription(`Skip the current song.`);

const run = async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
    if (interaction.guild === null) return;

    const queue = client.queue?.get(interaction.guild.id);
    if (queue === undefined) return;

    const voiceChannel = (await interaction.guild.members.fetch(interaction.user.id)).voice.channel;
    if (voiceChannel === null) {
        await interaction.reply({ content: `You must join a voice channel to run that command!`, ephemeral: true });
        return;
    }

    await interaction.deferReply();

    const song = queue.nowPlaying;
    if (song === null) {
        await interaction.followUp({ content: `No song is currently being played!`, ephemeral: true });
        return;
    }

    queue.player?.stop();

    const sEmbed = new EmbedBuilder()
        .setTitle(`Skipped Song`)
        .setAuthor({ name: song.author.name ?? ``, iconURL: song.author.iconURL, url: song.url })
        .setDescription(`[${discord(song.title)}](${song.url}) \`[${song.duration.formatted}]\``)
        .setThumbnail(song.thumbnail ?? null)
        .setFooter({ text: config.footer });

    await interaction.followUp({
        embeds: [sEmbed]
    });
};

export {
    cmd,
    run
};
