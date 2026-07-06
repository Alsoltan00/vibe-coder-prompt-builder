/**
 * MEGA PATCH — 7 improvements to eliminate ALL contradictions
 * Based on research from: create-t3-app, Wasp, create-tauri-app, create-expo-app, create-next-app
 */
const fs = require('fs');
let content = fs.readFileSync('src/lib/skill-generator.ts', 'utf8');
let applied = [];

// ═══════════════════════════════════════════════════════════════════
// FIX 1: Test Runner Engine — pickScripts should NOT decide test runner
// The user's testing.unit choice must override the default
// ═══════════════════════════════════════════════════════════════════

// 1a. Make pickScripts return a placeholder test value
content = content.replace(
  "      // Electron uses Jest (bundled via electron-forge); other TS/JS apps use vitest\n      test: frontend === 'electron' ? 'jest' : 'vitest',",
  "      // Test runner is overridden by resolve() based on user's testing.unit choice\n      test: 'test',"
);
content = content.replace(
  "      // Electron uses Jest (bundled via electron-forge); other TS/JS apps use vitest\r\n      test: frontend === 'electron' ? 'jest' : 'vitest',",
  "      // Test runner is overridden by resolve() based on user's testing.unit choice\r\n      test: 'test',"
);

// 1b. Make default scripts test placeholder too
content = content.replace(
  "    test: 'vitest',\n  };\n  // Node/JS/TS projects",
  "    test: 'test',\n  };\n  // Node/JS/TS projects"
);
content = content.replace(
  "    test: 'vitest',\r\n  };\r\n  // Node/JS/TS projects",
  "    test: 'test',\r\n  };\r\n  // Node/JS/TS projects"
);

// 1c. Update resolve() to set the test script based on user choice
// Find the line after scripts assignment and before r.slug
const resolveOld = "    scripts: pickScripts(s.frontend, data.language),\n  };\n  if (r.testing.unit && r.testing.unit.id !== 'none') {\n    r.scripts.test = r.testing.unit.id === 'vitest' ? 'vitest' : r.testing.unit.id === 'jest' ? 'jest' : 'test';\n  }\n  r.slug";
const resolveNew = "    scripts: pickScripts(s.frontend, data.language),\n  };\n  // Override test script from user's explicit testing.unit choice\n  const TEST_COMMANDS: Record<string, string> = {\n    vitest: 'vitest',\n    jest: 'jest',\n    pytest: 'pytest',\n    'go-test': 'go test ./...',\n    'cargo-test': 'cargo test',\n    'dotnet-test': 'dotnet test',\n    rspec: 'rspec',\n    phpunit: 'phpunit',\n    'elixir-test': 'mix test',\n    'dart-test': 'dart test',\n  };\n  if (r.testing.unit && r.testing.unit.id !== 'none') {\n    r.scripts.test = TEST_COMMANDS[r.testing.unit.id] || r.testing.unit.id;\n  }\n  r.slug";
content = content.replace(resolveOld, resolveNew);
content = content.replace(resolveOld.replace(/\n/g, '\r\n'), resolveNew.replace(/\n/g, '\r\n'));

applied.push('FIX 1: Test runner engine');

// ═══════════════════════════════════════════════════════════════════
// FIX 2: CI/CD desktop build label — Tauri vs Electron
// ═══════════════════════════════════════════════════════════════════

// Already partially done, but let's also fix the hardcoded "electron-builder" in the generic text
content = content.replace(
  "electron-builder packages .exe / .dmg / .AppImage)",
  "${r.frontend?.id === 'tauri' ? 'cargo tauri build' : 'electron-builder'} packages .exe / .dmg / .AppImage)"
);

applied.push('FIX 2: CI/CD desktop build label');

// ═══════════════════════════════════════════════════════════════════
// FIX 3: Trust Boundary security rows for Desktop apps
// ═══════════════════════════════════════════════════════════════════

const securityOld = "${r.db.primary && r.db.primary.id === 'supabase-db' ? '| RLS | enabled on every table; deny by default |' : ''}";
const securityNew = `\${r.db.primary && r.db.primary.id === 'supabase-db' ? '| RLS | enabled on every table; deny by default |' : ''}
\${(r.frontend?.id === 'tauri' || r.frontend?.id === 'electron') ? \`| Trust boundary | Frontend is UNTRUSTED. All sensitive ops go through \${r.frontend?.id === 'tauri' ? 'Tauri Commands (invoke)' : 'IPC (ipcMain/ipcRenderer)'} |
| Secret storage | Platform-native (\${r.frontend?.id === 'tauri' ? 'keyring crate → ' : ''}Windows Credential Manager / macOS Keychain / Linux Secret Service) |
| IPC security | Whitelist allowed \${r.frontend?.id === 'tauri' ? 'commands in tauri.conf.json capabilities' : 'IPC channels in preload.ts'} |\` : ''}`;

content = content.replace(securityOld, securityNew);

applied.push('FIX 3: Trust Boundary security');

// ═══════════════════════════════════════════════════════════════════
// FIX 4: Generate env.ts schema section
// ═══════════════════════════════════════════════════════════════════

// Add generateEnvSchema method after the security section (after --- before ## 5. Database)
const dbSectionMarker = "## 5. Database (${r.db.primary?.name ?? 'SQLite local'})";
const envSection = `## 4b. Environment Variables (Type-Safe)

\${(() => {
  const isNext = r.frontend?.id === 'nextjs';
  const envPkg = isNext ? '@t3-oss/env-nextjs' : '@t3-oss/env-core';
  const lines = [];
  lines.push(\`Create \\\`src/env.ts\\\` with strict Zod validation:\\\n\\\`\\\`\\\`ts\\\nimport { createEnv } from "\${envPkg}";\\\nimport { z } from "zod";\\\n\\\nexport const env = createEnv({\\\n  server: {\`);
  if (r.db.primary && r.db.primary.id !== 'none' && r.db.primary.id !== 'sqlite') {
    lines.push(\`    DATABASE_URL: z.string().url(),\`);
  }
  if (r.auth.primary && r.auth.primary.id !== 'none') {
    lines.push(\`    AUTH_SECRET: z.string().min(32),\`);
  }
  if (r.thirdParty.payments && r.thirdParty.payments.id !== 'none') {
    const prefix = r.thirdParty.payments.id === 'stripe' ? 'STRIPE' : r.thirdParty.payments.id === 'lemonsqueezy' ? 'LEMON_SQUEEZY' : 'PAYMENT';
    lines.push(\`    \${prefix}_SECRET_KEY: z.string().min(1),\`);
    lines.push(\`    \${prefix}_WEBHOOK_SECRET: z.string().min(1),\`);
  }
  if (r.thirdParty.monitoring && r.thirdParty.monitoring.id === 'sentry') {
    lines.push(\`    SENTRY_DSN: z.string().url(),\`);
  }
  if (r.thirdParty.storage && r.thirdParty.storage.id !== 'none') {
    lines.push(\`    S3_BUCKET: z.string().min(1),\`);
    lines.push(\`    S3_REGION: z.string().min(1),\`);
  }
  lines.push(\`  },\`);
  if (isNext || r.frontend?.id === 'react' || r.frontend?.id === 'vue' || r.frontend?.id === 'svelte') {
    const prefix = isNext ? 'NEXT_PUBLIC_' : 'VITE_';
    lines.push(\`  client: {\`);
    lines.push(\`    \${prefix}APP_URL: z.string().url(),\`);
    if (r.thirdParty.analytics && r.thirdParty.analytics.id !== 'none') {
      lines.push(\`    \${prefix}ANALYTICS_ID: z.string().min(1),\`);
    }
    lines.push(\`  },\`);
  }
  lines.push(\`});\\\n\\\`\\\`\\\`\\\n\\\n**Rule:** Import \\\`env\\\` from this file everywhere. Never use \\\`process.env\\\` directly.\`);
  return lines.join('\\n');
})()}

---

${dbSectionMarker}`;

content = content.replace(dbSectionMarker, envSection);

applied.push('FIX 4: env.ts schema generation');

// ═══════════════════════════════════════════════════════════════════
// FIX 5: Desktop Config Generation (tauri.conf.json / electron config)
// ═══════════════════════════════════════════════════════════════════

// Add after the file layout section (after ## 2. File Layout)
const codingConvMarker = "## 3. Coding Conventions${this.generateCodingConventions(r)}";
const desktopConfig = `\${(() => {
  if (r.frontend?.id === 'tauri') {
    return \`## 2b. Desktop Configuration (Tauri)

\\\`src-tauri/tauri.conf.json\\\`:
\\\`\\\`\\\`json
{
  "productName": "\${r.name}",
  "identifier": "com.\${r.slug}.app",
  "build": {
    "beforeBuildCommand": "\${r.devops.pkg?.id ?? 'pnpm'} build",
    "beforeDevCommand": "\${r.devops.pkg?.id ?? 'pnpm'} dev",
    "frontendDist": "../dist"
  },
  "app": {
    "security": {
      "csp": "default-src 'self'; script-src 'self'"
    },
    "windows": [{ "title": "\${r.name}", "width": 1200, "height": 800 }]
  },
  "bundle": {
    "active": true,
    "targets": ["nsis", "dmg", "appimage", "deb"],
    "icon": ["icons/32x32.png", "icons/128x128.png", "icons/icon.ico"]
  }
}
\\\`\\\`\\\`

\\\`src-tauri/src/lib.rs\\\`:
\\\`\\\`\\\`rust
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
\\\`\\\`\\\`

---

\`;
  }
  if (r.frontend?.id === 'electron') {
    return \`## 2b. Desktop Configuration (Electron)

\\\`forge.config.ts\\\`:
\\\`\\\`\\\`ts
import type { ForgeConfig } from '@electron-forge/shared-types';
const config: ForgeConfig = {
  packagerConfig: { name: '\${r.slug}', icon: './assets/icon' },
  makers: [
    { name: '@electron-forge/maker-squirrel', config: {} },
    { name: '@electron-forge/maker-dmg', config: {} },
    { name: '@electron-forge/maker-deb', config: {} },
  ],
};
export default config;
\\\`\\\`\\\`

---

\`;
  }
  return '';
})()}

${codingConvMarker}`;

content = content.replace(codingConvMarker, desktopConfig);

applied.push('FIX 5: Desktop config generation');

// ═══════════════════════════════════════════════════════════════════
// FIX 6: Mobile Config Generation (app.json for Expo/RN)
// ═══════════════════════════════════════════════════════════════════

// Add mobile config right after desktop config (before coding conventions)
const codingConvMarker2 = `${codingConvMarker}`;
const mobileConfig = `\${(() => {
  if (r.frontend?.id === 'expo' || r.frontend?.id === 'react-native') {
    return \`## 2c. Mobile Configuration (\${r.frontend?.name})

\\\`app.json\\\`:
\\\`\\\`\\\`json
{
  "expo": {
    "name": "\${r.name}",
    "slug": "\${r.slug}",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "\${r.slug}",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": { "bundleIdentifier": "com.\${r.slug}.app", "supportsTablet": true },
    "android": { "package": "com.\${r.slug}.app", "adaptiveIcon": { "foregroundImage": "./assets/adaptive-icon.png" } },
    "plugins": ["expo-router"]
  }
}
\\\`\\\`\\\`

---

\`;
  }
  return '';
})()}

${codingConvMarker2}`;

// We need to add mobile config AFTER the desktop config, before coding conventions
// Since desktop config already prepends to codingConvMarker, now we insert mobile between them
content = content.replace(
  `\n${codingConvMarker2}`,
  `\n${mobileConfig}`
);

applied.push('FIX 6: Mobile config generation');

fs.writeFileSync('src/lib/skill-generator.ts', content);
console.log('Applied patches:', applied.join(', '));
