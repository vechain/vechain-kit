import tseslint from 'typescript-eslint';

export default tseslint.config({
    ignores: ['**/*.config.ts', 'dist/**'],
    plugins: ['@typescript-eslint', 'react-hooks'],
    files: ['**/*.{ts,tsx}'],
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'no-console': ['error', { allow: ['error'] }],
        'eslint-comments/no-unused-disable': 'off',
        'react/no-array-index-key': 'warn',
        '@typescript-eslint/no-unused-vars': [
            'error',
            { argsIgnorePattern: '^_' },
        ],
        'no-duplicate-imports': 'error',
    },
});
