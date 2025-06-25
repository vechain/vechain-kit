export const gmNfts = [
    {
        level: '1',
        name: 'Earth',
        image: '/images/nft-levels/0.png',
        multiplier: 1,
        b3trToUpgrade: 0,
    },
    {
        level: '2',
        name: 'Moon',
        image: '/images/nft-levels/1.png',
        multiplier: 1.1,
        b3trToUpgrade: 10_000,
    },
    {
        level: '3',
        name: 'Mercury',
        image: '/images/nft-levels/2.png',
        multiplier: 1.2,
        b3trToUpgrade: 25_000,
    },
    {
        level: '4',
        name: 'Venus',
        image: '/images/nft-levels/3.png',
        multiplier: 1.5,
        b3trToUpgrade: 50_000,
    },
    {
        level: '5',
        name: 'Mars',
        image: '/images/nft-levels/4.png',
        multiplier: 2,
        b3trToUpgrade: 100_000,
    },
    {
        level: '6',
        name: 'Jupiter',
        image: '/images/nft-levels/5.png',
        multiplier: 2.5,
        b3trToUpgrade: 250_000,
    },
    {
        level: '7',
        name: 'Saturn',
        image: '/images/nft-levels/6.png',
        multiplier: 3,
        b3trToUpgrade: 500_000,
    },
    {
        level: '8',
        name: 'Uranus',
        image: '/images/nft-levels/7.png',
        multiplier: 5,
        b3trToUpgrade: 2_500_000,
    },
    {
        level: '9',
        name: 'Neptune',
        image: '/images/nft-levels/8.png',
        multiplier: 10,
        b3trToUpgrade: 5_000_000,
    },
    {
        level: '10',
        name: 'Galaxy',
        image: '/images/nft-levels/9.png',
        multiplier: 25,
        b3trToUpgrade: 25_000_000,
    },
];

/**
 * Maps the XNode level to the GM starting level.
 */
export const xNodeToGMstartingLevel: Record<number, number> = {
    1: 2,
    2: 4,
    3: 6,
    4: 2,
    5: 4,
    6: 6,
    7: 7,
};
