import type {Command} from "../types";
import cat from "./cat";
import cd from "./cd";
import clear from "./clear";
import date from "./date";
import echo from "./echo";
import git from "./git";
import grep from "./grep";

import buildHelpCommand from "./help";
import hostname from "./hostname";
import ls from "./ls";
import mkdir from "./mkdir";
import pwd from "./pwd";
import rm from "./rm";
import touch from "./touch";
import uname from "./uname";
import whoami from "./whoami";



export const commands: Record<string, Command> = {
    cat,
    cd,
    clear,
    date,
    echo,
    hostname,
    ls,
    pwd,
    whoami,
    git,
    grep,
    mkdir,
    rm,
    touch,
    uname,
};

// TODO: put commands in context so help can automatically generate internally
commands.help = buildHelpCommand(commands);

export default commands;