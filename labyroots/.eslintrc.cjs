module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        project: "tsconfig.json",
        tsconfigRootDir: __dirname
    },
    env: {
        browser: true,
        node: true
    },
    globals: {
        "WL": "readonly",
        "PP": "readonly",
        "LR": "writable",
        "Global": "writable",
        "AudioID": "writable",
        "downloadFileText": "writable",
        "downloadFileJSON": "writable",
        "loadFileText": "writable",
        "loadFileJSON": "writable",
        "loadFile": "writable",
        "decreaseStage": "writable",
        "increaseStage": "writable"
    },
    plugins: [
        "deprecation"
    ],
    extends: [
        "eslint:recommended"
    ],
    rules: {
        "no-unused-vars": ["warn", { "args": "none", "varsIgnorePattern": "^__" }],
        "deprecation/deprecation": "warn"
    },
    ignorePatterns: [
        "/node_modules/",
        "/deploy/",
        "/cache/",
        "/.editor/",
        "/languages/",
        "/.editor/",
        "/assets/",
        "/static/",
        ".eslintrc.cjs",
        "zesty.js",
        "zesty-wonderland-sdk-compat.js"
    ],
    overrides: [
    ]
};