const emojiIDs = {
    checkmark: `1049527253765210122`,
    unsure: `1049527255690399794`,
    xmark: `1049527258441850932`
};

const emojis = emojiIDs;
for (const [key, value] of Object.entries(emojis)) {
    emojis[key] = `<:${key}:${value}>`;
}

export {
    emojiIDs,
    emojis
};
