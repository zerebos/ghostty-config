import {getNode, resolveParts} from "../filesystem";
import type {Command} from "../types";
import {err, ok, s} from "../utils";


const command: Command = {
    desc: "Create a directory",
    usage: "<dir>",
    fn(args, ctx) {
        if (!args[0]) return err("mkdir: missing operand");
        const parts = resolveParts(ctx.cwd(), args[0]);
        const dirName = parts.pop();
        if (!dirName) return err("mkdir: missing operand");
        const parentNode = getNode(ctx.root, parts);
        if (!parentNode || parentNode.type !== "dir") return err(`mkdir: cannot create directory '${args[0]}': No such file or directory`);
        if (parentNode.children[dirName]) return err(`mkdir: cannot create directory '${args[0]}': File exists`);
        parentNode.children[dirName] = {type: "dir", children: {}};
        return ok([[s.plain(`mkdir: created directory '${args[0]}'`)]]);
    },
};

export default command;