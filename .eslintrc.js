module.exports = {
  "root": true,
  "extends": ["eslint:recommended", "google"],
  "env": {
    "node": true,
    "jquery" : true,
    "browser": true
  },
  "parserOptions": {
    "ecmaVersion": 6
  }, 
  "rules": {
    "max-len": ['error', {code: 100}], // default 80
    "indent": ['error', 2, {"SwitchCase": 1}], // not set by default
    "comma-dangle": ["error", "never"], // do not enforce trailing comma
    "one-var": [2, { // forces having single declaration keyword
      var: 'always',
      let: 'always',
      const: 'always',
    }],
   "curly": [2, "all"] // enfornce curly braces even in single line if-else
  }
}
