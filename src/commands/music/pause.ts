import config from '../../../config/config';

import { EmbedBuilder, SlashCommandBuilder } from '@discordjs/builders';
import { type ChatInputCommandInteraction } from 'discord.js';

import { type Client } from '../../typings/discord';

const cmd: SlashCommandBuilder = new SlashCommandBuilder()
    .setName(`pause`)
    .setDescription(`Pause the player.`);

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

    if (queue.state === `PAUSED`) {
        await interaction.followUp({ content: `The player is currently paused!`, ephemeral: true });
        return;
    }

    queue.player?.pause();
    queue.state = `PAUSED`;

    const sEmbed = new EmbedBuilder()
        .setTitle(`Paused Player`)
        .setDescription(`Requested by ${interaction.user.tag}`)
        .setFooter({ text: config.footer });

    await interaction.followUp({
        embeds: [sEmbed]
    });
};

export {
    cmd,
    run
};
