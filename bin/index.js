#!/usr/bin/env node

const { program } = require('commander');
const setup = require('../src/commands/setup');
const switchProfile = require('../src/commands/switch');
const status = require('../src/commands/status');

program
  .version('1.0.0')
  .description('Switch between personal and work GitHub identities');

program
  .command('setup')
  .description('Setup personal and work GitHub profiles')
  .action(setup);

program
  .command('switch <profile>')
  .description('Switch to a profile: personal or work')
  .action(switchProfile);

program
  .command('status')
  .description('Show the current active Git identity')
  .action(status);

program.parse(process.argv);