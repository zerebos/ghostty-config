import type {Command} from "../types";
import {ok, s} from "../utils";


const command: Command = {
    desc: "Print system hostname",
    fn(_, ctx) {return ok([[s.plain(ctx.host)]]);},
};

export default command;