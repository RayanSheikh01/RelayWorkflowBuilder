import { interpolate } from '../../src/utils/templateEngine.js';

export async function handle(data, inputs) {
    const output = interpolate(data.template || '', inputs || {});
    return { output };
}
