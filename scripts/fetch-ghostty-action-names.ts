const BINDING_URL = "https://raw.githubusercontent.com/ghostty-org/ghostty/main/src/input/Binding.zig";

type ActionExtract = {
    actions: string[];
    sourceUrl: string;
};

function extractActionBlock(source: string) {
    const marker = "pub const Action = union(enum)";
    const start = source.indexOf(marker);
    if (start === -1) return null;
    const after = source.slice(start + marker.length);
    const openIndex = after.indexOf("{");
    if (openIndex === -1) return null;
    let depth = 0;
    let inBlockComment = false;
    let inLineComment = false;
    for (let i = openIndex; i < after.length; i += 1) {
        const char = after[i];
        const next = after[i + 1];
        if (!inLineComment && !inBlockComment && char === "/" && next === "*") {
            inBlockComment = true;
        }
        else if (inBlockComment && char === "*" && next === "/") {
            inBlockComment = false;
            i += 1;
            continue;
        }
        else if (!inBlockComment && !inLineComment && char === "/" && next === "/") {
            inLineComment = true;
        }
        else if (inLineComment && char === "\n") {
            inLineComment = false;
        }
        if (inBlockComment || inLineComment) continue;
        if (char === "{") depth += 1;
        if (char === "}") {
            depth -= 1;
            if (depth === 0) {
                return after.slice(openIndex + 1, i);
            }
        }
    }
    return null;
}

function parseActionNames(block: string) {
    const actions = new Set<string>();
    for (const rawLine of block.split("\n")) {
        const line = rawLine.trim();
        if (!line) continue;
        if (line.startsWith("//")) continue;
        if (line.startsWith("///")) continue;
        if (line.startsWith("pub const")) break;
        if (line.startsWith("test")) break;
        const entry = line.replace(/,.*/, "").trim();
        if (!entry) continue;
        const name = entry.split(":")[0].trim();
        if (!name) continue;
        actions.add(name);
    }
    return Array.from(actions).sort();
}

async function fetchActions(): Promise<ActionExtract> {
    const response = await fetch(BINDING_URL);
    if (!response.ok) {
        throw new Error(
            `Failed to fetch ${BINDING_URL}: ${response.status} ${response.statusText}`
        );
    }
    const text = await response.text();
    const block = extractActionBlock(text);
    if (!block) throw new Error("Failed to locate Action union in source");
    return {actions: parseActionNames(block), sourceUrl: BINDING_URL};
}

async function main() {
    const result = await fetchActions();
    console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
