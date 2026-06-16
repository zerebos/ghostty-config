import {getNode, resolveParts} from "../filesystem";
import type {Command} from "../types";
import {err, ok, s} from "../utils";


const command: Command = {
    desc: "Print file contents",
    usage: "<file>",
    fn(args, ctx) {
        if (!args[0]) return err("cat: missing operand");
        const parts = resolveParts(ctx.cwd(), args[0]);
        const node = getNode(ctx.root, parts);
        if (!node) return err(`cat: ${args[0]}: No such file or directory`);
        if (node.type === "dir") return err(`cat: ${args[0]}: Is a directory`);
        const lines = node.content.split("\n").map(l => [s.plain(l)]);
        return ok(lines);
    },
};

export default command;