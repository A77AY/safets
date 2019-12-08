import * as fs from "fs";
import * as path from "path";

const DEFAULT_DEPTH = 20;
const FILE_PATH = path.join(__dirname, "get.ts");
const START = "// START GENERATED";
const END = "// END GENERATED";

fs.readFile(FILE_PATH, "utf-8", (err, buf) => {
    let data = buf.toString();
    const startIdx = data.indexOf(START) + START.length;
    const endIdx = data.indexOf(END);
    const startPart = data.slice(0, startIdx);
    const endPart = data.slice(endIdx);
    const separator = "\n\n";

    fs.writeFile(FILE_PATH, [startPart, separator, genInline(), separator, genByArray(), separator, getByDefault(), separator, endPart].join(""), err => {
        if (err) console.log(err);
        console.log("Successfully updated");
    });
});

const FUNCTION = "function get";
const EXPORT_FUNCTION = `export ${FUNCTION}`;

function getByKey(depth: number): string {
    return `T${new Array(depth)
        .fill(null)
        .map((_, i) => `[K${i}]`)
        .join("")}`;
}

function genLineInline(depth: number, defaultValue = ["D = undefined", "d?: Options<D>", "D"]) {
    const keys = new Array(depth).fill(null);
    const keysGenericType = keys.map((_, i) => `K${i} extends keyof ${getByKey(i)}`).join(", ");
    const keysAttrs = keys.map((_, i) => `k${i}: K${i}`).join(", ");

    const generic = ["T", keysGenericType, defaultValue[0]].filter(v => !!v).join(", ");
    const args = ["o: T", keysAttrs, defaultValue[1]].filter(v => !!v).join(", ");
    const returnType = [getByKey(depth), defaultValue[2]].filter(v => !!v).join(" | ");
    return `<${generic}>(${args}): ${returnType};`;
}

function genInline() {
    return (
        `/**
        * Inline
        * @param o object
        * @param k0 path
        * @param d options with default value
        */\n` +
        new Array(DEFAULT_DEPTH)
            .fill(null)
            .map((_, idx) => EXPORT_FUNCTION + genLineInline(idx + 1))
            .join("\n")
    );
}

function genLineByArray(depth: number, defaultValue = ["D = undefined", "d?: D", "D"]) {
    const keys = new Array(depth).fill(null);
    const keysGenericType = keys.map((_, i) => `K${i} extends keyof ${getByKey(i)}`).join(", ");
    const keysAttrType = `[${keys.map((_, i) => `K${i}`).join(", ")}]`;

    const generic = ["T", keysGenericType, defaultValue[0]].filter(v => !!v).join(", ");
    const args = ["o: T", `k: ${keysAttrType}`, defaultValue[1]].filter(v => !!v).join(", ");
    const returnType = [getByKey(depth), defaultValue[2]].filter(v => !!v).join(" | ");
    return `<${generic}>(${args}): ${returnType};`;
}

function genByArray() {
    return (
        `/**
        * By array
        * @param o object
        * @param k path
        * @param d default value
        */\n` +
        new Array(DEFAULT_DEPTH)
            .fill(null)
            .map((_, idx) => EXPORT_FUNCTION + genLineByArray(idx + 1))
            .join("\n")
    );
}

function getByDefault() {
    return (
        `/**
        * By default
        * @param d default value
        */
        export function get<D>(d: D): {\n` +
        "// Inline\n" +
        new Array(DEFAULT_DEPTH)
            .fill(null)
            .map((_, idx) => genLineInline(idx + 1, [, , "D"]))
            .join("\n") +
        "\n\n" +
        "// By array\n" +
        new Array(DEFAULT_DEPTH)
            .fill(null)
            .map((_, idx) => genLineByArray(idx + 1, [, , "D"]))
            .join("\n") +
        "\n}"
    );
}

function getObjectByKeyType(all: number, i: number = 0) {
    const innerObject = i + 1 === all ? "any" : getObjectByKeyType(all, i + 1);
    return `{ [n${i} in K${i}]: ${innerObject} }`;
}

function getObjectByKeyType2(all: number, i: number = 0) {
    if (i + 1 === all) {
        return `K${i}`;
    }
    const innerObject = getObjectByKeyType2(all, i + 1);
    return `{ [n${i} in K${i}]: ${innerObject} }`;
}

function genByObject() {
    return (
        "// By object\n" +
        `type K = string | number | symbol;\n` +
        new Array(DEFAULT_DEPTH)
            .fill(null)
            .map((_, idx) => {
                const depth = idx + 1;
                const keys = new Array(depth).fill(null);
                const keysGenericType = keys.map((_, i) => `K${i} extends K`).join(", ");
                const keysAttrType = getObjectByKeyType2(depth);
                const returnType = `${getByKey(depth)} | D`;
                return `export function get<T extends ${getObjectByKeyType(depth)}, ${keysGenericType}, D = undefined>(o: T, k: ${keysAttrType}, d?: D): ${returnType};`;
            })
            .join("\n")
    );
}
