import {getNode} from "../filesystem";
import type {Command, DirNode} from "../types";
import {err, ok} from "../utils";


const command: Command = {
    desc: "Create an empty file or update timestamp",
    usage: "<file>",
    fn(args, ctx) {
        if (!args[0]) return err("touch: missing file operand");
        const cwd = getNode(ctx.root, ctx.cwd()) as DirNode;
        if (!cwd.children[args[0]]) cwd.children[args[0]] = {type: "file", content: ""};
        return ok([]);
    },
};

export default command;