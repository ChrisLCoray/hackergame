export const GameData = {
    charsPerLine: 20,
    defaultUserData: { score: 0, stats: { 4: [0, 0], 5: [0, 0], 6: [0, 0], 7: [0, 0] } },
    difficulties: [
        { letters: 4, name: 'Novice' },
        { letters: 5, name: 'Advanced' },
        { letters: 6, name: 'Expert' },
        { letters: 7, name: 'Master' },
    ],
    gameTimerDefault: 120,
    junkCharacters: ['!', '@', '#', '$', '¥', '€', '%', '^', '&', '*', '-', '_', '|', ';', '{', '}', '?', '⟪', '⟫', '※', '¿'],
    maxTries: 4,
    maxWords: 20,
    powerUpsData: [
        { type: 0, actionText: 'Dud Removed' },
        { type: 1, actionText: 'Tries Reset' }
    ],
    powerUpsPer: {
        0: 3,
        1: 1
    },
    userDataStore: 'userData',
}
