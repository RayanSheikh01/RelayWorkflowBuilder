import express from "express";
import cors from "cors";

import { executeNode } from "./routes/execute.js";

const app = express();
app.use(cors()); // allow all origins for dev
app.use(express.json()); // parse JSON request bodies

app.post("/api/execute/node", executeNode);

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;