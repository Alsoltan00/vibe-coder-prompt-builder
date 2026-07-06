const fs = require('fs');
let content = fs.readFileSync('src/lib/skill-generator.ts', 'utf8');

// 1. Add Env Variables to Security Rules
const oldSecurity = "| Input validation | ${this.validatorChoice(r)} at the API boundary |";
const newSecurity = "| Input validation | ${this.validatorChoice(r)} at the API boundary |\n| Env Variables | Strict type-checking at build time via t3-env / Zod |";
content = content.replace(oldSecurity, newSecurity);

// 2. Add t3-env to Dependencies
const oldNext = '    lines.push(`  "react": "^18.3.1", "react-dom": "^18.3.1",`);\n  } else if (r.frontend?.id === \'remix\') {';
const newNext = '    lines.push(`  "react": "^18.3.1", "react-dom": "^18.3.1",`);\n    if (r.language?.id === \'typescript\') lines.push(`  "@t3-oss/env-nextjs": "^0.11.1",`);\n  } else if (r.frontend?.id === \'remix\') {';
content = content.replace(oldNext, newNext);

// for other backends (if language is typescript, add @t3-oss/env-core)
const oldTs = '  if (r.language?.id === \'typescript\') {\n    lines.push(`  "typescript": "^5.6.0",`);\n  }';
const newTs = '  if (r.language?.id === \'typescript\') {\n    lines.push(`  "typescript": "^5.6.0",`);\n    if (r.frontend?.id !== \'nextjs\' && (r.backend && r.backend !== \'none\')) {\n      lines.push(`  "@t3-oss/env-core": "^0.11.1",`);\n    }\n  }';
content = content.replace(oldTs, newTs);

// Handle CRLF if needed
if(content.indexOf(newSecurity) === -1) {
  content = content.replace(
    "| Input validation | ${this.validatorChoice(r)} at the API boundary |\r\n| CSRF",
    "| Input validation | ${this.validatorChoice(r)} at the API boundary |\r\n| Env Variables | Strict type-checking at build time via t3-env / Zod |\r\n| CSRF"
  );
}

if(content.indexOf("@t3-oss/env-nextjs") === -1) {
    content = content.replace(
        '    lines.push(`  "react": "^18.3.1", "react-dom": "^18.3.1",`);\r\n  } else if (r.frontend?.id === \'remix\') {',
        '    lines.push(`  "react": "^18.3.1", "react-dom": "^18.3.1",`);\r\n    if (r.language?.id === \'typescript\') lines.push(`  "@t3-oss/env-nextjs": "^0.11.1",`);\r\n  } else if (r.frontend?.id === \'remix\') {'
    );
}

if(content.indexOf("@t3-oss/env-core") === -1) {
    content = content.replace(
        '  if (r.language?.id === \'typescript\') {\r\n    lines.push(`  "typescript": "^5.6.0",`);\r\n  }',
        '  if (r.language?.id === \'typescript\') {\r\n    lines.push(`  "typescript": "^5.6.0",`);\r\n    if (r.frontend?.id !== \'nextjs\' && (r.backend && r.backend !== \'none\')) {\r\n      lines.push(`  "@t3-oss/env-core": "^0.11.1",`);\r\n    }\r\n  }'
    );
}


fs.writeFileSync('src/lib/skill-generator.ts', content);
console.log("Injected T3 Env standards");
