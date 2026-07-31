import { describe, test, expect } from 'vitest';
import { interpolate } from '../../src/utils/templateEngine.js';

describe('templateEngine', () => {
    test('Replaces a single {{variable}}', () => {
        expect(interpolate('Hello {{name}}', { name: 'World' })).toBe('Hello World');
    });

    test('Replaces multiple variables in one template', () => {
        expect(interpolate('{{greeting}} {{name}}!', { greeting: 'Hi', name: 'Alice' })).toBe('Hi Alice!');
    });

    test('Leaves unknown {{variables}} as-is', () => {
        expect(interpolate('Hello {{name}}', {})).toBe('Hello {{name}}');
    });

    test('Handles empty template string', () => {
        expect(interpolate('', { name: 'World' })).toBe('');
    });

    test('Handles template with no variables (passthrough)', () => {
        expect(interpolate('Hello World', { name: 'Alice' })).toBe('Hello World');
    });

    test('Handles repeated occurrences of same variable', () => {
        expect(interpolate('{{a}} {{a}} {{a}}', { a: '1' })).toBe('1 1 1');
    });
});
