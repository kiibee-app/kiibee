# Umbraco custom-folder migration

1. Copy `config.example.mjs` to `config.mjs`.
2. Copy `cookies.example.txt` to `cookies.txt` and paste the four cookie rows from the browser.
3. Add user names and optional folder names to `config.mjs`.
4. Run:

```sh
node migration/export-custom-folders.mjs
```

Use `folders: []` or a simple user-name string to export every non-system content folder. Output is written under `umbraco-data/users/<user>/content/`.

Validate cookie parsing without exporting:

```sh
node migration/export-custom-folders.mjs --check-cookies
```
