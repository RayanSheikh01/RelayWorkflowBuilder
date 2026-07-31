import { describe, test, expect } from 'vitest';
import request from 'supertest';
import app from '../../server/index.js';

describe('Server Routes', () => {
    test('POST /api/execute/node with type "prompt" returns rendered template', async () => {
        const response = await request(app)
            .post('/api/execute/node')
            .send({
                type: 'prompt',
                data: { template: 'Hello {{name}}' },
                inputs: { name: 'World' }
            });

        expect(response.status).toBe(200);
        // We will test actual template rendering in Step 13, for now it just shouldn't error.
    });

    test('POST /api/execute/node with unknown type returns 400 error', async () => {
        const response = await request(app)
            .post('/api/execute/node')
            .send({
                type: 'unknown_type_123',
                data: {},
                inputs: {}
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
    });
});
