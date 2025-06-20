'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { VeChainKitProvider, WalletButton } from '@vechain/vechain-kit';

export default function ImageUploadApp() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [imageInfo, setImageInfo] = useState<{
        name: string;
        size: string;
        type: string;
    } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setUploadedImage(url);
            setImageInfo({
                name: file.name,
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                type: file.type,
            });
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const clearImage = () => {
        if (uploadedImage) {
            URL.revokeObjectURL(uploadedImage);
        }
        setUploadedImage(null);
        setImageInfo(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <VeChainKitProvider
            feeDelegation={{
                delegatorUrl: process.env.NEXT_PUBLIC_DELEGATOR_URL!,
                delegateAllTransactions: false,
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
                // { method: 'email', gridColumn: 4 },
                // { method: 'google', gridColumn: 4 },
                { method: 'vechain', gridColumn: 4 },
                { method: 'dappkit', gridColumn: 4 },
                { method: 'ecosystem', gridColumn: 4 },
                // { method: 'passkey', gridColumn: 1 },
                // { method: 'more', gridColumn: 1 },
            ]}
            loginModalUI={{
                description:
                    'Choose between social login through VeChain or by connecting your wallet.',
            }}
            darkMode={false}
            language={'en'}
            network={{
                type: process.env.NEXT_PUBLIC_NETWORK_TYPE! as 'test',
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
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Image Upload Demo
                        </h1>
                        <p className="text-gray-600">
                            Test Tailwind CSS with vechain-kit integration
                        </p>

                        {/* vechain-kit Integration Test */}
                        <div className="flex justify-center gap-4 items-center mb-4">
                            <WalletButton />
                            <span className="text-sm text-gray-500">
                                ← vechain-kit component
                            </span>
                        </div>

                        {/* Link to style test */}
                        <div className="text-center">
                            <a
                                href="/style-test"
                                className="text-blue-600 hover:text-blue-700 underline text-sm"
                            >
                                View comprehensive style test →
                            </a>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-2xl mx-auto">
                        {/* Upload Area */}
                        <div
                            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
              ${
                  isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
              }
            `}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                        >
                            <div className="space-y-4">
                                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-8 h-8 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                        />
                                    </svg>
                                </div>

                                <div>
                                    <p className="text-lg font-semibold text-gray-900">
                                        Drop your image here
                                    </p>
                                    <p className="text-gray-500">or</p>
                                </div>

                                <button
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                                >
                                    Choose File
                                </button>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />

                                <p className="text-sm text-gray-400">
                                    Supports: JPG, PNG, GIF, WebP
                                </p>
                            </div>
                        </div>

                        {/* Image Preview */}
                        {uploadedImage && (
                            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Preview
                                    </h3>
                                    <button
                                        onClick={clearImage}
                                        className="text-red-600 hover:text-red-700 font-medium"
                                    >
                                        Clear
                                    </button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden border-4 border-purple-500">
                                            <Image
                                                src={uploadedImage}
                                                alt="Uploaded preview"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h4 className="font-medium text-gray-900">
                                            File Info
                                        </h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Name:
                                                </span>
                                                <span className="font-medium text-gray-900 truncate ml-2">
                                                    {imageInfo?.name}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Size:
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {imageInfo?.size}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Type:
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {imageInfo?.type}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                                                Save to Gallery
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Feature Cards */}
                        <div className="grid md:grid-cols-3 gap-4 mt-8">
                            <div className="bg-white rounded-lg p-4 shadow-md">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                                    <svg
                                        className="w-5 h-5 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Drag & Drop
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Easy file upload with drag and drop support
                                </p>
                            </div>

                            <div className="bg-white rounded-lg p-4 shadow-md">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                                    <svg
                                        className="w-5 h-5 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Fast Preview
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Instant image preview and file information
                                </p>
                            </div>

                            <div className="bg-white rounded-lg p-4 shadow-md">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                                    <svg
                                        className="w-5 h-5 text-purple-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-1">
                                    Multiple Formats
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Support for JPG, PNG, GIF, and WebP
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </VeChainKitProvider>
    );
}
