# Get Util

**Designed special for TypeScript**

Gets the value at path of object.

💡 Inspired by lodash, but rethought & **has cool types**.

|                 | Right path                              | Wrong path    | Language tips              | JS specific paths                              | Size                               |
| --------------- | --------------------------------------- | ------------- | -------------------------- | ---------------------------------------------- | ---------------------------------- |
| **@safets/get** | ➕ return right type                    | ➕ **error**  | ➕/➖ **with inline path** | ➕ **unnecessary for TS**                      | ➕ **without JS specific options** |
| lodash.get      | ➕/➖ return right type with array path | ➖ return any | ➖ not worked with array   | ➕/➖ has unnecessary for TS JS specific paths | ➖ has JS specific options         |

## Installation

```sh
npm i -S @safets/get
```

## Usage

Complete object:

```ts
const obj = { a: [{ b: 3 as const }] };

// Inline
get(obj, "a", 0, "b"); // 3: 3 | undefined

// By array with default
get(obj, ["a", 0], "default"); // {b: 3}:  {b: 3} | 'default'
```

Incomplete object:

```ts
const partialObj = ({ a: [] } as any) as { a: [{ b: 3 }] };

// Inline
get(partialObj, "a", 0, "b"); // undefined: 3 | undefined

// By array with default
get(partialObj, ["a", 0], "default"); // 'default': 'default' | {b: 3}
```

With default:

```ts
const partialObj = ({ a: [] } as any) as { a: [{ b: 3 }] };

// Inline
get("default")(partialObj, "a", 0); // 'default': string | {b: 3}

// With default null
getOrNull(partialObj, "a", 0, "b"); // null:  3 | null
```

## Documentation

### Inline

```ts
get(object: any, ...path: (string | number | symbol)[], defaultValue?: {default: any});
```

-   ➕ Conciseness
-   ➕ Language tips work
-   ➖ Verbose use of default value

### By array

```ts
get(default: any)(object: any, ...path: (string | number | symbol)[]);
```

-   ➕ Simple use of default value
-   ➖ Language tips don't work

### From default value

Can be combined with any of the options:

-   Inline:

    ```ts
    get(default: any)(object: any, ...path: (string | number | symbol)[]);
    ```

-   By array:

    ```ts
    get(default: any)(object: any, ...path: (string | number | symbol)[]);
    ```

With default `null`:

```ts
getOrNull(object: any, ...path: (string | number | symbol)[]);
```

### ~~Strict get~~

**🚫 not implemented, ⚠️ experemental**

Strict version of `get` ~~(better use it)~~.

### ~~By object~~

**🚫 not implemented, ⚠️ experemental**

-   ➕ Simple use of default value
-   ➖ Language tips don't work

It seems pointless implementirovanie.

### ~~By function~~

**🚫 not implemented, ⚠️ experemental**

Error handling:

-   ➕ Most concise
-   ➕ Language tips work
-   ➕ No maximum length limit
-   ➖ Catch is very slow

Parsinng function body (most likely this option will remain experimental):

-   ➕ Most concise
-   ➕ Language tips work
-   ➕ No maximum length limit
-   ➕ Fast
-   ➖ Dangerous (not production yet)

### ~~Proxy~~

**🚫 not implemented, ⚠️ experemental**

-   ➕ Most concise
-   ➕ Language tips work
-   ➕ No maximum length limit
-   ➕ Fast
-   ➖ Does not work on older browsers

## Arguments

1.  `object: any`

    The object through which passes.

1.  `path: (string | number | symbol) | (string | number | symbol)[]`

    Listing object properties in depth.

    Limitations:

    -   maximum depth: 20 (no limitation for "by function" version).

1.  `defaultValue: any | {default: any}`

    Default value.

    Don't pass `undefined` and `null` default value directly because they are cast to `any` (applies only to `get`)

    -   Use `get` without default value for `undefined` default value
    -   Use `getOrNull` without default value for `null` default value
