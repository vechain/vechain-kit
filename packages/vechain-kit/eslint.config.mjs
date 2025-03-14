import tseslint from 'typescript-eslint';

export default tseslint.config({
    ignores: ['**/*.config.ts', 'dist/**', 'src/contracts/typechain-types.ts'],
    extends: [...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'no-console': ['error', { allow: ['error', 'info', 'warn', 'log'] }],
        'eslint-comments/no-unused-disable': 'off',
        'import/no-anonymous-default-export': 'off',
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
            },
        ],
    },
});
