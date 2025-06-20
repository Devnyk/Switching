const fs = require('fs');
const os = require('os');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');

const CONFIG_PATH = path.join(os.homedir(), '.switchy.json');
const GIT_CREDENTIALS_PATH = path.join(os.homedir(), '.git-credentials');

module.exports = function switchProfile(profileName) {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.log(chalk.red('❌ No profile found. Please run "switchy setup" first.'));
    return;
  }

  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  const profile = config[profileName];

  if (!profile) {
    console.log(chalk.red(`❌ Profile "${profileName}" not found.`));
    return;
  }

  try {
    console.log(chalk.yellow(`🔁 Switching to ${profileName} profile...`));

    execSync(`git config --global user.name "${profile.name}"`);
    execSync(`git config --global user.email "${profile.email}"`);

    const credentials = `https://${profile.token}:x-oauth-basic@github.com\n`;
    fs.writeFileSync(GIT_CREDENTIALS_PATH, credentials);

    execSync(`git config --global credential.helper store`);

    console.log(chalk.green(`✅ Now using ${profile.name} <${profile.email}>`));
    console.log(chalk.gray('────────────────────────────────────────────'));
    console.log(chalk.yellowBright('🚀 Ready to push code!'));
    console.log(chalk.white('Use: git init → git remote add origin ... → git push'));
    console.log(chalk.gray('────────────────────────────────────────────'));

  } catch (err) {
    console.error(chalk.red('⚠️  Failed to switch account:'), err.message);
  }
};