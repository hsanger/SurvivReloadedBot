import config from '../../../config/config';

import { SlashCommandBuilder } from '@discordjs/builders';
import { type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

import User from '../../models/user.model';
import Leaderboard from '../../models/leaderboard.model';

import { discord } from '../../utils/standardize';

import { type Client } from '../../typings/discord';

const cmd: SlashCommandBuilder = new SlashCommandBuilder()
    .setName(`leaderboard`)
    .setDescription(`View the global leaderboard.`);

const run = async (client: Client, interaction: ChatInputCommandInteraction): Promise<void> => {
    const lb = await Leaderboard.findOne({});
    if (lb === null) {
        await interaction.reply({ content: `There was an error running that command. Please notify a developer.`, ephemeral: true });
        return;
    }

    const lbArray = lb.xp;

    let lbTxt = ``;
    for (let i = 0; i < (lbArray.length < 10 ? lbArray.length : 10); i++) lbTxt += `${i === 0 ? `🥇` : i === 1 ? `🥈` : i === 2 ? `🥉` : `🏅`} **${discord(lbArray[i].discordTag)}** - Level ${lbArray[i].level}\n`;

    const dbUser = await User.findOne({ discordID: interaction.user.id });
    const lbUser = lbArray.find(u => u.discordID === interaction.user.id);

    if (dbUser !== null && dbUser.spot > 10) lbTxt += `---\n#${dbUser.spot} - **${discord(interaction.user.tag)}** - Level ${lbUser?.level ?? dbUser.level}\n`;

    const sEmbed = new EmbedBuilder()
        .setColor(config.colors.blue)
        .setAuthor({ name: `Server Leaderboard`, iconURL: ((interaction.guild?.iconURL() as unknown) as string) })
        .setDescription(lbTxt === `` ? `The leaderboard is currently empty.` : lbTxt)
        .setTimestamp()
        .setFooter({ text: config.footer });

    await interaction.reply({ embeds: [sEmbed] });
};

export {
    cmd,
    run
};
