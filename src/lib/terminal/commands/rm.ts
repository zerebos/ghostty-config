import {getNode, resolveParts} from "../filesystem";
import type {Command} from "../types";
import {err, ok} from "../utils";


const command: Command = {
    desc: "Remove a file",
    usage: "[-r] <file>",
    details: ["-r  remove directories recursively"],
    fn(args, ctx) {
        const recursive = args.includes("-r") || args.includes("-rf") || args.includes("-fr");
        const targets = args.filter(a => !a.startsWith("-"));
        if (!targets[0]) return err("rm: missing operand");
        const parts = resolveParts(ctx.cwd(), targets[0]);
        const targetName = parts.pop();
        if (!targetName) return err("rm: cannot remove root directory");
        const parentNode = getNode(ctx.root, parts);
        if (!parentNode || parentNode.type !== "dir") return err(`rm: cannot remove '${targets[0]}': No such file or directory`);
        const node = parentNode.children[targetName];
        if (!node) return err(`rm: cannot remove '${targets[0]}': No such file or directory`);
        if (node.type === "dir" && !recursive) return err(`rm: cannot remove '${targets[0]}': Is a directory`);
        delete parentNode.children[targetName];
        return ok([]);
    },
};

export default command;