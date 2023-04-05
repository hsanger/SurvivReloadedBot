import config from '../../../config/config';

import { EmbedBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { type ChatInputCommandInteraction } from 'discord.js';

import Song from '../../modules/Music/Song';

import { discord } from '../../utils/standardize';

import { type Client } from '../../typings/discord';

const cmd: SlashCommandBuilder = new SlashCommandBuilder()
    .setName(`play`)
    .addStringOption(option => option.setName(`name`).setDescription(`The name of the song.`).setRequired(true))
    .setDescription(`Play a song.`);

const run = async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
    if (interaction.guild === null) return;

    const queue = client.queue?.get(interaction.guild.id);
    if (queue === undefined) return;

    const voiceChannel = (await interaction.guild.members.fetch(interaction.user.id)).voice.channel;
    if (voiceChannel === null) {
        await interaction.reply({ content: `You must join a voice channel to run that command!`, ephemeral: true });
        return;
    }

    const song = new Song();
    const songInput = interaction.options.getString(`name`, true);

    await interaction.deferReply();

    if (songInput.startsWith(`https://`)) await song.setFromURL(songInput);
    else await song.pickFromSearch(songInput);

    if (song.state === `INITIALIZED`) {
        await interaction.followUp({ content: `An error occurred trying to process that song.`, ephemeral: true });
        return;
    }

    if (queue.connection === null) queue.joinChannel(interaction, voiceChannel);
    queue.addSong(song);

    const sEmbed = new EmbedBuilder()
        .setTitle(`Added to Queue`)
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
