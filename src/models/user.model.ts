import Mongoose, { Schema } from 'mongoose';

import { type UserDoc } from '../typings/models';

const userSchema = new Schema({
    created: { type: Date, required: true },
    discordID: { type: String, required: true, unique: true },

    banned: { type: Boolean, required: false, default: false },

    balance: { type: Number, required: false, default: 0 },
    level: { type: Number, required: false, default: 0 },
    xp: { type: Number, required: false, default: 0 },

    spot: { type: Number, required: false, default: 0 },

    cooldowns: {
        xp: { type: Number, required: false, default: 0 }
    }
});

const User = Mongoose.model<UserDoc>(`User`, userSchema);

export default User;
