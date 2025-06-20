const inquirer = require('inquirer');
const fs = require('fs');
const os = require('os');
const path = require('path');
const chalk = require('chalk');

const CONFIG_PATH = path.join(os.homedir(), '.switchy.json');

module.exports = async function setup() {
  const answers = await inquirer.prompt([
    { name: 'personalName', message: 'Your Personal Git Name:' },
    { name: 'personalEmail', message: 'Your Personal Git Email:' },
    { name: 'personalToken', message: 'Your Personal GitHub Token:' },
    { name: 'workName', message: 'Your Work Git Name:' },
    { name: 'workEmail', message: 'Your Work Git Email:' },
    { name: 'workToken', message: 'Your Work GitHub Token:' },
  ]);

  const config = {
    personal: {
      name: answers.personalName,
      email: answers.personalEmail,
      token: answers.personalToken,
    },
    work: {
      name: answers.workName,
      email: answers.workEmail,
      token: answers.workToken,
    },
  };

  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
  console.log(chalk.green('✅ Profiles saved successfully!'));
  console.log(chalk.gray('\n────────────────────────────────────────────'));
  console.log(chalk.yellowBright('⚠️  Note:'));
  console.log(chalk.white('  Terminal Git commands like `git push` will now use correct identity.'));
  console.log(chalk.gray('────────────────────────────────────────────'));
};