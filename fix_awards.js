const fs = require("fs");
let content = fs.readFileSync("lib/api-services.js", "utf-8");
content = content.replace(/apiClient\.get\(\/awards\/\+\$id\)/g, "apiClient.get(`/awards/${id}`)");
content = content.replace(/apiClient\.put\(\/awards\/\+\$id, data\)/g, "apiClient.put(`/awards/${id}`, data)");
content = content.replace(/apiClient\.delete\(\/awards\/\+\$id\)/g, "apiClient.delete(`/awards/${id}`)");

content = content.replace(/apiClient\.get\(\/videos\/\+\$id\)/g, "apiClient.get(`/videos/${id}`)");
content = content.replace(/apiClient\.put\(\/videos\/\+\$id, data\)/g, "apiClient.put(`/videos/${id}`, data)");
content = content.replace(/apiClient\.delete\(\/videos\/\+\$id\)/g, "apiClient.delete(`/videos/${id}`)");
fs.writeFileSync("lib/api-services.js", content);

