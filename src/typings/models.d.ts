import type Mongoose from 'mongoose';

interface UserDoc extends Mongoose.Document {
    created: Date
    discordID: string

    banned: boolean

    balance: number
    level: number
    xp: number

    spot: number

    cooldowns: Record<`xp`, number>
}

interface LBUser {
    discordID: string
    discordTag: string

    balance: number
    level: number
    xp: number
}

interface LeaderboardDoc extends Mongoose.Document {
    created: Date
    xp: LBUser[]
}

export type {
    UserDoc,
    LBUser,
    LeaderboardDoc
};
