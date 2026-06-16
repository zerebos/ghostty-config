export type FileNode = {type: "file"; content: string; executable?: boolean;};
export type DirNode = {type: "dir"; children: Record<string, FSNode>;};
export type FSNode = FileNode | DirNode;

export type Segment = {
    text: string;
    palette?: number; // index into --config-palette-N
    hex?: string; // explicit hex color (for git, grep highlights, etc.)
    bold?: boolean;
    dim?: boolean;
    italic?: boolean;
    underline?: boolean;
    inverse?: boolean;
    href?: string; // for clickable segments, the URL to open
};

export type Line = Segment[];

export type ExecResult = {
    lines: Line[];
    clear?: boolean;
    mutateCwd?: string[];
    failed?: boolean;
};

export type ExecContext = {
    cwd: () => string[]; // getter so commands always see latest
    setCwd: (p: string[]) => void;
    root: DirNode;
    user: string;
    host: string;
    commands: Record<string, Command>;
};

export type Command = {
    desc: string; // one-liner shown in `help`
    usage?: string; // args shown in `help`, e.g. "[-la] [path]"
    details?: string[]; // extra lines shown in `help <cmd>`
    fn: (args: string[], ctx: ExecContext) => ExecResult;
};

export type HistoryEntry =
    | {id: number; kind: "cmd"; prompt: PromptSnapshot; cmd: string;}
    | {id: number; kind: "output"; segments: Segment[];}
    | {id: number; kind: "ctrlc"; prompt: PromptSnapshot; input: string;};

export type PromptSnapshot = {user: string; host: string; cwd: string;};