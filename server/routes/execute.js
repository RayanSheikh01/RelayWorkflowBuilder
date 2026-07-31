// POST /api/execute/node dispatches { type, data, inputs } to handlers
import { handle as promptHandler } from '../handlers/promptHandler.js';
import { handle as apiHandler } from '../handlers/apiHandler.js';
import { handle as llmHandler } from '../handlers/llmHandler.js';
import { handle as emailHandler } from '../handlers/emailHandler.js';
import { handle as pythonHandler } from '../handlers/pythonHandler.js';
import { handle as databaseHandler } from '../handlers/databaseHandler.js';
import { handle as searchHandler } from '../handlers/searchHandler.js';

export const executeNode = async (req, res) => {
    try {
        const { type, data, inputs } = req.body;

        if (!type) {
            return res.status(400).json({ error: "Node type is required" });
        }

        // Dispatch based on node type
        let result;
        switch (type) {
            case 'prompt':
                result = await promptHandler(data, inputs);
                break;
            case 'api':
                result = await apiHandler(data, inputs);
                break;
            case 'llm':
                result = await llmHandler(data, inputs);
                break;
            case 'email':
                result = await emailHandler(data, inputs);
                break;
            case 'python':
                result = await pythonHandler(data, inputs);
                break;
            case 'database':
                result = await databaseHandler(data, inputs);
                break;
            case 'search':
                result = await searchHandler(data, inputs);
                break;
            default:
                return res.status(400).json({ error: `Unknown node type: ${type}` });
        }
        
        return res.status(200).json(result);

    } catch (error) {
        console.error("Error executing workflow node:", error);
        res.status(500).json({ error: error.message || "Failed to execute workflow node" });
    }
}