let uidCounter = 0;

export function generateUID(prefix = "node") {
    uidCounter += 1;
    return `${prefix}_${uidCounter}`;
}