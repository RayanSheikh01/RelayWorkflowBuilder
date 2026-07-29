const nodeDefs = {
  prompt: {
    type: "prompt",
    label: "Prompt",
    icon: "📝",
    color: "#A78BFA",
    inputs: ["data"],
    outputs: ["output"],
    defaultData: {
      template: "",
      variables: {}
    },
    schema: [
      { key: "template", type: "textarea", label: "Prompt Template" },
      { key: "variables", type: "key-value", label: "Variables" }
    ]
  },

  llm: {
    type: "llm",
    label: "LLM",
    icon: "🤖",
    color: "#34D399",
    inputs: ["prompt"],
    outputs: ["output"],
    defaultData: {
      provider: "gemini",
      model: "gemini-2.0-flash",
      temperature: 0.7,
      maxTokens: 1024,
      systemPrompt: "",
      apiKey: ""
    },
    schema: [
      { key: "provider", type: "select", label: "Provider", options: ["gemini", "ollama", "openai", "custom"] },
      { key: "model", type: "text", label: "Model" },
      { key: "temperature", type: "slider", label: "Temperature", min: 0, max: 2, step: 0.1 },
      { key: "maxTokens", type: "number", label: "Max Tokens" },
      { key: "systemPrompt", type: "textarea", label: "System Prompt" },
      { key: "apiKey", type: "password", label: "API Key" }
    ]
  },

  search: {
    type: "search",
    label: "Search",
    icon: "🔍",
    color: "#38BDF8",
    inputs: ["query"],
    outputs: ["output"],
    defaultData: {
      engine: "google",
      query: "",
      maxResults: 5
    },
    schema: [
      { key: "engine", type: "select", label: "Search Engine", options: ["google", "bing", "serper", "custom"] },
      { key: "query", type: "text", label: "Query" },
      { key: "maxResults", type: "number", label: "Max Results" }
    ]
  },

  database: {
    type: "database",
    label: "Database",
    icon: "💾",
    color: "#FB923C",
    inputs: ["params"],
    outputs: ["output"],
    defaultData: {
      operation: "query",
      connectionStr: "",
      dbType: "sqlite",
      query: ""
    },
    schema: [
      { key: "operation", type: "select", label: "Operation", options: ["query", "insert", "update", "delete"] },
      { key: "connectionStr", type: "text", label: "Connection String" },
      { key: "dbType", type: "select", label: "Database Type", options: ["sqlite", "postgresql", "mysql", "mongo"] },
      { key: "query", type: "textarea", label: "Query" }
    ]
  },

  python: {
    type: "python",
    label: "Python",
    icon: "🐍",
    color: "#FBBF24",
    inputs: ["input_data"],
    outputs: ["output"],
    defaultData: {
      code: "",
      packages: ""
    },
    schema: [
      { key: "code", type: "textarea", label: "Python Code" },
      { key: "packages", type: "text", label: "Packages (comma-separated)" }
    ]
  },

  api: {
    type: "api",
    label: "API",
    icon: "🔌",
    color: "#F472B6",
    inputs: ["data"],
    outputs: ["output"],
    defaultData: {
      method: "GET",
      url: "",
      headers: {},
      body: "",
      auth: "none"
    },
    schema: [
      { key: "method", type: "select", label: "Method", options: ["GET", "POST", "PUT", "PATCH", "DELETE"] },
      { key: "url", type: "text", label: "URL" },
      { key: "headers", type: "key-value", label: "Headers" },
      { key: "body", type: "textarea", label: "Body (JSON)" },
      { key: "auth", type: "select", label: "Auth", options: ["none", "bearer", "basic", "api-key"] }
    ]
  },

  email: {
    type: "email",
    label: "Email",
    icon: "✉️",
    color: "#818CF8",
    inputs: ["content"],
    outputs: ["output"],
    defaultData: {
      to: "",
      subject: "",
      body: "",
      from: "",
      smtp: {}
    },
    schema: [
      { key: "to", type: "text", label: "To (recipients)" },
      { key: "subject", type: "text", label: "Subject" },
      { key: "body", type: "textarea", label: "Body" },
      { key: "from", type: "text", label: "From" },
      { key: "smtp", type: "key-value", label: "SMTP Settings" }
    ]
  }
};



export function getNodeDef(type) {
  return nodeDefs[type];
}

export function getAllNodeTypes() {
  return Object.keys(nodeDefs);
}