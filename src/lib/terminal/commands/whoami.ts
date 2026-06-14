import type {Command} from "../types";
import {ok, s} from "../utils";


const command: Command = {
    desc: "Print current user name",
    fn(_, ctx) {return ok([[s.plain(ctx.user)]]);},
};

export default command;