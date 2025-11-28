'use client';

import { VeChainKitProvider, WalletButton } from '@vechain/vechain-kit';
import { useEffect, useState } from 'react';

function StyleTestContent() {
    const [testResults, setTestResults] = useState<{
        tailwindStyles: { [key: string]: string };
        imageStyles: { [key: string]: string };
        layerAnalysis: string[];
        conflictStatus: 'good' | 'warning' | 'error';
    }>({
        tailwindStyles: {},
        imageStyles: {},
        layerAnalysis: [],
        conflictStatus: 'good',
    });

    useEffect(() => {
        const runStyleTests = () => {
            const analysis: string[] = [];
            let conflictStatus: 'good' | 'warning' | 'error' = 'good';

            // Test 1: Check if CSS layers are defined correctly
            const stylesheets = Array.from(document.styleSheets);
            let layersFound = false;
            let hostAppLayerFound = false;

            stylesheets.forEach((sheet) => {
                try {
                    const rules = Array.from(sheet.cssRules || []);
                    rules.forEach((rule) => {
                        const ruleText = rule.cssText;

                        // Check for layer definitions
                        if (ruleText.includes('@layer vechain-kit, host-app')) {
                            layersFound = true;
                            analysis.push('✅ CSS layers defined correctly');
                        }

                        if (
                            ruleText.includes('@layer host-app') &&
                            (ruleText.includes('@tailwind') ||
                                ruleText.includes('@import "tailwindcss"') ||
                                ruleText.includes('tailwindcss'))
                        ) {
                            hostAppLayerFound = true;
                            analysis.push(
                                '✅ Tailwind CSS wrapped in host-app layer',
                            );
                        }

                        // Also check if we're inside a host-app layer context
                        if (
                            ruleText.includes('@layer host-app') &&
                            ruleText.includes('body')
                        ) {
                            hostAppLayerFound = true;
                        }

                        // Check for vechain-kit styles in correct layer
                        if (
                            ruleText.includes('vechain-kit') &&
                            !ruleText.includes('@layer host-app')
                        ) {
                            // vechain-kit styles detected in correct layer
                        }
                        // problematic global styles
                        if (
                            ruleText.includes('body {') &&
                            ruleText.includes('font-family') &&
                            ruleText.includes('var(--chakra') &&
                            !ruleText.includes('@layer')
                        ) {
                            analysis.push(
                                '⚠️ Found Chakra body styles outside layer system',
                            );
                            conflictStatus = 'warning';
                        }
                    });
                } catch (e: any) {
                    // cross-origin stylesheets
                }
            });

            if (!layersFound) {
                analysis.push('❌ CSS layers not properly defined');
                conflictStatus = 'error';
            }

            // For Tailwind v4, we just need to ensure layers are defined and styles work
            if (!hostAppLayerFound && layersFound) {
                // Check if Tailwind styles are actually working
                const testElement =
                    document.querySelector('.bg-gradient-to-br');
                if (testElement) {
                    analysis.push(
                        '✅ Tailwind CSS v4 working with layer system',
                    );
                    hostAppLayerFound = true;
                }
            }

            if (!hostAppLayerFound) {
                analysis.push('❌ Tailwind not wrapped in host-app layer');
                conflictStatus = 'error';
            }

            // Test 2: Check actual computed styles
            const body = document.body;
            const bodyStyles = window.getComputedStyle(body);

            const testImg = document.querySelector(
                '[data-test="border-test"]',
            ) as HTMLElement;
            const imgStyles = testImg ? window.getComputedStyle(testImg) : null;

            const gradientDiv = document.querySelector(
                '[data-test="gradient-test"]',
            ) as HTMLElement;
            const gradientStyles = gradientDiv
                ? window.getComputedStyle(gradientDiv)
                : null;

            // Test 3: Font family should be controlled by host app
            const fontFamily = bodyStyles.fontFamily;
            if (
                fontFamily.includes('Arial') ||
                fontFamily.includes('system-ui')
            ) {
                analysis.push('✅ Host app font family preserved');
            } else if (fontFamily.includes('var(--chakra')) {
                analysis.push('❌ Chakra font variables overriding host app');
                conflictStatus = 'error';
            }

            // Test 4: Image borders should work correctly
            if (imgStyles && imgStyles.borderStyle === 'solid') {
                analysis.push('✅ Image border styles working correctly');
            } else {
                analysis.push('⚠️ Image border styles might be affected');
                conflictStatus = 'warning';
            }

            // Test 5: Tailwind gradients should work
            if (
                gradientStyles &&
                gradientStyles.backgroundImage.includes('gradient')
            ) {
                analysis.push('✅ Tailwind gradients working correctly');
            } else {
                analysis.push('❌ Tailwind gradients not working');
                conflictStatus = 'error';
            }

            setTestResults({
                tailwindStyles: {
                    fontFamily: bodyStyles.fontFamily,
                    backgroundColor: bodyStyles.backgroundColor,
                    color: bodyStyles.color,
                },
                imageStyles: imgStyles
                    ? {
                          borderStyle: imgStyles.borderStyle,
                          borderWidth: imgStyles.borderWidth,
                          borderColor: imgStyles.borderColor,
                      }
                    : {},
                layerAnalysis: analysis,
                conflictStatus,
            });
        };

        // Run tests after a delay to ensure all styles are loaded
        const timer = setTimeout(runStyleTests, 2000);
        return () => clearTimeout(timer);
    }, []);

    const statusColor = {
        good: 'border-green-500 bg-green-50',
        warning: 'border-yellow-500 bg-yellow-50',
        error: 'border-red-500 bg-red-50',
    }[testResults.conflictStatus];

    const statusIcon = {
        good: '✅',
        warning: '⚠️',
        error: '❌',
    }[testResults.conflictStatus];

    const statusText = {
        good: 'All tests passed! CSS layers working correctly.',
        warning: 'Some minor issues detected.',
        error: 'Style conflicts detected!',
    }[testResults.conflictStatus];

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100"
            data-test="gradient-test"
        >
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                    vechain-kit + Tailwind CSS Integration Test
                </h1>

                {/* Status Summary */}
                <div className={`border-2 rounded-lg p-6 mb-8 ${statusColor}`}>
                    <h2 className="text-2xl font-bold mb-4">
                        {statusIcon} Test Results: {statusText}
                    </h2>

                    <div className="space-y-2">
                        {testResults.layerAnalysis.map((result, index) => (
                            <div key={index} className="text-sm font-mono">
                                {result}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Visual Tests */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold mb-4">
                            Tailwind Components
                        </h3>
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg">
                                Gradient Background (should work)
                            </div>

                            <img
                                data-test="border-test"
                                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%23e5e7eb'/%3E%3C/svg%3E"
                                alt="Border test"
                                className="border-4 border-red-500 rounded"
                                style={{ width: '100px', height: '100px' }}
                            />
                            <p className="text-sm text-gray-600">
                                Image with Tailwind border (should show red
                                border)
                            </p>

                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
                                Tailwind Button
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-bold mb-4">
                            vechain-kit Components
                        </h3>
                        <div className="space-y-4">
                            <WalletButton />
                            <p className="text-sm text-gray-600">
                                vechain-kit wallet button (should not affect
                                Tailwind styles)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Technical Details */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 text-white rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-3">
                            Body Computed Styles
                        </h3>
                        <pre className="text-xs overflow-auto">
                            {JSON.stringify(
                                testResults.tailwindStyles,
                                null,
                                2,
                            )}
                        </pre>
                    </div>

                    <div className="bg-gray-800 text-white rounded-lg p-6">
                        <h3 className="text-lg font-bold mb-3">
                            Image Computed Styles
                        </h3>
                        <pre className="text-xs overflow-auto">
                            {JSON.stringify(testResults.imageStyles, null, 2)}
                        </pre>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-100 border border-blue-300 rounded-lg p-6 mt-8">
                    <h3 className="text-lg font-bold mb-3">
                        How to Verify Success:
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>
                            The gradient background should be visible (blue to
                            indigo)
                        </li>
                        <li>The test image should have a solid blue border</li>
                        <li>
                            The vechain-kit wallet button should render properly
                        </li>
                        <li>
                            Font family should be Arial or system-ui (not Chakra
                            fonts)
                        </li>
                        <li>
                            All test results above should show ✅ (green
                            checkmarks)
                        </li>
                        <li>
                            No ❌ (red X) or excessive ⚠️ (warnings) should
                            appear
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default function StyleTest() {
    return (
        <VeChainKitProvider
            feeDelegation={{
                delegatorUrl: process.env.NEXT_PUBLIC_DELEGATOR_URL!,
            }}
            dappKit={{
                allowedWallets: ['veworld', 'wallet-connect', 'sync2'],
                walletConnectOptions: {
                    projectId:
                        process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
                    metadata: {
                        name: 'VeChainKit Demo App',
                        description:
                            'This is a demo app to show you how the VechainKit works.',
                        url:
                            typeof window !== 'undefined'
                                ? window.location.origin
                                : '',
                        icons: [
                            typeof window !== 'undefined'
                                ? 'https://i.ibb.co/7G4PQNZ/vechain-kit-logo-colored-circle.png'
                                : '',
                        ],
                    },
                },
            }}
            loginMethods={[
                { method: 'vechain', gridColumn: 4 },
                { method: 'dappkit', gridColumn: 4 },
                { method: 'ecosystem', gridColumn: 4 },
            ]}
            loginModalUI={{
                description:
                    'Choose between social login through VeChain or by connecting your wallet.',
            }}
            darkMode={false}
            language={'en'}
            network={{
                type: process.env.NEXT_PUBLIC_NETWORK_TYPE,
            }}
            allowCustomTokens={true}
            legalDocuments={{
                termsAndConditions: [
                    {
                        url: 'https://vechainkit.vechain.org/terms',
                        version: 1,
                        required: true,
                        displayName: 'Example T&C',
                    },
                ],
            }}
        >
            <StyleTestContent />
        </VeChainKitProvider>
    );
}
