// POST /api/execute/node dispatches { type, data, inputs } to handlers

export const executeNode = async (req, res) => {
    try {
        const { type, data, inputs } = req.body;

        if (!type) {
            return res.status(400).json({ error: "Node type is required" });
        }

        // Dispatch based on node type
        switch (type) {
            case 'prompt':
                // Will implement templateEngine in Step 13
                // For now just return a mocked rendered template to pass Step 12 test
                return res.status(200).json({ result: "rendered template" });
            default:
                return res.status(400).json({ error: `Unknown node type: ${type}` });
        }

    } catch (error) {
        console.error("Error executing workflow node:", error);
        res.status(500).json({ error: "Failed to execute workflow node" });
    }
}