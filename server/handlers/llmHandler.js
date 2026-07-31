import { GoogleGenerativeAI } from '@google/generative-ai';
import { interpolate } from '../../src/utils/templateEngine.js';

export async function handle(data, inputs) {
    const apiKey = data.apiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('Gemini API key is required');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: data.model || 'gemini-1.5-pro' });

    const prompt = interpolate(data.prompt || '', inputs || {});
    
    try {
        const result = await model.generateContent(prompt);
        return { output: result.response.text() };
    } catch (error) {
        throw new Error(`LLM Error: ${error.message}`);
    }
}
