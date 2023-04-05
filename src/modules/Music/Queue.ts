import config from '../../../config/config';
import client from '../..';

import {
    type ChatInputCommandInteraction,
    type Snowflake,
    type TextBasedChannel,
    type VoiceBasedChannel
} from 'discord.js';
import {
    type AudioPlayer,
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    type VoiceConnection,
    VoiceConnectionStatus
} from '@discordjs/voice';
import { EmbedBuilder } from '@discordjs/builders';

import ytdl from 'ytdl-core';

import type Song from './Song';

import log from '../../utils/log';
import { discord } from '../../utils/standardize';

class Queue {
    id: Snowflake;
    state: `PLAYING` | `PAUSED`;

    commandChannel: TextBasedChannel | null;
    channel: VoiceBasedChannel | null;
    connection: VoiceConnection | null;
    player: AudioPlayer | null;

    songs: Song[];
    history: Song[];

    nowPlaying: Song | null;
    historyID: number;

    /**
     * Create a guild Queue.
     * @param id The ID of the guild.
     */
    constructor (id: Snowflake) {
        this.id = id;
        this.state = `PLAYING`;

        this.commandChannel = null;
        this.channel = null;
        this.connection = null;
        this.player = null;

        this.songs = [];
        this.history = [];

        this.nowPlaying = null;
        this.historyID = 0;
    }

    /**
     * Join a voice channel.
     * @param channel The channel to join.
     */
    joinChannel = (interaction: ChatInputCommandInteraction, channel: VoiceBasedChannel): void => {
        this.channel = channel;
        this.commandChannel = interaction.channel;

        this.connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });

        /**
         * Workaround for Discord API changes.
         */
        this.connection.on(`stateChange`, (oldState, newState) => {
            if (oldState.status === VoiceConnectionStatus.Ready && newState.status === VoiceConnectionStatus.Connecting) this.connection?.configureNetworking();

            const oldNetworking = Reflect.get(oldState, `networking`);
            const newNetworking = Reflect.get(newState, `networking`);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const networkStateChangeHandler = (oldNetworkState: any, newNetworkState: any): void => {
                const newUdp = Reflect.get(newNetworkState, `udp`);
                clearInterval(newUdp?.keepAliveInterval);
            };

            oldNetworking?.off(`stateChange`, networkStateChangeHandler);
            newNetworking?.on(`stateChange`, networkStateChangeHandler);
        });

        this.player = createAudioPlayer();
        this.connection.subscribe(this.player);

        this.player.on(AudioPlayerStatus.Idle, () => {
            if (this.songs.length > 0) {
                const song = this.songs.shift() as Song;
                this.playSong(song);
            } else {
                this.nowPlaying = null;
                this.destroy();
            }
        });

        this.player.on(`error`, () => {
            log(`red`, `There was an error playing an audio file.`);
        });
    };

    /**
     * Leave the voice channel.
     */
    leaveChannel = (): void => {
        this.connection?.destroy();
    };

    /**
     * Add a song to the queue.
     * @param song The song to add.
     */
    addSong = (song: Song): void => {
        this.songs.push(song);
        this.history.push(song);

        if (this.state === `PLAYING` && this.nowPlaying === null) {
            this.songs.shift();
            this.playSong(song);
        }
    };

    /**
     * Play a song in the voice channel.
     * @param song The song to play.
     */
    playSong = (song: Song): void => {
        if (this.commandChannel === null || this.channel === null || this.connection === null || this.player === null) return;
        const res = ytdl(song.url, {
            filter: `audioonly`,
            highWaterMark: 1 << 62,
            liveBuffer: 1 << 62,
            dlChunkSize: 0,
            quality: `lowestaudio`
        });

        if (res !== undefined) {
            const resource = createAudioResource(res);
            this.nowPlaying = song;

            this.player.play(resource);
            this.historyID++;

            const sEmbed = new EmbedBuilder()
                .setTitle(`Now Playing`)
                .setAuthor({ name: song.author.name ?? ``, iconURL: song.author.iconURL })
                .setDescription(`[${discord(song.title)}](${song.url}) \`[${song.duration.formatted}]\``)
                .setThumbnail(song.thumbnail ?? null)
                .setFooter({ text: config.footer });

            void this.commandChannel.send({ embeds: [sEmbed] });
        }
    };

    private readonly destroy = (): void => {
        this.leaveChannel();
        client.queue?.delete(this.id);
    };
}

export default Queue;
