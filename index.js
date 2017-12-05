#!/usr/bin/env node
'use strict';

const ora = require('ora');
const {
    mergeJSONFile,
    installPackages,
    uninstallPackages,
    mergeTextFile,
    createOrReplaceFile,
    mergeYAMLFile,
    makeDir,
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
                'react',
                'auto-readme',
                'eslint-plugin-import',
                '@commitlint/{config-conventional,cli}',
            ],
            { saveDev: true }
        );
        spinner.succeed();
    } catch (err) {
        spinner.fail('Unable to install dependencies');
        console.error(err);
    }

    spinner.start('Uninstalling dependencies');
    try {
        await uninstallPackages(['projectz']);
        spinner.succeed();
    } catch (err) {
        spinner.fail('Unable to uninstall dependencies');
        console.error(err);
    }

    spinner.start('Updating package.json');
    try {
        await mergeJSONFile('package.json');
        spinner.succeed();
    } catch (err) {
        spinner.fail('Unable to update package.json');
        console.error(err);
    }

    spinner.start('Creating/updating .eslintrc');
    try {
        await mergeJSONFile('.eslintrc');
        spinner.succeed();
    } catch (err) {
        spinner.fail('Unable to create/update .eslintrc');
        console.error(err);
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

    spinner.start('Creating README template builder');
    try {
        await makeDir('docs');
        await createOrReplaceFile('/docs/USAGE.md');
        await createOrReplaceFile('/docs/CONTRIBUTING.md');
        await createOrReplaceFile('readme.js');
        spinner.succeed();
    } catch (err) {
        spinner.fail('Unable to setup README builder');
        console.error(err);
    }

    spinner.start('Creating/updating PULL_REQUEST_TEMPLATE');
    try {
        await createOrReplaceFile('PULL_REQUEST_TEMPLATE');
        spinner.succeed();
    } catch (err) {
        spinner.fail('Unable to create/update PULL_REQUEST_TEMPLATE');
        console.error(err);
    }

    spinner.start('Creating/updating .vscode/settings.json');
    try {
        await makeDir('.vscode');
        await mergeJSONFile('.vscode/settings.json');
        spinner.succeed();
    } catch (err) {
        spinner.fail('Unable to create/update .vscode/settings.json');
        console.error(err);
    }

    console.log('✨ 🦄 ✨  Done');
}

main();
