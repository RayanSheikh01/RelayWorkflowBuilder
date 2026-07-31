import { interpolate } from '../../src/utils/templateEngine.js';

export async function handle(data, inputs) {
    const url = interpolate(data.url || '', inputs || {});
    
    let headers = undefined;
    if (data.headers) {
        try {
            headers = typeof data.headers === 'string' ? JSON.parse(data.headers) : data.headers;
        } catch (e) {
            // ignore JSON parse error for headers
        }
    }

    try {
        const response = await fetch(url, {
            method: data.method || 'GET',
            headers
        });

        if (!response.ok) {
            throw new Error(`API returned status ${response.status}`);
        }

        const output = await response.json();
        return { output };
    } catch (error) {
        throw new Error(`API Error: ${error.message}`);
    }
}
