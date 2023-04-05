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
    .setName(`rules`)
    .setDescription(`View the server rules.`);

const run = async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
    if (interaction.guild === null || interaction.guild.rulesChannel === null) return;

    const sEmbed = new EmbedBuilder()
        .setColor(config.colors.blue)
        .setAuthor({ name: `Server Rules`, iconURL: interaction.guild?.iconURL() ?? undefined })
        .setImage(`https://i.kym-cdn.com/entries/icons/original/000/033/153/therules.jpg`)
        .setDescription(`View our rules.`)
        .setTimestamp()
        .setFooter({ text: config.footer });

    const sRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setURL(`https://discord.com/channels/${interaction.guild.id}/${interaction.guild.rulesChannel.id}`)
            .setLabel(`Rules`)
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
