import type {Command, Line} from "../types";
import {err, ok, s} from "../utils";


const gitState = {
    branch: "main",
    staged: ["src/index.ts", "README.md"],
    modified: ["package.json", "src/app.css"],
    untracked: ["dist/", ".env"],
    log: [
        {hash: "a3f9c12", author: "John", date: "2 hours ago", msg: "feat: add background image settings"},
        {hash: "b81e204", author: "John", date: "5 hours ago", msg: "fix: correct palette reset logic"},
        {hash: "c0d3a99", author: "John", date: "yesterday", msg: "refactor: split registry into modules"},
        {hash: "d4e7f11", author: "John", date: "2 days ago", msg: "chore: update dependencies"},
        {hash: "e5b2c30", author: "Jane", date: "3 days ago", msg: "docs: improve README"},
    ],
};


const command: Command = {
    desc: "Version control (curated preview)",
    usage: "<subcommand>",
    details: [
        "Supported subcommands: status, log, diff, branch, add, commit",
        "This is a curated demo — output is simulated for preview purposes.",
    ],
    fn(args) {
        const sub = args[0];

        if (!sub) return err("git: missing subcommand. Try: status, log, diff, branch");

        if (sub === "status") {
            const lines: Line[] = [
                [s.plain("On branch "), s.p(gitState.branch, 2, true)],
                [s.plain("")],
                [s.bold("Changes to be committed:")],
                [s.dim("  (use \"git restore --staged <file>...\" to unstage)")],
            ];
            for (const f of gitState.staged) lines.push([s.plain("        "), s.success("modified:   " + f)]);
            lines.push([s.plain("")]);
            lines.push([s.bold("Changes not staged for commit:")]);
            lines.push([s.dim("  (use \"git add <file>...\" to update what will be committed)")]);
            for (const f of gitState.modified) lines.push([s.plain("        "), s.error("modified:   " + f)]);
            lines.push([s.plain("")]);
            lines.push([s.bold("Untracked files:")]);
            lines.push([s.dim("  (use \"git add <file>...\" to include in what will be committed)")]);
            for (const f of gitState.untracked) lines.push([s.plain("        "), s.error(f)]);
            return ok(lines);
        }

        if (sub === "log" || (sub === "log" && args.includes("--oneline"))) {
            const oneline = args.includes("--oneline");
            const nIdx = args.indexOf("-n");
            const nStr = nIdx >= 0 ? args[nIdx + 1] : args.find(a => /^-\d+$/.test(a))?.slice(1);
            const n = parseInt(nStr ?? "5");
            const count = isNaN(n) ? 5 : Math.min(n, gitState.log.length);
            const lines: Line[] = [];
            for (const entry of gitState.log.slice(0, count)) {
                if (oneline) {
                    lines.push([s.p(entry.hash, 3), s.plain(" " + entry.msg)]);
                }
                else {
                    lines.push([s.p("commit " + entry.hash + "f3a91b2c", 3)]);
                    lines.push([s.plain(`Author: ${entry.author} <${entry.author.toLowerCase()}@example.com>`)]);
                    lines.push([s.plain(`Date:   ${entry.date}`)]);
                    lines.push([s.plain("")]);
                    lines.push([s.plain("    " + entry.msg)]);
                    lines.push([s.plain("")]);
                }
            }
            return ok(lines);
        }

        if (sub === "diff") {
            const lines: Line[] = [
                [s.dim("diff --git a/package.json b/package.json")],
                [s.dim("index 3a1b2c4..5d6e7f8 100644")],
                [s.bold("--- a/package.json")],
                [s.bold("+++ b/package.json")],
                [s.p("@@ -1,4 +1,5 @@", 6)],
                [s.plain(" {")],
                [s.plain("   \"name\": \"ghostty-config\",")],
                [s.error("-  \"version\": \"1.0.0\"")],
                [s.success("+  \"version\": \"1.1.0\",")],
                [s.success("+  \"description\": \"Web GUI for Ghostty configuration\"")],
                [s.plain(" }")],
            ];
            return ok(lines);
        }

        if (sub === "branch") {
            const lines: Line[] = [
                [s.success("* " + gitState.branch)],
                [s.plain("  develop")],
                [s.plain("  feature/background-image")],
            ];
            return ok(lines);
        }

        if (sub === "add") {
            if (!args[1]) return err("git add: nothing specified");
            return ok([[s.plain("")]]);
        }

        if (sub === "commit") {
            const mIdx = args.indexOf("-m");
            const msg = mIdx >= 0 ? args[mIdx + 1] : undefined;
            if (!msg) return err("git commit: please provide a message with -m \"...\"");
            const hash = Math.random().toString(16).slice(2, 9);
            return ok([
                [s.plain("["), s.p(gitState.branch, 2), s.plain(" "), s.p(hash, 3), s.plain("] " + msg.replace(/^["']|["']$/g, ""))],
                [s.plain(` ${gitState.staged.length} files changed`)],
            ]);
        }

        return err(`git: '${sub}' is not a supported subcommand in this preview. Try: status, log, diff, branch, add, commit`);
    },
};

export default command;
