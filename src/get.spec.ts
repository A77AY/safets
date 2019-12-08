import { get } from "./get";
import { assert, IsExact } from "conditional-type-checks";

const AB1 = { a: { b: 1 as const } };
const AB1_FAKE = ({ a: {} } as any) as typeof AB1;

describe("Get", () => {
    describe("inline", () => {
        it("get value", () => {
            const e = get(AB1, "a", "b");
            assert<IsExact<typeof e, 1 | undefined>>(true);
            expect(e).toEqual(1);
        });
        it("default - undefined", () => {
            const e = get(AB1_FAKE, "a", "b");
            assert<IsExact<typeof e, 1 | undefined>>(true);
            expect(e).toBeUndefined();
        });
        it("default null", () => {
            const e = get(AB1_FAKE, "a", "b", { default: null as null });
            assert<IsExact<typeof e, 1 | null>>(true);
            expect(e).toBeNull();
        });
        it("default string", () => {
            const d = "hello world";
            const e = get(AB1_FAKE, "a", "b", { default: d });
            assert<IsExact<typeof e, string | 1>>(true);
            expect(e).toBe(d);
        });
    });

    describe("by array", () => {
        it("get value", () => {
            const e = get(AB1, ["a", "b"]);
            expect(e).toEqual(1);
        });
        it("default - undefined", () => {
            const e = get(AB1_FAKE, ["a", "b"]);
            expect(e).toBeUndefined();
        });
        it("default null", () => {
            const e = get(AB1_FAKE, ["a", "b"], null);
            expect(e).toBeNull();
        });
    });

    describe("by default", () => {
        describe("inline", () => {
            it("get value", () => {
                const e = get(undefined)(AB1, "a", "b");
                expect(e).toEqual(1);
            });
            it("default - undefined", () => {
                const e = get(undefined)(AB1_FAKE, "a", "b");
                expect(e).toBeUndefined();
            });
            it("default null", () => {
                const e = get(null)(AB1_FAKE, "a", "b");
                expect(e).toBeNull();
            });
        });

        describe("by array", () => {
            it("get value", () => {
                const e = get(undefined)(AB1, ["a", "b"]);
                expect(e).toEqual(1);
            });
            it("default - undefined", () => {
                const e = get(undefined)(AB1_FAKE, ["a", "b"]);
                expect(e).toBeUndefined();
            });
            it("default null", () => {
                const e = get(null)(AB1_FAKE, ["a", "b"]);
                expect(e).toBeNull();
            });
        });
    });
});
