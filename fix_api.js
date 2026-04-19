const fs = require("fs");
let content = fs.readFileSync("lib/api-services.js", "utf-8");
content = content.replace(/\/\/ Pages API[\s\S]*/, `// Pages API
export const pagesApi = {
  getAll: () => apiClient.get("/pages"),
  getBySlug: (slug) => apiClient.get(\`/pages/\${slug}\`),
  update: (slug, data) => apiClient.put(\`/pages/\${slug}\`, data)
};
`);
fs.writeFileSync("lib/api-services.js", content);

