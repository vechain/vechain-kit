import tseslint from 'typescript-eslint';

export default tseslint.config({
    ignores: ['**/*.config.ts', 'dist/**'],
    extends: [...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        'no-console': ['error', { allow: ['error'] }],
        'eslint-comments/no-unused-disable': 'off',
        'react/no-array-index-key': 'warn',
        'react/display-name': 'off',
        'import/no-anonymous-default-export': 'off',
        'react/no-children-prop': 'warn',
        'react/no-unescaped-entities': 'warn',
        'react/jsx-no-literals': 'error',
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
            },
        ],
        'no-duplicate-imports': 'error',
    },
});
