import { describe, test, expect, vi } from 'vitest';
import { handle } from '../../../server/handlers/apiHandler.js';

describe('apiHandler', () => {
    test('Makes GET request and returns parsed JSON', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ mock: "data" })
        });

        const result = await handle({ url: 'https://api.example.com/data' }, {});
        expect(result.output).toEqual({ mock: "data" });
    });

    test('Interpolates {{variables}} in URL', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({})
        });

        await handle({ url: 'https://api.example.com/users/{{id}}' }, { id: '123' });
        expect(global.fetch).toHaveBeenCalledWith('https://api.example.com/users/123', expect.any(Object));
    });
});
