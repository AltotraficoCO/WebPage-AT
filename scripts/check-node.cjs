const [major, minor, patch] = process.versions.node.split('.').map(Number);
if (major !== 24 || minor < 22 || (minor === 22 && patch < 1)) {
  throw new Error('Use patched Node.js >=24.22.1 <25 for this project. Current: ' + process.version);
}
console.log('Verified patched build runtime: Node.js ' + process.version);
