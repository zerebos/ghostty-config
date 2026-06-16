import type {Command} from "../types";
import {clear} from "../utils";


const command: Command = {
    desc: "Clear the terminal screen",
    fn: () => clear(),
};

export default command;