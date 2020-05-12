/**
 * 当前脚本会在 pre-push 的时候执行,
 * 执行前判断 commit log 是否 release(release_type): xxx 的格式
 * 如果是 commit type 是 release 则修改 package.json 并且打个 tag
 */

const fs = require('fs');
const path = require('path');
const semver = require('semver');
const { sync } = require('conventional-commits-parser');
const defaultChangelogOpts = require('conventional-changelog-angular');
const cp = require('child_process');

const CWD = process.cwd();
const RELEASE_TYPE = ['major', 'premajor', 'minor', 'preminor', 'patch', 'prepatch', 'prerelease'];

function updateVersion(pkgPath) {
  if (!fs.existsSync(pkgPath)) return;

  const releaseType = [...process.argv].pop();
  if (!RELEASE_TYPE.includes(releaseType)) return;

  const packageJSON = JSON.parse(fs.readFileSync(pkgPath).toString('utf8'));
  const currentVersion = packageJSON.version;

  const nextVersion = semver.inc(currentVersion, releaseType);
  fs.writeFileSync(pkgPath, JSON.stringify({ ...packageJSON, version: nextVersion }, null, 2));

  return nextVersion;
}

function updatePackageVersion() {
  fs.readdirSync('packages').forEach(name => {
    const dirname = path.join(CWD, 'packages', name);
    if (!fs.statSync(dirname).isDirectory) return;
    updateVersion(path.join(dirname, 'package.json'));
  });
}

function updateGlobalVersion() {
  const version = updateVersion(path.join(CWD, 'package.json'));
  try {
    cp.execSync('git tag v' + version);
  } catch (error) {
    //
  }
  return version;
}

function run() {
  const version = updateGlobalVersion();
  updatePackageVersion();

  cp.execSync('npm run clog');
  cp.execSync('git add package.json CHANGELOG.md');
  cp.execSync('git add packages/**/package.json');
  cp.execSync(`git commit -m "feat(release): release v${version}"`);
}

run();
