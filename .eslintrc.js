module.exports = {
    "extends": [
        "airbnb",
        "plugin:prettier/recommended"
    ],
    "plugins": [
        "react-hooks",
        "prettier"
    ],
    "rules": {
        "jsx-a11y/label-has-for": 0,
        "jsx-a11y/label-has-associated-control": 0,
        "jsx-a11y/no-noninteractive-tabindex": 0,
        "jsx-a11y/control-has-associated-label": 0,
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "import/no-extraneous-dependencies": [
            "error",
            {"devDependencies": true}
        ],
        "no-use-before-define": 0,
        "no-param-reassign": 0,
        "no-console": 0,
        "func-names": 0,
        "prefer-template": 0,
        "consistent-return": 0,
        "react/jsx-filename-extension": 0,
        "react/jsx-props-no-spreading": 0,
        "react/jsx-one-expression-per-line": 0,
        "react/prop-types": 0,
        "react/forbid-prop-types": 0,
        "react/no-unescaped-entities": 0,
        "react/destructuring-assignment": 0,
        "react/no-this-in-sfc": 0,
        "prettier/prettier": 0
    },
    "env": {
        "browser": true,
        "jest": true
    }
};
