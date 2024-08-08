#!/usr/bin/env node

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const path = require('path')
const { generateAssetViewer } = require('./index')

yargs(hideBin(process.argv))
  .command('view', 'View assets in the current directory', (yargs) => {
    return yargs.option('dir', {
      alias: 'd',
      type: 'string',
      description: 'Directory containing assets',
      default: process.cwd()
    })
  }, (argv) => {
    generateAssetViewer(argv.dir)
  })
  .demandCommand(1, 'You need at least one command before moving on')
  .help()
  .argv