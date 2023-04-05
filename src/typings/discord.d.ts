import { type SlashCommandBuilder } from '@discordjs/builders';
import { type Client as DCClient, type ChatInputCommandInteraction, type Snowflake } from 'discord.js';

import type Queue from '../modules/Music/Queue';

interface Command {
    cmd: SlashCommandBuilder
    run: (client: DCClient, interaction: ChatInputCommandInteraction) => void
}

interface Event {
    callback: (...any) => void
}

interface Client extends DCClient {
    commands?: Map<string, Command>
    events?: Map<string, Event>
    queue?: Map<Snowflake, Queue>
}

export type {
    Client,
    Command,
    Event
};
