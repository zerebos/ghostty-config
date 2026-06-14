import type {Command} from "../types";
import {ok, s} from "../utils";


const command: Command = {
    desc: "Print current date and time",
    fn() {return ok([[s.plain(new Date().toString())]]);},
};

export default command;