module.exports = {
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
    "parser": ["@typescript-eslint/parser"],                    // Specify ESlint parser
    "extends": ["plugin:@typescript-eslint/recommended",        // Use reccommended rules from TypeScript-eslint
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"],                             // Use reccommended rues from prettier and display prettier errors as ESlint errors. Must be last config in array
    "plugins": ["prettier"],                                    // Include plugin prettier
    "rules": {
    },
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": 'module',
    },
};
