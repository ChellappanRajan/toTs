#! /usr/bin/env node

import chalk from 'chalk';
import {compile} from 'json-schema-to-typescript';
import fs from 'node:fs/promises';
import toJsonSchema from 'to-json-schema';

const [, , command] = process.argv;
let filePath;
let cmd;
if (command?.split('=')) {
  [cmd, filePath] = command?.split('=');
}

switch (cmd) {
  case '--file':
  case '-f': {
    if (filePath) {
      try {
        const json = await fs.readFile(filePath);
        const jsoToTs = await compile(
          {...toJsonSchema(JSON.parse(json)), additionalProperties: false},
          'test',
          {bannerComment: ''},
        );
        const toFile = filePath.split('.').shift() || 'test';
        fs.writeFile(`${toFile}.ts`, jsoToTs);
        console.log(
          `[${toFile}.ts] ${chalk.green(
            'Interface file created succefully')} 🚀`,
        );
      } catch (error) {
        console.log(chalk.red(`${error?.message}`));
      }
    }
    break;
  }
  case '--version':
  case '-v': {
    const json = await fs.readFile('./package.json');
    console.log(chalk.gray(`${JSON.parse(json)?.version}`));
    break;
  }
  default: {
    console.log(chalk.gray(`toTs --file=<filename.json>`));
  }
}
