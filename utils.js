'use strict';

const fs = require('fs');
const util = require('util');
const nodeInstallPackage = require('npm-install-package');
const install = util.promisify(nodeInstallPackage);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const exists = util.promisify(fs.exists);
const path = require('path');

async function fileExists(name) {
    const destinationPath = path.join(process.cwd(), name);
    return !!await exists(destinationPath);
}

async function createFromTemplate(name) {
    const sourcePath = path.join(__dirname, 'templates', name);
    const destinationPath = path.join(process.cwd(), name);
    const contents = await readFile(sourcePath, 'utf8');
    return writeFile(destinationPath, contents);
}

async function createIfNotExists(name) {
    if (!await fileExists(name)) {
        return createFromTemplate(name);
    }
}

async function mergeJSONFile(name) {
    const sourcePath = path.join(__dirname, 'templates', name);
    const destinationPath = path.join(process.cwd(), name);
    const sourceContents = await readFile(sourcePath, 'utf8');
    let destinationContents = '{}';
    if (await fileExists(name)) {
        destinationContents = await readFile(destinationPath, 'utf8');
    }
    const mergedContents = Object.assign(
        {},
        JSON.parse(destinationContents || '{}'),
        JSON.parse(sourceContents)
    );
    return writeFile(destinationPath, JSON.stringify(mergedContents, null, 2));
}

const installPackages = install;

module.exports = {
    fileExists,
    createFromTemplate,
    createIfNotExists,
    mergeJSONFile,
    installPackages,
};
