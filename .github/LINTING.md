# Linting and Formatting Guide

This project uses ESLint, Prettier, and StyleLint to maintain code quality and consistency.

## Quick Start

```bash
# Format code with Prettier
yarn format

# Check code formatting without changes
yarn format:check

# Lint JavaScript/JSX with ESLint
yarn lint

# Auto-fix linting issues
yarn lint:fix

# Lint SCSS files
yarn sass-lint
```

## Tools

### ESLint (JavaScript/JSX)

We use ESLint v9 with the modern flat config format to catch code quality issues, potential bugs, and enforce best practices.

**Configuration:** `eslint.config.js`

**Plugins:**

- `@eslint/js` - Core ESLint recommended rules
- `eslint-plugin-react` - React-specific linting
- `eslint-plugin-react-hooks` - Enforce React Hooks rules
- `eslint-plugin-react-refresh` - Vite HMR compatibility
- `eslint-plugin-github` - GitHub's recommended rules for security and best practices
- `eslint-plugin-import` - ES6 import/export syntax
- `eslint-plugin-jsx-a11y` - Accessibility checks
- `eslint-plugin-testing-library` - Testing Library best practices
- `eslint-plugin-vitest` - Vitest test framework support

**Key Features:**

- Security rules from GitHub plugin
- Accessibility checks
- React best practices
- Performance recommendations
- Integrated with Prettier (no formatting conflicts)

### Prettier (Code Formatting)

Prettier handles all code formatting automatically.

**Configuration:** `.prettierrc.json`

**Settings:**

```json
{
  "arrowParens": "always",
  "semi": true,
  "tabWidth": 2,
  "singleQuote": true,
  "trailingComma": "all",
  "bracketSpacing": true
}
```

**Files formatted:** JavaScript, JSX, JSON, CSS, Markdown

### StyleLint (SCSS)

StyleLint checks SCSS files for best practices and consistency.

**Configuration:** `stylelint.config.js`

**Run:** `yarn sass-lint`

## IDE Integration

### VS Code

Install these extensions:

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)

Add to your `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript", "javascriptreact"]
}
```

## Pre-commit Workflow

Before committing:

1. Format your code: `yarn format`
2. Fix linting issues: `yarn lint:fix`
3. Check remaining issues: `yarn lint`
4. Run tests: `yarn test`

## CI Integration

ESLint and Prettier checks should be added to the CI pipeline to ensure code quality:

```yaml
# Example for GitHub Actions
- name: Lint
  run: yarn lint

- name: Check formatting
  run: yarn format:check

- name: Lint SCSS
  run: yarn sass-lint
```

## Common Issues

### Unused React Import

**Issue:** Warning about unused `React` import in JSX files.

**Explanation:** With React 17+ JSX transform, React doesn't need to be imported. However, the pattern is allowed in our config for compatibility.

**Solution:** This is a warning, not an error. You can safely ignore it or remove the import.

### Import Resolution Errors

**Issue:** `import/no-unresolved` errors for path aliases.

**Explanation:** Vite path aliases (e.g., `@/`, `@styles/`) are not recognized by the import plugin.

**Solution:** This rule is disabled in our config. Path aliases work correctly at build time.

### Prettier Conflicts

**Issue:** ESLint and Prettier disagreeing on formatting.

**Explanation:** Should not happen - we use `eslint-config-prettier` to disable conflicting rules.

**Solution:** Run `yarn format` first, then `yarn lint:fix`.

## Rule Customization

If you need to adjust rules for your team's preferences, edit `eslint.config.js`:

```javascript
rules: {
  'rule-name': 'off',  // Disable rule
  'rule-name': 'warn', // Warning only
  'rule-name': 'error', // Error (blocks PR)
}
```

**Note:** Rule changes should be discussed with the team first to maintain consistency.

## Remaining Known Issues

After this refactoring, ~291 linting issues remain. These are legitimate code quality improvements that should be addressed in future PRs:

1. **Accessibility** (high priority)
   - `github/a11y-role-supports-aria-props` - Fix incorrect ARIA attributes
2. **Security** (high priority)
   - `github/no-inner-html` - Replace innerHTML with safer alternatives
3. **Code Quality** (medium priority)
   - `no-shadow` - Fix variable shadowing
   - `no-useless-escape` - Remove unnecessary escape characters
   - `react/no-unescaped-entities` - Escape special characters in JSX
4. **Performance** (low priority)
   - `github/prefer-observers` - Use ResizeObserver instead of resize events

## Resources

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/)
- [eslint-plugin-github](https://github.com/github/eslint-plugin-github)
- [StyleLint Documentation](https://stylelint.io/)
