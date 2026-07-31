export function interpolate(template, variables = {}) {
    if (!template) return '';
    return template.replace(/\{\{([^}]+)\}\}/g, (match, key) => {
        const trimmedKey = key.trim();
        return variables[trimmedKey] !== undefined ? variables[trimmedKey] : match;
    });
}
