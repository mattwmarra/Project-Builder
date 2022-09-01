/*
    * Linting Rules
    * Inline with AirBNB Style Guide
*/
module.exports = {
    "extends": ["airbnb", "prettier"],
    "plugins": ["prettier"],
    "rules" : {
        "no-unused-vars": "error",
        "prefer-const":"error",
        "no-var":"error",
        "no-new-object": "error",
        "object-shorthand":"error",
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".tsx"] }]
    }

};