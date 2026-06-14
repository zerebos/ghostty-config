Ghostty keybind sync helpers

These scripts fetch the latest key/action metadata from Ghostty's upstream source.
They are intentionally lightweight so we can periodically refresh validation lists.

Usage (from repo root):

- `bun run scripts/fetch-ghostty-key-names.ts > /tmp/ghostty-keys.json`
- `bun run scripts/fetch-ghostty-action-names.ts > /tmp/ghostty-actions.json`

Outputs are JSON payloads containing:

- `keys`: list of key enum identifiers (from `key.zig`)
- `actions`: list of action names (from `Binding.zig`)
- `sourceUrl`: the GitHub URL used for the fetch

Note: these scripts are purely helpers and do not mutate the repo.
