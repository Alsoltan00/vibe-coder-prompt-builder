const fs = require('fs');
let content = fs.readFileSync('src/lib/filter.ts', 'utf8');

// Replace signature
content = content.replace(
  "  language: LanguageId | '',\n): FilterResult<BackendHostingId> {",
  "  language: LanguageId | '',\n  projectType: ProjectTypeId | '' = '',\n): FilterResult<BackendHostingId> {"
);
content = content.replace(
  "  language: LanguageId | '',\r\n): FilterResult<BackendHostingId> {",
  "  language: LanguageId | '',\r\n  projectType: ProjectTypeId | '' = '',\r\n): FilterResult<BackendHostingId> {"
);

// Replace body
const oldBody = "  } else {\n    // Cloudflare Workers";
const newBody = "  } else {\n    // Exclude web serverless for desktop and mobile APIs\n    if (projectType === 'desktop-app' || projectType === 'mobile-app') {\n      exclude(excluded, 'vercel-functions', 'Vercel is for web frontends');\n      exclude(excluded, 'netlify-functions', 'Netlify is for web frontends');\n      exclude(excluded, 'cloudflare-workers', 'Cloudflare Workers is for edge web computing');\n    }\n    // Cloudflare Workers";
content = content.replace(oldBody, newBody);

const oldBodyR = "  } else {\r\n    // Cloudflare Workers";
const newBodyR = "  } else {\r\n    // Exclude web serverless for desktop and mobile APIs\r\n    if (projectType === 'desktop-app' || projectType === 'mobile-app') {\r\n      exclude(excluded, 'vercel-functions', 'Vercel is for web frontends');\r\n      exclude(excluded, 'netlify-functions', 'Netlify is for web frontends');\r\n      exclude(excluded, 'cloudflare-workers', 'Cloudflare Workers is for edge web computing');\r\n    }\r\n    // Cloudflare Workers";
content = content.replace(oldBodyR, newBodyR);

fs.writeFileSync('src/lib/filter.ts', content);
console.log("Fixed filter.ts");
