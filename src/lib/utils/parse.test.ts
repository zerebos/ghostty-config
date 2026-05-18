import {describe, expect, it} from "vitest";
import parse from "./parse";

describe("parse", () => {
    it("keeps repeatable font family entries", () => {
        expect(parse("font-family = JetBrainsMono NF\nfont-family = Noto Color Emoji")).toMatchObject({
            fontFamily: ["JetBrainsMono NF", "Noto Color Emoji"]
        });
    });
});
