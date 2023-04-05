import config from '../../../config/config';

import { EmbedBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { type ChatInputCommandInteraction } from 'discord.js';

import { type Client } from '../../typings/discord';

const cmd: SlashCommandBuilder = new SlashCommandBuilder()
    .setName(`leave`)
    .setDescription(`Leave the voice channel.`);

const run = async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
    if (interaction.guild === null) return;

    const queue = client.queue?.get(interaction.guild.id);
    if (queue === undefined || queue.channel === null) {
        await interaction.reply({ content: `I am not currently in a voice channel!`, ephemeral: true });
        return;
    }

    const voiceChannel = (await interaction.guild.members.fetch(interaction.user.id)).voice.channel;
    if (voiceChannel === null) {
        await interaction.reply({ content: `You must join a voice channel to run that command!`, ephemeral: true });
        return;
    }

    queue.leaveChannel();
    client.queue?.delete(interaction.guild.id);

    const sEmbed = new EmbedBuilder()
        .setAuthor({ name: `Left Voice Channel`, iconURL: interaction.guild.iconURL() ?? undefined })
        .setDescription(`Requested by ${interaction.user.tag}`)
        .setFooter({ text: config.footer });

    await interaction.reply({
        embeds: [sEmbed]
    });
};

export {
    cmd,
    run
};
