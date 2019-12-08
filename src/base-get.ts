export function baseGet(object: any, path: string[], defaultValue: any): any {
    let result = object;
    for (var i = 0; i < path.length; ++i) {
        if (path[i] in result) {
            result = result[path[i]];
        } else {
            return defaultValue;
        }
    }
    return result;
}
