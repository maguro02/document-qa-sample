module.exports = {
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 120,
  arrowParens: 'always',
  overrides: [
    {
      "files": "*.ts",
      "options": {
        "parser": "babel-ts"
      }
    }
  ]
}