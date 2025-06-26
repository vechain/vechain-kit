import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { beforeEach, describe, it } from 'mocha';

import { moveBlocks } from '../scripts/helpers/common';
import { getOrDeployContractInstances } from '../scripts/helpers/deploy';
import { deployProxy } from '../scripts/helpers/upgrades';

// Constants for reusable test data
const TEST_NEWS = {
    publisher: {
        title: 'Test News',
        description: 'This is a test news item from publisher',
        image: 'bafybeidfhjnn5u3oozaqgywrm6nvkonqf6rdhutl7movel2ukppxkbtzsi',
        callToActionUrl: 'https://example.com',
    },
    admin: {
        title: 'Admin News',
        description: 'News from app admin',
        image: 'bafybeiakwcqlwv7ald7eq5koqebz2j7jvgagc7x5a3tob65q5ngpkb7czm',
        callToActionUrl: 'https://admin.com',
    },
    creator: {
        title: 'Creator News',
        description: 'News from app creator',
        image: 'bafkreieogjpmzzvflo476ibjw2rsnh23d44yxs5begarfzye63zjatwmci',
        callToActionUrl: 'https://creator.com',
    },
    moderator: {
        title: 'Moderator News',
        description: 'News from app moderator',
        image: 'bafybeifj2iiolbbictbjbomlmcsvfgd3wigyl2stpowzyde3fee6rir4da',
        callToActionUrl: 'https://moderator.com',
    },
    sequence: [
        {
            title: 'News 1',
            description: 'Description 1',
            image: 'bafybeifarnospxp2gyob3chmq4didtlspgipgmpsadcop3jaq4ai7wqfcq',
            callToActionUrl: 'https://news1.com',
        },
        {
            title: 'News 2',
            description: 'Description 2',
            image: 'bafybeif4moiaq727znwoh7ob7v2suldrnox3hpiyrv6fpo34vsuxbpno7e',
            callToActionUrl: 'https://news2.com',
        },
    ],
};

describe('News Contract', function () {
    // Contract instances
    let news: any;
    let x2EarnApps: any;

    // Signers
    let owner: HardhatEthersSigner;
    let publisher: HardhatEthersSigner;
    let moderator: HardhatEthersSigner;
    let pauser: HardhatEthersSigner;
    let upgrader: HardhatEthersSigner;
    let user: HardhatEthersSigner;
    let appCreator: HardhatEthersSigner;
    let appModerator: HardhatEthersSigner;
    let appAdmin: HardhatEthersSigner;
    let vechainKitCustomAppId: string;

    // Test variables
    const cooldownPeriod = 10; // 10 blocks cooldown period
    let appId: string;

    beforeEach(async function () {
        // Get contract instances
        const contractInstances = await getOrDeployContractInstances({
            forceDeploy: true,
        });
        x2EarnApps = contractInstances.x2EarnApps;
        owner = contractInstances.owner;

        // Get additional signers
        const otherAccounts = contractInstances.otherAccounts;
        publisher = otherAccounts[0];
        moderator = otherAccounts[1];
        pauser = otherAccounts[2];
        upgrader = otherAccounts[3];
        user = otherAccounts[4];
        appCreator = otherAccounts[5];
        appModerator = otherAccounts[6];
        appAdmin = otherAccounts[7];

        // Create an app for testing
        const appName = 'TestApp';
        appId = ethers.keccak256(ethers.toUtf8Bytes(appName));

        // Submit the app
        await x2EarnApps
            .connect(owner)
            .submitApp(
                appAdmin.address,
                appAdmin.address,
                appName,
                'ipfs://app-metadata',
            );

        // Endorse the app
        // await endorseApp(appId, appAdmin); TODO: Check if we want to mock x2earn apps and endorsement

        // Set appModerator as a moderator for the app
        await x2EarnApps
            .connect(appAdmin)
            .addAppModerator(appId, appModerator.address);

        // Deploy News contract via proxy
        news = await deployProxy('News', [
            await x2EarnApps.getAddress(),
            cooldownPeriod,
            owner.address,
            upgrader.address,
            pauser.address,
        ]);

        vechainKitCustomAppId = ethers.keccak256(
            ethers.toUtf8Bytes('VeChainKit'),
        );

        // Assign publisher role to the user for a custom app
        await news
            .connect(owner)
            .assignPublisherToCustomApp(
                vechainKitCustomAppId,
                publisher.address,
            );

        // Grant moderator role
        await news
            .connect(owner)
            .grantRole(await news.MODERATOR_ROLE(), moderator.address);
    });

    describe('Initialization', function () {
        it('Should initialize correctly', async function () {
            expect(await news.cooldownPeriod()).to.equal(cooldownPeriod);
            expect(await news.x2EarnApps()).to.equal(
                await x2EarnApps.getAddress(),
            );

            // Check roles
            expect(
                await news.hasRole(
                    await news.DEFAULT_ADMIN_ROLE(),
                    owner.address,
                ),
            ).to.equal(true);

            expect(
                await news.hasRole(await news.PAUSER_ROLE(), pauser.address),
            ).to.equal(true);
            expect(
                await news.hasRole(
                    await news.UPGRADER_ROLE(),
                    upgrader.address,
                ),
            ).to.equal(true);

            expect(
                await news.hasRole(
                    await news.PUBLISHER_ROLE(),
                    publisher.address,
                ),
            ).to.equal(true);

            expect(
                await news.hasRole(
                    await news.MODERATOR_ROLE(),
                    moderator.address,
                ),
            ).to.equal(true);
        });

        it('Should return the correct version', async function () {
            expect(await news.version()).to.equal(1);
        });
    });

    describe('Publishing News', function () {
        it('Publisher can publish news only if they have the PUBLISHER_ROLE and assigned to the app', async function () {
            const { title, description, image, callToActionUrl } =
                TEST_NEWS.publisher;

            const transaction = await news
                .connect(publisher)
                .publish(
                    vechainKitCustomAppId,
                    title,
                    description,
                    image,
                    callToActionUrl,
                );

            // Check event was emitted
            await expect(transaction)
                .to.emit(news, 'NewsPublished')
                .withArgs(
                    0,
                    vechainKitCustomAppId,
                    title,
                    description,
                    image,
                    callToActionUrl,
                    publisher.address,
                );

            // Verify news was stored correctly
            const newsItems = await news.appNewsPaginated(
                vechainKitCustomAppId,
                10,
                1,
            );
            expect(newsItems.length).to.equal(1);
            expect(newsItems[0].title).to.equal(title);
            expect(newsItems[0].description).to.equal(description);
            expect(newsItems[0].image).to.equal(image);
            expect(newsItems[0].callToActionUrl).to.equal(callToActionUrl);
            expect(newsItems[0].publisher).to.equal(publisher.address);
        });

        it('App admin can publish news', async function () {
            const { title, description, image, callToActionUrl } =
                TEST_NEWS.admin;

            await news
                .connect(appAdmin)
                .publish(appId, title, description, image, callToActionUrl);

            const newsItems = await news.appNewsPaginated(appId, 10, 1);
            expect(newsItems.length).to.equal(1);
            expect(newsItems[0].title).to.equal(title);
            expect(newsItems[0].publisher).to.equal(appAdmin.address);
        });

        it('App creator can publish news', async function () {
            // Set appCreator as the app creator in X2EarnApps
            await x2EarnApps
                .connect(appAdmin)
                .addCreator(appId, appCreator.address);

            const { title, description, image, callToActionUrl } =
                TEST_NEWS.creator;

            await news
                .connect(appCreator)
                .publish(appId, title, description, image, callToActionUrl);

            const newsItems = await news.appNewsPaginated(appId, 10, 1);
            expect(newsItems.length).to.equal(1);
            expect(newsItems[0].title).to.equal(title);
            expect(newsItems[0].publisher).to.equal(appCreator.address);
        });

        it('App moderator can publish news', async function () {
            const { title, description, image, callToActionUrl } =
                TEST_NEWS.moderator;

            await news
                .connect(appModerator)
                .publish(appId, title, description, image, callToActionUrl);

            const newsItems = await news.appNewsPaginated(appId, 10, 1);
            expect(newsItems.length).to.equal(1);
            expect(newsItems[0].title).to.equal(title);
            expect(newsItems[0].publisher).to.equal(appModerator.address);
        });

        it('Regular user cannot publish news', async function () {
            const { title, description, image, callToActionUrl } =
                TEST_NEWS.publisher;

            await expect(
                news
                    .connect(user)
                    .publish(appId, title, description, image, callToActionUrl),
            ).to.be.revertedWith('News: not app admin, creator or moderator');
        });

        it('Should respect cooldown period for app publishers', async function () {
            // Publish first news item
            const firstNews = TEST_NEWS.sequence[0];
            await news
                .connect(appAdmin)
                .publish(
                    appId,
                    firstNews.title,
                    firstNews.description,
                    firstNews.image,
                    firstNews.callToActionUrl,
                );

            // Try to publish another news item immediately (should be in cooldown)
            const secondNews = TEST_NEWS.sequence[1];
            await expect(
                news
                    .connect(appAdmin)
                    .publish(
                        appId,
                        secondNews.title,
                        secondNews.description,
                        secondNews.image,
                        secondNews.callToActionUrl,
                    ),
            ).to.be.revertedWith('News: app is in cooldown period');
        });
        it('Publisher cannot publish news if they are not assigned to the app', async function () {
            const { title, description, image, callToActionUrl } =
                TEST_NEWS.publisher;

            await expect(
                news
                    .connect(publisher)
                    .publish(appId, title, description, image, callToActionUrl),
            ).to.be.revertedWith('News: not app admin, creator or moderator');
        });
        it('Publisher cannot publish right after being removed from the app', async function () {
            const { title, description, image, callToActionUrl } =
                TEST_NEWS.publisher;

            await news
                .connect(owner)
                .removePublisherFromCustomApp(publisher.address);

            await expect(
                news
                    .connect(publisher)
                    .publish(appId, title, description, image, callToActionUrl),
            ).to.be.revertedWith('News: not app admin, creator or moderator');
        });
    });

    describe('Reading News', function () {
        beforeEach(async function () {
            // Publish some test news items
            const firstNews = TEST_NEWS.sequence[0];
            await news
                .connect(appAdmin)
                .publish(
                    appId,
                    firstNews.title,
                    firstNews.description,
                    firstNews.image,
                    firstNews.callToActionUrl,
                );

            // Advance some blocks to get past cooldown
            await moveBlocks(cooldownPeriod);

            const secondNews = TEST_NEWS.sequence[1];
            await news
                .connect(appAdmin)
                .publish(
                    appId,
                    secondNews.title,
                    secondNews.description,
                    secondNews.image,
                    secondNews.callToActionUrl,
                );
        });

        it('Should return all news for an app', async function () {
            const newsItems = await news.appNewsPaginated(appId, 10, 1);
            expect(newsItems.length).to.equal(2);
            expect(newsItems[0].title).to.equal(TEST_NEWS.sequence[0].title);
            expect(newsItems[1].title).to.equal(TEST_NEWS.sequence[1].title);
        });

        it('Should return empty array for non-existent app', async function () {
            const nonExistentAppId = ethers.keccak256(
                ethers.toUtf8Bytes('NonExistentApp'),
            );
            await expect(
                news.appNewsPaginated(nonExistentAppId, 10, 1),
            ).to.be.revertedWith('News: no news found');
        });

        it('Should retrieve news item by ID', async function () {
            // Get the news item by ID
            const newsItems = await news.appNewsPaginated(appId, 10, 1);
            const firstNewsId: bigint = newsItems[0].id;

            // Verify we can retrieve it
            const newsItem = await news.getNewsById(Number(firstNewsId));
            expect(newsItem.title).to.equal(TEST_NEWS.sequence[0].title);
            expect(newsItem.description).to.equal(
                TEST_NEWS.sequence[0].description,
            );
        });

        it('Should retrieve latest news item', async function () {
            const newsItem = await news.appLatestNews(appId);
            expect(newsItem.title).to.equal(TEST_NEWS.sequence[1].title);
        });
    });

    describe('MODERATOR - Removing News', function () {
        beforeEach(async function () {
            // Publish some test news items
            const firstNews = TEST_NEWS.sequence[0];
            await news
                .connect(appAdmin)
                .publish(
                    appId,
                    firstNews.title,
                    firstNews.description,
                    firstNews.image,
                    firstNews.callToActionUrl,
                );
        });

        it('Should remove news item by ID', async function () {
            const newsItems = await news.appNewsPaginated(appId, 10, 1);
            const firstNewsId: bigint = newsItems[0].id;

            await news.removeNewsById(Number(firstNewsId));

            await expect(
                news.getNewsById(Number(firstNewsId)),
            ).to.be.revertedWith('News: not found or removed');
        });
    });
});
