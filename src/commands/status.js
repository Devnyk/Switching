const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const chalk = require('chalk');
const https = require('https');

const GIT_CREDENTIALS_PATH = path.join(os.homedir(), '.git-credentials');

function getGitHubUsername(token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: '/user',
      method: 'GET',
      headers: {
        'User-Agent': 'switchy-cli',
        Authorization: `token ${token}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.login) resolve(parsed.login);
          else reject(parsed.message || 'Unknown error');
        } catch (err) {
          reject('Invalid response');
        }
      });
    });

    req.on('error', (err) => reject(err.message));
    req.end();
  });
}

module.exports = async function status() {
  try {
    const name = execSync('git config --global user.name').toString().trim();
    const email = execSync('git config --global user.email').toString().trim();

    console.log(chalk.cyan('👤 Current Git Identity:'));
    console.log(`Name: ${chalk.bold(name)}`);
    console.log(`Email: ${chalk.bold(email)}`);
    console.log(chalk.gray('────────────────────────────────────────────'));

    if (fs.existsSync(GIT_CREDENTIALS_PATH)) {
      const content = fs.readFileSync(GIT_CREDENTIALS_PATH, 'utf-8');
      const tokenMatch = content.match(/https:\/\/(.*?)@github\.com/);

      if (tokenMatch && tokenMatch[1]) {
        const token = tokenMatch[1].split(':')[0];
        try {
          const githubUser = await getGitHubUsername(token);
          console.log(chalk.yellow('🧑 GitHub Account in use:'));
          console.log(`Username: ${chalk.bold(githubUser)}`);
        } catch (err) {
          console.log(chalk.red('⚠️  Could not validate token:'), err);
        }
      } else {
        console.log(chalk.red('⚠️  No valid token found in .git-credentials'));
      }
    } else {
      console.log(chalk.red('❌ No .git-credentials file found'));
    }
  } catch (err) {
    console.error(chalk.red('❌ Failed to read Git config or credentials.'));
  }
};
