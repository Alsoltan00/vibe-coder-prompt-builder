const fs = require('fs');
let content = fs.readFileSync('src/lib/skill-generator.ts', 'utf8');

// 1. Fix scripts.test assignment in resolveProjectData
// Find the end of resolveProjectData where r.slug = slugify(...) is
const rSlugStr = "    r.slug = slugify(r.name) || 'project';\n    return r;\n  }";
const rSlugStrNew = "    if (r.testing.unit && r.testing.unit.id !== 'none') {\n      r.scripts.test = r.testing.unit.id === 'vitest' ? 'vitest' : r.testing.unit.id === 'jest' ? 'jest' : 'test';\n    }\n    r.slug = slugify(r.name) || 'project';\n    return r;\n  }";
content = content.replace("    r.slug = slugify(r.name) || 'project';\r\n    return r;\r\n  }", rSlugStrNew.replace(/\n/g, '\r\n'));
content = content.replace(rSlugStr, rSlugStrNew);


// 2. Fix electron-builder hardcoded string
const ebOld = "4. \\`build\\` — \\`${pkg} build\\` (electron-builder packages .exe / .dmg / .AppImage)";
const ebNew = "4. \\`build\\` — \\`${pkg} build\\` (${r.frontend?.id === 'tauri' ? 'Tauri builds' : 'electron-builder packages'} .exe / .dmg / .AppImage)";
content = content.replace(ebOld, ebNew);


// 3. Fix Preview deployment in DoD
const prOld = "    '- [ ] Preview deployment works on every PR',\n  );";
const prNew = "    ...(r.identity.type === 'web-app' ? ['- [ ] Preview deployment works on every PR'] : [])\n  );";
content = content.replace(prOld, prNew);
const prOldR = "    '- [ ] Preview deployment works on every PR',\r\n  );";
const prNewR = "    ...(r.identity.type === 'web-app' ? ['- [ ] Preview deployment works on every PR'] : [])\r\n  );";
content = content.replace(prOldR, prNewR);

fs.writeFileSync('src/lib/skill-generator.ts', content);
console.log("Fixed Tauri issues");
