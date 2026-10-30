// The job's tree is its commit's: no file git does not track outside what the job makes, and
// node_modules holds exactly the lockfile's packages. graphide-ci's warm setup templates restore a
// machine whose setup already ran on another commit; this fails if anything of it leaks through.
const { test, expect } = require('@playwright/test');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const made = new Set(['node_modules', 'test-results', 'playwright-report']);

test('the tree is the commit', () => {
  const tracked = new Set(execSync('git ls-files', { encoding: 'utf8' }).split('\n').filter(Boolean));
  const extra = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (made.has(e.name)) continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (!tracked.has(p)) extra.push(p);
    }
  };
  walk('.');
  expect(extra).toEqual([]);
  for (const f of tracked) expect(fs.existsSync(f), f).toBe(true);
});

test('node_modules is the lockfile', () => {
  const versions = (file) => Object.fromEntries(
    Object.entries(JSON.parse(fs.readFileSync(file, 'utf8')).packages)
      .filter(([k]) => k !== '')
      .map(([k, p]) => [k, p.version]));
  expect(versions('node_modules/.package-lock.json')).toEqual(versions('package-lock.json'));
});
