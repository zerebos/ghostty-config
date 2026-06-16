import type {DirNode, FSNode} from "./types";


export function makeFilesystem(): DirNode {
    return {
        type: "dir",
        children: {
            "Desktop": {type: "dir", children: {}},
            "Documents": {
                type: "dir",
                children: {
                    "note.md": {type: "file", content: "Welcome to your Ghostty terminal!"},
                    "notes.txt": {type: "file", content: "Meeting notes – Jan 1\nTODO: update ghostty config"},
                    "todo.md": {type: "file", content: "# TODO\n- [ ] Configure ghostty\n- [x] Install ghostty\n- [ ] Customize colors"},
                    "report.pdf": {type: "file", content: "(binary file)"},
                },
            },
            "Downloads": {
                type: "dir",
                children: {
                    "ghostty-1.0.0.tar.gz": {type: "file", content: "(binary file)"},
                    "setup.sh": {type: "file", content: "#!/bin/bash\napt-get install -y ghostty", executable: true},
                },
            },
            "Pictures": {
                type: "dir",
                children: {
                    "screenshot.png": {type: "file", content: "(binary file)"},
                    "wallpaper.jpg": {type: "file", content: "(binary file)"},
                },
            },
            "Projects": {
                type: "dir",
                children: {
                    "ghostty-config": {
                        type: "dir",
                        children: {
                            "README.md": {type: "file", content: "# ghostty-config\nA web-based GUI config generator for Ghostty."},
                            "package.json": {type: "file", content: "{\n  \"name\": \"ghostty-config\",\n  \"version\": \"1.0.0\"\n}"},
                            "src": {
                                type: "dir",
                                children: {
                                    "index.ts": {type: "file", content: "import \"./app.css\";\nimport App from \"./App.svelte\";"},
                                },
                            },
                        },
                    },
                },
            },
            "Programs": {
                type: "dir",
                children: {
                    "hello.sh": {type: "file", content: "#!/bin/bash\necho \"Hello, world!\"", executable: true},
                    "backup.sh": {type: "file", content: "#!/bin/bash\necho \"Backing up...\"\ntar -czf backup.tar.gz ~/Documents", executable: true},
                },
            },
            ".bash_profile": {type: "file", content: "export PATH=\"$HOME/.local/bin:$PATH\"\nexport TERM=ghostty"},
            ".gitconfig": {type: "file", content: "[user]\n\tname = John\n\temail = john@example.com\n[core]\n\teditor = nvim"},
            "README.md": {type: "file", content: "# My Ghostty Setup\n\nA customized Ghostty configuration.\nGenerated with ghostty-config."},
            "install.sh": {type: "file", content: "#!/bin/bash\necho \"Installing...\"\napt-get install -y ghostty", executable: true},
        },
    };
}


export function resolveParts(cwd: string[], path: string): string[] {
    let parts: string[];
    if (path === "~" || path === "") parts = [];
    else if (path.startsWith("~/")) parts = path.slice(2).split("/").filter(Boolean);
    else if (path.startsWith("/")) parts = path.slice(1).split("/").filter(Boolean);
    else parts = [...cwd, ...path.split("/").filter(Boolean)];

    const out: string[] = [];
    for (const p of parts) {
        if (p === ".") continue;
        else if (p === "..") out.pop();
        else out.push(p);
    }
    return out;
}

export function getNode(root: DirNode, parts: string[]): FSNode | null {
    let node: FSNode = root;
    for (const part of parts) {
        if (node.type !== "dir") return null;
        const child = node.children[part] as FSNode | undefined;
        if (!child) return null;
        node = child;
    }
    return node;
}

export function cwdString(parts: string[]): string {
    return parts.length === 0 ? "~" : "~/" + parts.join("/");
}

export function cwdAbs(user: string, parts: string[]): string {
    return parts.length === 0 ? `/home/${user}` : `/home/${user}/${parts.join("/")}`;
}