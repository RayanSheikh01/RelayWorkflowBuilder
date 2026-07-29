let uidCounter = 0;

export function uid(prefix = "node") {
    uidCounter += 1;
    return `${prefix}_${uidCounter}`;
}