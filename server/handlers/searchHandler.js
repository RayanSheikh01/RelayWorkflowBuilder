import { interpolate } from '../../src/utils/templateEngine.js';

export async function handle(data, inputs) {
    const query = interpolate(data.query || '', inputs);
    
    try {
        // Fallback to wikipedia API for a simple, free search implementation
        const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Search API returned status ${response.status}`);
        }
        
        const json = await response.json();
        const results = json.query?.search || [];
        if (results.length > 0) {
            // Strip HTML from snippet
            return { output: results[0].snippet.replace(/<[^>]*>?/gm, '') };
        }
        
        return { output: "No results found" };
    } catch (error) {
        throw new Error(`Search Error: ${error.message}`);
    }
}
