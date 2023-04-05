import config from '../../config/config';

import { EmbedBuilder } from '@discordjs/builders';
import { ChannelType, type Message, type TextChannel } from 'discord.js';

import { discord } from '../utils/standardize';

import { type Client } from '../typings/discord';

export default async (client: Client, message: Message): Promise<void> => {
    if (message.author.bot || message.guild === null || message.channel?.type !== ChannelType.GuildText) return;

    const sEmbed = new EmbedBuilder()
        .setAuthor({ name: discord(message.author.tag), iconURL: message.author.avatarURL() ?? message.author.defaultAvatarURL })
        .setDescription(`**Message sent by <@${message.author.id}> deleted in <#${message.channel.id}>.**\n\n**Content**\n\`\`\`${message.content}\`\`\``)
        .setTimestamp()
        .setFooter({ text: config.footer });

    const logChannel = await client.channels.fetch(`602900064184172554`) as TextChannel;
    await logChannel?.send({ embeds: [sEmbed] });
};