import {getNode, resolveParts} from "../filesystem";
import type {Command} from "../types";
import {err, ok} from "../utils";


const command: Command = {
    desc: "Change directory",
    usage: "[path]",
    details: ["With no arguments, returns to home directory (~).", "Supports ~, .., and absolute paths."],
    fn(args, ctx) {
        const target = args[0] ?? "~";
        const parts = resolveParts(ctx.cwd(), target);
        const node = getNode(ctx.root, parts);
        if (!node) return err(`cd: no such file or directory: ${target}`);
        if (node.type !== "dir") return err(`cd: not a directory: ${target}`);
        ctx.setCwd(parts);
        return ok([]);
    },
};

export default command;