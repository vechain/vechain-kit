import tseslint from 'typescript-eslint';

export default tseslint.config(
    // Global ignores configuration
    {
        ignores: [
            '**/*.config.ts',
            'dist/**',
            'src/contracts/typechain-types/**',
        ],
    },
    // Main configuration
    {
        extends: [...tseslint.configs.recommended],
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            'no-console': ['error', { allow: ['error', 'info', 'warn'] }],
            'eslint-comments/no-unused-disable': 'off',
            'import/no-anonymous-default-export': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                },
            ],
        },
    },
);
