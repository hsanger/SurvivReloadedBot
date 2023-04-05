const calculateMaxExp = (level: number): number => {
    return Math.floor((100 * Math.E * level) / 2);
};

export {
    calculateMaxExp
};
