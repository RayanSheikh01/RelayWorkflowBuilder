import { describe, test, expect } from 'vitest';
import { handle } from '../../../server/handlers/promptHandler.js';

describe('promptHandler', () => {
    test('Renders template with inputs', async () => {
        const result = await handle({ template: 'Hello {{name}}' }, { name: 'World' });
        expect(result.output).toBe('Hello World');
    });

    test('Returns raw template when no inputs match', async () => {
        const result = await handle({ template: 'Hello {{name}}' }, { other: 'Thing' });
        expect(result.output).toBe('Hello {{name}}');
    });
});
