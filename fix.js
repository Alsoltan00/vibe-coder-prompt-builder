const fs = require('fs');
let content = fs.readFileSync('src/lib/skill-generator.ts', 'utf8');

content = content.replace(
  /const r = \{\s*\.\.\.data,\s*scripts: getScripts\(data\.language\?\.id \?\? 'typescript', data\.frontend\?\.id \?\? 'none'\),\s*\};/g,
  const r = {\n    ...data,\n    scripts: getScripts(data.language?.id ?? 'typescript', data.frontend?.id ?? 'none'),\n  };\n  if (r.testing?.unit?.id === 'vitest') r.scripts.test = 'vitest run';\n  else if (r.testing?.unit?.id === 'jest') r.scripts.test = 'jest';
);

content = content.replace(
  /return skillTemplate;\s*\}/g,
  eturn skillTemplate.replace(/,\\\\n(\\\\s*[}\\\\]])/g, '\\\\n');\\n}
);

content = content.replace(
  /- \*\*Components:\*\* function components \+ hooks only\. No class components\./g,
  - **Components:** \
);
content = content.replace(
  /- \*\*Naming:\*\* PascalCase files for components \(\\\Button\.tsx\\\\); camelCase for utilities\./g,
  - **Naming:** PascalCase files for components (\\\Button.\\\\); camelCase for utilities.
);

fs.writeFileSync('src/lib/skill-generator.ts', content);
