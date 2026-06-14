const KEY_URL = "https://raw.githubusercontent.com/ghostty-org/ghostty/main/src/input/key.zig";

type KeyExtract = {
    keys: string[];
    sourceUrl: string;
};

function extractEnumBlock(source: string, enumName: string) {
    const pattern = new RegExp(`pub const ${enumName} = enum\\(c_int\\) \\{([\\s\\S]*?)\\};`);
    const match = source.match(pattern);
    if (!match) return null;
    return match[1];
}

function parseEnumEntries(block: string) {
    const keys: string[] = [];
    for (const rawLine of block.split("\n")) {
        const line = rawLine.trim();
        if (!line) continue;
        if (line.startsWith("//")) continue;
        if (line.startsWith("///")) continue;
        if (line.startsWith("_")) continue;
        if (line.startsWith("inline else")) continue;
        if (line.includes("=>")) continue;
        const entry = line.replace(/,.*/, "").trim();
        if (!entry) continue;
        keys.push(entry);
    }
    return keys;
}

async function fetchKeys(): Promise<KeyExtract> {
    const response = await fetch(KEY_URL);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${KEY_URL}: ${response.status} ${response.statusText}`);
    }
    const text = await response.text();
    const block = extractEnumBlock(text, "Key");
    if (!block) {
        throw new Error("Failed to locate Key enum in source");
    }
    return {keys: parseEnumEntries(block), sourceUrl: KEY_URL};
}

async function main() {
    const result = await fetchKeys();
    console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
