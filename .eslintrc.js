module.exports = {
  extends: ['airbnb', 'plugin:prettier/recommended'],
  plugins: ['react-hooks', 'prettier'],
  rules: {
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'react/jsx-props-no-spreading': 0,
  },
  env: {
    browser: true,
    jest: true,
  },
};
