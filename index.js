#!/usr/bin/env node
'use strict';

const ora = require('ora');
const {
    mergeJSONFile,
    createIfNotExists,
    installPackages,
} = require('./utils');

async function main() {
    const spinner = ora('Installing dependencies').start();
    try {
        await installPackages(
            [
                'eslint',
                'eslint-config-finn',
                'eslint-config-finn-prettier',
                'jest',
                'lint-staged',
                'prettier',
                'husky',
            ],
            { saveDev: true }
        );
        spinner.succeed();
    } catch (err) {
        spinner.fail('Unable to install dependencies');
    }

    spinner.start('Updating package.json');
    try {
        await mergeJSONFile('package.json');
        spinner.succeed();
    } catch (err) {
        spinner.fail('Unable to update package.json');
    }

    spinner.start('Creating/updating .eslintrc');
    try {
        await mergeJSONFile('.eslintrc');
        spinner.succeed();
    } catch (err) {
        spinner.fail('Unable to create/update .eslintrc');
    }

    spinner.start('Creating/updating .eslintignore');
    try {
        await createIfNotExists('.eslintignore');
        spinner.succeed();
    } catch (err) {
        spinner.fail('Unable to create/update .eslintignore');
    }

    spinner.start('Creating/updating .editorconfig');
    try {
        await createIfNotExists('.editorconfig');
        spinner.succeed();
    } catch (err) {
        spinner.fail('Unable to create/update .editorconfig');
    }

    spinner.start('Creating/updating .gitignore');
    try {
        await createIfNotExists('.gitignore');
        spinner.succeed();
    } catch (err) {
        spinner.fail('Unable to create/update .gitignore');
    }

    console.log('done');
}

main();
