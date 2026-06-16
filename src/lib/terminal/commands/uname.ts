import type {Command} from "../types";
import {ok, s} from "../utils";


const command: Command = {
    desc: "Print system information",
    usage: "[-a]",
    details: ["-a  print all information"],
    fn(args, ctx) {
        return ok([[s.plain(args.includes("-a")
            ? `Linux ${ctx.host} 6.1.0 #1 SMP x86_64 GNU/Linux`
            : "Linux")]]);
    },
};

export default command;