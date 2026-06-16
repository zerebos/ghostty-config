import {describe, expect, it, vi} from "vitest";

import {getCompletion} from "./completion";
import {makeFilesystem} from "./filesystem";
import type {ExecContext} from "./types";

function createCtx(
    cwd: string[] = [],
    commands: string[] = ["cat", "cd", "clear", "cp", "chmod"],
): ExecContext {
    return {
        cwd: () => cwd,
        setCwd: vi.fn(),
        root: makeFilesystem(),
        user: "test",
        host: "localhost",
        commands: Object.fromEntries(
            commands.map(cmd => [
                cmd,
                {
                    desc: `${cmd} command`,
                    fn: vi.fn(),
                },
            ]),
        ),
    };
}

describe("getCompletion - command completion", () => {
    it("completes a single matching command", () => {
        expect(getCompletion("cle", createCtx()))
            .toBe("clear ");
    });

    it("returns a longer common prefix when one exists", () => {
        const ctx = createCtx([], [
            "checkout",
            "checklist",
            "chmod",
        ]);

        expect(getCompletion("che", ctx))
            .toBe("check");
    });

    it("returns null when multiple matches already equal the lcp", () => {
        expect(getCompletion("c", createCtx([""], ["cat", "cd", "cp"])))
            .toBeNull();
    });

    it("returns null when no command matches", () => {
        expect(getCompletion("xyz", createCtx()))
            .toBeNull();
    });

    it("completes from empty input when only one command exists", () => {
        const ctx = createCtx([], ["cat"]);

        expect(getCompletion("", ctx))
            .toBe("cat ");
    });
});

describe("getCompletion - filesystem completion", () => {
    it("completes a root file", () => {
        expect(getCompletion("cat REA", createCtx()))
            .toBe("cat README.md");
    });

    it("completes a hidden root file", () => {
        expect(getCompletion("cat .git", createCtx()))
            .toBe("cat .gitconfig");
    });

    it("completes a root directory with trailing slash", () => {
        expect(getCompletion("cd Doc", createCtx()))
            .toBe("cd Documents/");
    });

    it("completes a nested file", () => {
        expect(
            getCompletion(
                "cat Projects/ghostty-config/REA",
                createCtx(),
            ),
        ).toBe(
            "cat Projects/ghostty-config/README.md",
        );
    });

    it("completes a deeply nested file", () => {
        expect(
            getCompletion(
                "cat Projects/ghostty-config/src/ind",
                createCtx(),
            ),
        ).toBe(
            "cat Projects/ghostty-config/src/index.ts",
        );
    });

    it("completes relative paths from cwd", () => {
        const ctx = createCtx(["Projects", "ghostty-config"]);

        expect(getCompletion("cat src/ind", ctx))
            .toBe("cat src/index.ts");
    });

    it("supports parent directory traversal", () => {
        const ctx = createCtx(["Projects", "ghostty-config"]);

        expect(getCompletion("cat ../gho", ctx))
            .toBe("cat ../ghostty-config/");
    });

    it("supports absolute paths", () => {
        expect(getCompletion("cat /REA", createCtx()))
            .toBe("cat /README.md");
    });

    it("supports home-relative paths", () => {
        expect(getCompletion("cat ~/REA", createCtx()))
            .toBe("cat ~/README.md");
    });

    it("returns null for nonexistent paths", () => {
        expect(getCompletion("cat does-not-exist", createCtx()))
            .toBeNull();
    });

    it("returns null when parent directory does not exist", () => {
        expect(getCompletion("cat missing/file", createCtx()))
            .toBeNull();
    });

    it("appends slash when completing a directory", () => {
        expect(getCompletion("cat Projects", createCtx()))
            .toBe("cat Projects/");
    });
});

describe("getCompletion - longest common prefix behavior", () => {
    it("returns shared prefix for multiple root directories", () => {
        expect(getCompletion("cat Pr", createCtx()))
            .toBe("cat Pro");
    });

    it("returns null when input already equals the longest common prefix", () => {
        expect(getCompletion("cat Do", createCtx()))
            .toBeNull();
    });

    it("returns shared prefix for multiple files", () => {
        expect(getCompletion("cat Documents/no", createCtx()))
            .toBe("cat Documents/note");
    });

    it("returns null when multiple matches have no additional shared prefix", () => {
        expect(getCompletion("cat ", createCtx()))
            .toBeNull();
    });
});

describe("getCompletion - trailing space behavior", () => {
    it("starts completion of a new argument after a space", () => {
        expect(getCompletion("cat ", createCtx()))
            .toBeNull();
    });

    it("completes the next argument after a command and space", () => {
        expect(getCompletion("cat REA", createCtx()))
            .toBe("cat README.md");
    });
});

describe("getCompletion - quoted arguments", () => {
    it("completes the final argument when earlier arguments are quoted", () => {
        expect(
            getCompletion(
                "cat \"some file\" REA",
                createCtx(),
            ),
        ).toBe(
            "cat \"some file\" README.md",
        );
    });

    it("completes paths after single-quoted arguments", () => {
        expect(
            getCompletion(
                "cat 'another file' Proj",
                createCtx(),
            ),
        ).toBe(
            "cat 'another file' Projects/",
        );
    });
});