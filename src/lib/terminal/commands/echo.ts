import {cwdAbs} from "../filesystem";
import type {Command} from "../types";
import {ok, s} from "../utils";


const command: Command = {
    desc: "Print text",
    usage: "[text...]",
    fn(args, ctx) {
        const cleanArgs = args.map(arg => arg.replace(/^["']|["']$/g, ""));
        const text = cleanArgs
            .join(" ")
            .replace(/\$USER/g, ctx.user)
            .replace(/\$HOME/g, `/home/${ctx.user}`)
            .replace(/\$PWD/g, cwdAbs(ctx.user, ctx.cwd()));
        return ok([[s.plain(text)]]);
    },
};

export default command;