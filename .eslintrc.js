// ESLint configuration
// http://eslint.org/docs/user-guide/configuring
module.exports = {
  parser: '@typescript-eslint/parser',

  plugins: [
    '@typescript-eslint',
    'css-modules',
  ],

  globals: {
    __DEV__: true,
    __BROWSER__: true,
  },

  extends: [
    'airbnb-typescript',
    'plugin:css-modules/recommended',
  ],

  parserOptions: {
    project: './tsconfig.json',
  },

  env: {
    browser: true,
  },

  rules: {
    // Forbid the use of extraneous packages
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
    'import/no-extraneous-dependencies': ['error', { packageDir: '.' }],

    // Recommend not to leave any console.log in your code
    // Use console.error, console.warn and console.info instead
    // https://eslint.org/docs/rules/no-console
    'no-console': [
      'error',
      {
        allow: ['warn', 'error', 'info'],
      },
    ],

    // Prefer destructuring from arrays and objects
    // http://eslint.org/docs/rules/prefer-destructuring
    'prefer-destructuring': [
      'error',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: false,
        },
      },
      {
        enforceForRenamedProperties: false,
      },
    ],

    // Ensure <a> tags are valid
    // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to', 'feature'],
        aspects: ['noHref', 'invalidHref', 'preferButton'],
      },
    ],

    'jsx-a11y/click-events-have-key-events': 'off',
    'react/jsx-one-expression-per-line': 'off',

    // Allow .js files to use JSX syntax
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-filename-extension.md
    'react/jsx-filename-extension': ['error', { extensions: ['.ts', '.tsx'] }],

    // Functional and class components are equivalent from React’s point of view
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/prefer-stateless-function.md
    'react/prefer-stateless-function': 'off',

    'function-paren-newline': 'off',
    'object-curly-newline': 'off',
    'react/forbid-prop-types': 'off',
    'react/require-default-props': 'off',
    'max-len': ['error', { 'code': 120 }],
  },
};
