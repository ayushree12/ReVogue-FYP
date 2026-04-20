const fs = require('fs');
const path = require('path');

const targets = [
  'node_modules',
  'client/node_modules',
  'server/node_modules',
  'client/dist',
  'server/coverage'
];

for (const target of targets) {
  const fullPath = path.join(__dirname, '..', target);
  if (!fs.existsSync(fullPath)) {
    console.log(`skip ${target}`);
    continue;
  }

  fs.rmSync(fullPath, { recursive: true, force: true });
  console.log(`removed ${target}`);
}
