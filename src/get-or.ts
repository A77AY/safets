import { baseGet } from "./base-get";

export function getOr<D = undefined>(d: D): any;

/**
 * Create Get with default value
 */
export function getOr() {
    const defaultValue: any = arguments[0];
    return function() {
        // by array
        if (Array.isArray(arguments[1])) {
            return baseGet(arguments[0], arguments[1], defaultValue);
        }

        // inline
        return baseGet(arguments[0], Array.prototype.slice.call(arguments, 1), defaultValue);
    };
}
