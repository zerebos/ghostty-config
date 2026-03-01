import {describe, expect, it} from "vitest";
import {
    canonicalTrigger,
    formatTrigger,
    getDiagnostics,
    parseKeybind,
    parseTrigger
} from "./keybinds";

describe("parseKeybind", () => {
    it("parses '+' key with modifiers", () => {
        const parsed = parseKeybind("ctrl++=ignore");

        expect(parsed.error).toEqual([]);
        expect(parsed.trigger?.steps).toEqual([{key: "+", modifiers: ["ctrl"]}]);
        expect(parsed.action).toBe("ignore");
    });

    it("parses '+' key without modifiers", () => {
        const parsed = parseKeybind("+=ignore");

        expect(parsed.error).toEqual([]);
        expect(parsed.trigger?.steps).toEqual([{key: "+", modifiers: []}]);
        expect(parsed.action).toBe("ignore");
    });

    it("keeps incomplete triggers invalid", () => {
        const parsed = parseKeybind("ctrl+=ignore");

        expect(parsed.error).toContain("invalid trigger format");
    });

    it("supports ghostty-style physical keys", () => {
        const parsed = parseKeybind("super+physical:five=goto_tab:5");

        expect(parsed.error).toEqual([]);
        expect(parsed.trigger?.steps).toEqual([{key: "physical:five", modifiers: ["super"]}]);
        expect(parsed.action).toBe("goto_tab");
        expect(parsed.args).toBe("5");
    });

    it("normalizes modifier aliases", () => {
        const parsed = parseKeybind("command+option+control+a=ignore");

        expect(parsed.error).toEqual([]);
        expect(parsed.trigger?.steps).toEqual([{key: "a", modifiers: ["super", "alt", "ctrl"]}]);
    });

    it("rejects unknown actions", () => {
        const parsed = parseKeybind("ctrl+a=does_not_exist");

        expect(parsed.error).toContain("unknown action 'does_not_exist'");
    });

    it("rejects arguments on no-argument actions", () => {
        const parsed = parseKeybind("ctrl+a=paste_from_clipboard:oops");

        expect(parsed.error).toContain("'paste_from_clipboard' does not take arguments");
    });

    it("validates enum action arguments", () => {
        const parsed = parseKeybind("ctrl+a=copy_to_clipboard:invalid");

        expect(parsed.error).toContain("Invalid value for 'copy_to_clipboard': 'invalid'");
    });

    it("validates number action arguments", () => {
        const parsed = parseKeybind("ctrl+equal=increase_font_size:nope");

        expect(parsed.error).toContain("'increase_font_size' expects a number, got 'nope'");
    });

    it("validates integer action arguments", () => {
        const parsed = parseKeybind("ctrl+arrow_up=jump_to_prompt:1.5");

        expect(parsed.error).toContain("'jump_to_prompt' expects an integer, got '1.5'");
    });

    it("validates resize action arguments", () => {
        const parsed = parseKeybind("ctrl+arrow_left=resize_split:diagonal,10");

        expect(parsed.error).toContain("'resize_split' direction must be right, down, left, up, auto");
    });

    it("rejects global/all sequences", () => {
        const parsed = parseKeybind("global:ctrl+a>ctrl+b=ignore");

        expect(parsed.error).toContain("global/all keybinds cannot be sequences");
    });

    it("rejects invalid modifiers", () => {
        const parsed = parseKeybind("meh+a=ignore");

        expect(parsed.error).toContain("invalid modifier 'meh'");
    });

    it("rejects too many modifiers", () => {
        const parsed = parseKeybind("ctrl+alt+super+shift+meh+a=ignore");

        expect(parsed.error).toContain("too many modifiers");
    });

    it("rejects malformed keybinds missing '='", () => {
        const parsed = parseKeybind("ctrl+a");

        expect(parsed.error).toContain("missing '=' between trigger and action");
    });

    it("supports W3C key codes and normalizes them", () => {
        const parsed = parseKeybind("ctrl+KeyA=ignore");

        expect(parsed.error).toEqual([]);
        expect(parsed.trigger?.steps).toEqual([{key: "key_a", modifiers: ["ctrl"]}]);
    });

    it("supports additional W3C key code forms", () => {
        const parsed = parseKeybind("super+ArrowUp=jump_to_prompt:-1");

        expect(parsed.error).toEqual([]);
        expect(parsed.trigger?.steps).toEqual([{key: "arrow_up", modifiers: ["super"]}]);
        expect(parsed.action).toBe("jump_to_prompt");
        expect(parsed.args).toBe("-1");
    });
});

describe("parseTrigger", () => {
    it("parses prefixes and sequences", () => {
        const parsed = parseTrigger("global:unconsumed:ctrl+a>shift+b");

        expect(parsed).toEqual({
            prefixes: ["global", "unconsumed"],
            steps: [
                {key: "a", modifiers: ["ctrl"]},
                {key: "b", modifiers: ["shift"]}
            ]
        });
    });

    it("ignores trigger whitespace", () => {
        const parsed = parseTrigger("  ctrl + a  >  shift + b  ");

        expect(parsed?.steps).toEqual([
            {key: "a", modifiers: ["ctrl"]},
            {key: "b", modifiers: ["shift"]}
        ]);
    });

    it("rejects malformed chained steps", () => {
        expect(parseTrigger("ctrl+a>")).toBeNull();
        expect(parseTrigger("ctrl+a>>shift+b")).toBeNull();
        expect(parseTrigger(">ctrl+a")).toBeNull();
    });
});

describe("canonicalTrigger and formatTrigger", () => {
    it("normalizes modifier ordering for canonical keys", () => {
        const a = parseKeybind("super+ctrl+a=ignore").trigger;
        const b = parseKeybind("ctrl+super+a=ignore").trigger;

        expect(a).toBeTruthy();
        expect(b).toBeTruthy();
        expect(canonicalTrigger(a!)).toBe(canonicalTrigger(b!));
    });

    it("formats trigger from parsed values", () => {
        const trigger = parseKeybind("unconsumed:ctrl+shift+arrow_up=ignore").trigger;

        expect(trigger).toBeTruthy();
        expect(formatTrigger(trigger!)).toBe("unconsumed:ctrl+shift+arrow_up");
    });

    it("round-trips complex ghostty-style trigger formatting", () => {
        const source = "global:performable:super+physical:five>ctrl+shift+arrow_down=goto_tab:5";
        const parsed = parseKeybind(source);

        expect(parsed.error).toContain("global/all keybinds cannot be sequences");
        expect(parsed.trigger).toBeTruthy();

        const formatted = formatTrigger(parsed.trigger!);
        expect(formatted).toBe("global:performable:super+physical:five>ctrl+shift+arrow_down");

        const reparsed = parseTrigger(formatted);
        expect(reparsed).toBeTruthy();
        expect(canonicalTrigger(reparsed!)).toBe(canonicalTrigger(parsed.trigger!));
    });

    it("round-trips modifier aliases and canonicalizes order", () => {
        const source = "unconsumed:command+option+control+a=ignore";
        const parsed = parseKeybind(source);

        expect(parsed.error).toEqual([]);
        expect(parsed.trigger).toBeTruthy();

        const formatted = formatTrigger(parsed.trigger!);
        expect(formatted).toBe("unconsumed:alt+ctrl+super+a");

        const reparsed = parseTrigger(formatted);
        expect(reparsed).toBeTruthy();
        expect(canonicalTrigger(reparsed!)).toBe(canonicalTrigger(parsed.trigger!));
    });

    it("round-trips '+' key with modifiers", () => {
        const parsed = parseKeybind("ctrl++=ignore");

        expect(parsed.error).toEqual([]);
        expect(parsed.trigger).toBeTruthy();

        const formatted = formatTrigger(parsed.trigger!);
        expect(formatted).toBe("ctrl++");

        const reparsed = parseTrigger(formatted);
        expect(reparsed).toBeTruthy();
        expect(reparsed?.steps).toEqual([{key: "+", modifiers: ["ctrl"]}]);
    });
});

describe("getDiagnostics", () => {
    it("marks duplicates based on canonical trigger", () => {
        const diagnostics = getDiagnostics([
            "ctrl+super+a=ignore",
            "super+ctrl+a=ignore",
            "ctrl+b=ignore"
        ]);

        expect(diagnostics[0]?.duplicate).toBe(true);
        expect(diagnostics[1]?.duplicate).toBe(true);
        expect(diagnostics[2]?.duplicate).toBe(false);
        expect(diagnostics[0]?.status).toBe("ok");
    });

    it("marks invalid entries and keeps canonical blank when trigger fails", () => {
        const diagnostics = getDiagnostics(["ctrl+=ignore"]);

        expect(diagnostics[0]?.status).toBe("invalid");
        expect(diagnostics[0]?.canonical).toBe("");
        expect(diagnostics[0]?.errors).toContain("invalid trigger format");
    });

    it("treats W3C and ghostty key names as duplicate bindings", () => {
        const diagnostics = getDiagnostics(["ctrl+KeyA=ignore", "ctrl+key_a=ignore"]);

        expect(diagnostics[0]?.duplicate).toBe(true);
        expect(diagnostics[1]?.duplicate).toBe(true);
        expect(diagnostics[0]?.canonical).toBe("ctrl+key_a");
    });
});
