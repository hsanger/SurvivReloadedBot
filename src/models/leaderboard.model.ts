import Mongoose, { Schema } from 'mongoose';

import { type LeaderboardDoc } from '../typings/models';

const leaderboardSchema = new Schema({
    created: { type: Date, required: true },
    xp: { type: Array, required: true }
});

const Leaderboard = Mongoose.model<LeaderboardDoc>(`Leaderboard`, leaderboardSchema);

export default Leaderboard;
