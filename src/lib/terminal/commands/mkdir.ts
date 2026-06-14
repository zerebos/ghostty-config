import {getNode} from "../filesystem";
import type {Command} from "../types";
import {err, ok} from "../utils";


const command: Command = {
    desc: "Create a directory",
    usage: "<dir>",
    fn(args, ctx) {
        if (!args[0]) return err("mkdir: missing operand");
        const cwd = getNode(ctx.root, ctx.cwd());
        if (!cwd || cwd.type !== "dir") return err("mkdir: current directory is invalid");
        if (cwd.children[args[0]]) return err(`mkdir: cannot create directory '${args[0]}': File exists`);
        cwd.children[args[0]] = {type: "dir", children: {}};
        return ok([]);
    },
};

export default command;