module.exports = {
    "extends": "airbnb",
    "plugins": [
        "react-hooks"
    ],
    "rules": {
        "jsx-a11y/label-has-for": "off",
        "jsx-a11y/label-has-associated-control": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "import/no-extraneous-dependencies": [
            "error",
            {"devDependencies": true}
        ],
        "react/jsx-props-no-spreading": "off"
    },
    "env": {
        "browser": true,
        "jest": true
    }
};
