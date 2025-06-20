const { execSync } = require('child_process');
const chalk = require('chalk');

module.exports = function status() {
  try {
    const name = execSync('git config --global user.name').toString().trim();
    const email = execSync('git config --global user.email').toString().trim();

    console.log(chalk.cyan('👤 Current Git Identity:'));
    console.log(`Name: ${chalk.bold(name)}`);
    console.log(`Email: ${chalk.bold(email)}`);
  } catch (err) {
    console.error(chalk.red('❌ Failed to read Git config.'));
  }
};