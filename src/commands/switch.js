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

    // Set global Git identity
    execSync(`git config --global user.name "${profile.name}"`);
    execSync(`git config --global user.email "${profile.email}"`);

    // 🧹 Remove old credentials if exist
    if (fs.existsSync(GIT_CREDENTIALS_PATH)) {
      fs.unlinkSync(GIT_CREDENTIALS_PATH);
    }

    // 💾 Write new GitHub token to .git-credentials
    const credentials = `https://${profile.token}:x-oauth-basic@github.com\n`;
    fs.writeFileSync(GIT_CREDENTIALS_PATH, credentials);

    // 📌 Set git to use credential helper
    execSync(`git config --global credential.helper store`);

    console.log(chalk.green(`✅ Now using ${profile.name} <${profile.email}>`));
    console.log(chalk.gray('────────────────────────────────────────────'));
    console.log(chalk.yellowBright('🚀 Ready to push code with correct GitHub account!'));
    console.log(chalk.white('Use: git init → git remote add origin ... → git push'));
    console.log(chalk.gray('────────────────────────────────────────────'));

  } catch (err) {
    console.error(chalk.red('⚠️  Failed to switch account:'), err.message);
  }
};
