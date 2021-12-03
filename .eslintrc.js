/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

const prettierOptions = JSON.parse(fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8'));

module.exports = {
    parser: '@typescript-eslint/parser',
    extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended'],
    plugins: ['prettier', 'react', 'react-hooks', 'jsx-a11y', '@typescript-eslint'],
    env: {
        node: true,
        es2021: true,
    },
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
    rules: {
        'prettier/prettier': ['error', prettierOptions],
        'arrow-body-style': [2, 'as-needed'],
        'class-methods-use-this': 0,
        'import/imports-first': 0,
        'import/newline-after-import': 0,
        'import/no-dynamic-require': 0,
        'import/no-extraneous-dependencies': 0,
        'import/no-named-as-default': 0,
        'import/no-unresolved': 2,
        'import/no-webpack-loader-syntax': 0,
        'import/prefer-default-export': 'off',
        'jsx-a11y/aria-props': 2,
        'jsx-a11y/heading-has-content': 0,
        'jsx-a11y/label-has-associated-control': [
            2,
            {
                // NOTE: If this error triggers, either disable it or add
                // your custom components, labels and attributes via these options
                // See https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-associated-control.md
                controlComponents: ['Input'],
            },
        ],
        'jsx-a11y/label-has-for': 0,
        'jsx-a11y/mouse-events-have-key-events': 2,
        'jsx-a11y/role-has-required-aria-props': 2,
        'jsx-a11y/role-supports-aria-props': 2,
        'max-len': 0,
        'newline-per-chained-call': 0,
        'no-confusing-arrow': 0,
        'no-unused-vars': 1,
        'no-use-before-define': 0,
        'prefer-template': 2,
        'react/destructuring-assignment': 0,
        'react-hooks/rules-of-hooks': 'error',
        'react/jsx-closing-tag-location': 0,
        'react/forbid-prop-types': 0,
        'react/jsx-first-prop-new-line': [2, 'multiline'],
        'react/jsx-filename-extension': 0,
        'react/jsx-no-target-blank': 0,
        'react/jsx-uses-vars': 2,
        'react/require-default-props': 0,
        'react/require-extension': 0,
        'react/self-closing-comp': 0,
        'react/sort-comp': 0,
        'require-yield': 0,
        'max-classes-per-file': 'off',
        'no-console': 'off',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'error',
        'lines-between-class-members': 'off',
        'prefer-rest-params': 'off',
        'no-underscore-dangle': 'off',
        'func-names': 'off',
        camelcase: 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                ts: 'never',
            },
        ],
    },
};
