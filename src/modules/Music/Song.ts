import ytsr, { type Video } from 'youtube-sr';
import log from '../../utils/log';

class Song {
    state: `INITIALIZED` | `LOADED`;

    title: string;
    url: string;
    duration: {
        length: number
        formatted: string
    };

    author: {
        name: string | undefined
        iconURL: string | undefined
    };

    thumbnail: string | undefined;

    /**
     * Initialize the song object.
     */
    constructor () {
        this.state = `INITIALIZED`;
    }

    /**
     * Initialize song metadata.
     * @param video The video chosen.
     */
    setParams = (video: Video): void => {
        this.state = `LOADED`;

        this.title = video.title as string;
        this.url = video.url;

        this.duration = {
            length: video.duration,
            formatted: video.durationFormatted
        };

        this.author = {
            name: video.channel?.name,
            iconURL: video.channel?.iconURL()
        };

        this.thumbnail = video.thumbnail?.url;
    };

    /**
     * Pick a song by searching YouTube.
     * @param searchQuery The search query for the song.
     */
    pickFromSearch = async (searchQuery: string): Promise<void> => {
        const video = await ytsr.searchOne(searchQuery);
        this.setParams(video);
    };

    /**
     * Pick a song from its URL.
     * @param url The URL to pick the song from.
     */
    setFromURL = async (url: string): Promise<void> => {
        await ytsr.getVideo(url).then(video => {
            this.setParams(video);
        }).catch(() => { log(`red`, `Invalid video entered.`); });
    };
}

export default Song;
