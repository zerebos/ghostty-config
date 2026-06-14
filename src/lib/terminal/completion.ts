import {getNode, resolveParts} from "./filesystem";
import type {ExecContext} from "./types";


export function getCompletion(input: string, ctx: ExecContext): string | null {
    const argv = input.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) ?? [];
    const isCmd = argv.length === 0 || (argv.length === 1 && !input.endsWith(" "));

    if (isCmd) {
        const partial = argv[0] ?? "";
        const matches = Object.keys(ctx.commands).filter(c => c.startsWith(partial));
        if (matches.length === 1) return matches[0] + " ";
        if (matches.length > 1) {
            // Return longest common prefix
            const lcp = longestCommonPrefix(matches);
            return lcp.length > partial.length ? lcp : null;
        }
        return null;
    }

    // File/dir completion for the last arg
    const lastArg = input.endsWith(" ") ? "" : (argv[argv.length - 1] ?? "");
    const slashIdx = lastArg.lastIndexOf("/");
    const dirPart = slashIdx >= 0 ? lastArg.slice(0, slashIdx + 1) : "";
    const filePart = slashIdx >= 0 ? lastArg.slice(slashIdx + 1) : lastArg;

    const dirParts = resolveParts(ctx.cwd(), dirPart || ".");
    const dirNode = getNode(ctx.root, dirParts);
    if (!dirNode || dirNode.type !== "dir") return null;

    const matches = Object.entries(dirNode.children)
        .filter(([name]) => name.startsWith(filePart))
        .map(([name, node]) => dirPart + name + (node.type === "dir" ? "/" : ""));

    if (matches.length === 1) {
        // Replace last arg with completed version
        const prefix = input.endsWith(" ") ? input : input.slice(0, input.length - lastArg.length);
        return prefix + matches[0];
    }
    if (matches.length > 1) {
        const lcp = longestCommonPrefix(matches);
        const prefix = input.endsWith(" ") ? input : input.slice(0, input.length - lastArg.length);
        const newLast = lcp.length > filePart.length ? lcp : null;
        return newLast ? prefix + newLast : null;
    }
    return null;
}

function longestCommonPrefix(strs: string[]): string {
    if (!strs.length) return "";
    let prefix = strs[0];
    for (const str of strs.slice(1)) {
        while (!str.startsWith(prefix)) prefix = prefix.slice(0, -1);
    }
    return prefix;
}