import {getNode, resolveParts} from "../filesystem";
import type {Command} from "../types";
import {err, ok} from "../utils";


const command: Command = {
    desc: "Create an empty file or update timestamp",
    usage: "<file>",
    fn(args, ctx) {
        if (!args[0]) return err("touch: missing file operand");
        const parts = resolveParts(ctx.cwd(), args[0]);
        const fileName = parts.pop();
        if (!fileName) return err("touch: missing file operand");
        const parentNode = getNode(ctx.root, parts);
        if (!parentNode || parentNode.type !== "dir") return err(`touch: cannot touch '${args[0]}': No such file or directory`);
        if (!parentNode.children[fileName]) parentNode.children[fileName] = {type: "file", content: ""};
        return ok([]);
    },
};

export default command;