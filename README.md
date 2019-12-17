# Get Util

**Designed special for TypeScript**

Gets the value at path of object.

💡 Inspired by lodash, but rethought and **has awesome types**.

|                 | Right path                              | Wrong path    | Language tips              | JS specific path (`string`)                | Size                                     |
| --------------- | --------------------------------------- | ------------- | -------------------------- | ------------------------------------------ | ---------------------------------------- |
| **@safets/get** | ➕ **return right type**                | ➕ **error**  | ➕/➖ **with inline path** | ➕ **unnecessary for TS**                  | ➕ **small, without JS specific option** |
| lodash.get      | ➕/➖ return right type with array path | ➖ return any | ➖ not worked with array   | ➖ has unnecessary for TS JS specific path | ➖ big, has JS specific option           |

## Installation

```sh
npm i -S @safets/get
```

## Usage

Fullfilled object:

```ts
const obj = { a: [{ b: 3 as const }] };

// Inline
get(obj, "a", 0, "b"); // 3: 3 | undefined

// By array with default
get(obj, ["a", 0], "default"); // {b: 3}:  {b: 3} | 'default'
```

Unfilled object:

```ts
const partialObj = ({ a: [] } as any) as { a: [{ b: 3 }] };

// Inline
get(partialObj, "a", 0, "b"); // undefined: 3 | undefined

// By array with default
get(partialObj, ["a", 0], "default"); // 'default': 'default' | {b: 3}
```

Unfilled object with default value:

```ts
const partialObj = ({ a: [] } as any) as { a: [{ b: 3 }] };

// Inline
get("default")(partialObj, "a", 0); // 'default': string | {b: 3}

// With default null
getOrNull(partialObj, "a", 0, "b"); // null:  3 | null
```

## Documentation

```ts
// Keys
type K = string | number | symbol;
```

### Inline

```ts
get(object: O, ...path: K[], options?: {default: D}): O[K0]... | D;
```

-   ➕ Conciseness
-   ➕ Language tips work
-   ➖ Verbose use of default value

### By array

```ts
get(default: O)(object: any, ...path: K[]): O[K0]... | D;
```

-   ➕ Simple use of default value
-   ➖ Language tips don't work

### From default value

Can be combined with any of the options:

-   Inline:

    ```ts
    get(default: D)(object: O, ...path: K[]): O[K0]... | D;
    ```

-   By array:

    ```ts
    get(default: D)(object: O, path: K[]): O[K0]... | D;
    ```

With default value `null`:

```ts
getOrNull(object: any, ...path: K[]);
```

### ~~Strict get~~

**🚫 not implemented**

Strict version of `get` ~~(better use it)~~.

### ~~By object~~

**🚫 not implemented, ⚠️ perhaps it makes no sense to implement**

-   ➕ Simple use of default value
-   ➖ Language tips don't work

### ~~By function~~

**🚫 not implemented, ⚠️ perhaps it makes no sense to implement**

Error handling:

-   ➕ Most concise
-   ➕ Language tips work
-   ➕ No maximum length limit
-   ➖ Catch is very slow

**🚫 not implemented, ⚠️ perhaps will remain experimental**

Parsing function body:

-   ➕ Most concise
-   ➕ Language tips work
-   ➕ No maximum length limit
-   ➕ Fast
-   ➖ Dangerous (not for production)

### ~~Proxy~~

**🚫 not implemented**

-   ➕ Most concise
-   ➕ Language tips work
-   ➕ No maximum length limit
-   ➕ Fast
-   ➖ Doesn't work on older browsers (IE11 and older)

## Arguments

1.  `object: any`

    The object through which passes.

1.  `path: (string | number | symbol)` / `Array<string | number | symbol>`

    Listing object properties in depth.

    Limitations:

    -   maximum depth: 20 (no limitation for "by function" and "proxy").

1.  `defaultValue: any` / `options: {default: any}`

    Default value.

    Don't pass `undefined` and `null` default value directly because they are cast to `any`.

    -   Use `get` without default value for default `undefined`.
    -   Use `getOrNull` without default value for default `null`.
