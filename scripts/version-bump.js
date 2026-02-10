#!/usr/bin/env node

/**
 * Version bump script for Custom Form Renderer
 * Usage: node scripts/version-bump.js [patch|minor|major]
 */

const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const currentVersion = packageJson.version;
const versionParts = currentVersion.split('.').map(Number);
const [major, minor, patch] = versionParts;

const bumpType = process.argv[2] || 'patch';

let newVersion;
switch (bumpType) {
  case 'major':
    newVersion = `${major + 1}.0.0`;
    break;
  case 'minor':
    newVersion = `${major}.${minor + 1}.0`;
    break;
  case 'patch':
  default:
    newVersion = `${major}.${minor}.${patch + 1}`;
    break;
}

packageJson.version = newVersion;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

console.log(`✅ Version bumped from ${currentVersion} to ${newVersion}`);
