#!/usr/bin/env node
'use strict';

const ora = require('ora');
const {
    mergeJSONFile,
    createIfNotExists,
    installPackages,
} = require('./utils');

async function main() {
    const spinner = ora();

    spinner.start('Installing dependencies');
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
                'commitizen',
                'cz-conventional-changelog',
            ],
            { saveDev: true }
        );
        spinner.succeed();
    } catch (err) {
        spinner.fail('Unable to install dependencies');
    }

    // TODO: Improve to use deep merge instead of shallow
    spinner.start('Updating package.json');
    try {
        await mergeJSONFile('package.json');
        spinner.succeed();
    } catch (err) {
        spinner.fail('Unable to update package.json');
    }

    // TODO: Improve to use deep merge instead of shallow
    spinner.start('Creating/updating .eslintrc');
    try {
        await mergeJSONFile('.eslintrc');
        spinner.succeed();
    } catch (err) {
        spinner.fail('Unable to create/update .eslintrc');
    }

    // TODO: Text merge instead of create if not exists
    spinner.start('Creating/updating .eslintignore');
    try {
        await createIfNotExists('.eslintignore');
        spinner.succeed();
    } catch (err) {
        spinner.fail('Unable to create/update .eslintignore');
    }

    // TODO: Text merge instead of create if not exists
    spinner.start('Creating/updating .editorconfig');
    try {
        await createIfNotExists('.editorconfig');
        spinner.succeed();
    } catch (err) {
        spinner.fail('Unable to create/update .editorconfig');
    }

    // TODO: Text merge instead of create if not exists
    spinner.start('Creating/updating .gitignore');
    try {
        await createIfNotExists('.gitignore');
        spinner.succeed();
    } catch (err) {
        spinner.fail('Unable to create/update .gitignore');
    }

    // TODO: Merge yml instead of create if not exists
    spinner.start('Creating/updating .travis.yml');
    try {
        await createIfNotExists('.travis.yml');
        spinner.succeed();
    } catch (err) {
        spinner.fail('Unable to create/update .travis.yml');
    }

    console.log('done');
}

main();
