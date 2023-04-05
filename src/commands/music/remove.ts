import config from '../../../config/config';

import { EmbedBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { type ChatInputCommandInteraction } from 'discord.js';

import { discord } from '../../utils/standardize';

import { type Client } from '../../typings/discord';

const cmd: SlashCommandBuilder = new SlashCommandBuilder()
    .setName(`remove`)
    .addNumberOption(option => option.setName(`id`).setDescription(`The position of the song in the queue.`).setMinValue(1).setRequired(true))
    .setDescription(`Remove a song.`);

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

    const songID = interaction.options.getNumber(`id`, true);
    if (songID > queue.history.length || songID < queue.historyID) {
        await interaction.followUp({ content: `That song does not exist!`, ephemeral: true });
        return;
    }

    if (songID === queue.historyID) {
        await interaction.followUp({ content: `Please use \`/skip\` to skip the current song!`, ephemeral: true });
        return;
    }

    const song = queue.history[songID - 1];
    const songIndex = queue.songs.indexOf(song);
    if (songIndex === -1) {
        await interaction.followUp({
            content: song !== undefined
                ? `That song has already been played!`
                : `That song does not exist!`,
            ephemeral: true
        });
        return;
    }

    queue.songs.splice(songIndex, 1);
    queue.history.splice(songID - 1, 1);

    const sEmbed = new EmbedBuilder()
        .setTitle(`Removed Song`)
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
