#!/usr/bin/env node
'use strict';

const ora = require('ora');
const {
    mergeJSONFile,
    installPackages,
    mergeTextFile,
    createOrReplaceFile,
    mergeYAMLFile,
    mergeReadmeFile,
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
                'projectz',
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
        await mergeTextFile('.eslintignore');
        spinner.succeed();
    } catch (err) {
        spinner.fail('Unable to create/update .eslintignore');
        console.error(err);
    }

    spinner.start('Creating/updating .editorconfig');
    try {
        await createOrReplaceFile('.editorconfig');
        spinner.succeed();
    } catch (err) {
        spinner.fail('Unable to create/update .editorconfig');
        console.error(err);
    }

    spinner.start('Creating/updating .gitignore');
    try {
        await mergeTextFile('.gitignore');
        spinner.succeed();
    } catch (err) {
        spinner.fail('Unable to create/update .gitignore');
        console.error(err);
    }

    spinner.start('Creating/updating .travis.yml');
    try {
        await mergeYAMLFile('.travis.yml');
        spinner.succeed();
    } catch (err) {
        spinner.fail('Unable to create/update .travis.yml');
        console.error(err);
    }

    spinner.start('Creating/updating README.md');
    try {
        await mergeReadmeFile();
        spinner.succeed();
    } catch (err) {
        spinner.fail('Unable to create/update README.md');
        console.error(err);
    }

    console.log('done');
}

main();
