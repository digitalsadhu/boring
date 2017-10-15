'use strict';

const fs = require('fs');
const util = require('util');
const npmInstallPackage = require('npm-install-package');
const install = util.promisify(npmInstallPackage);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const exists = util.promisify(fs.exists);
const path = require('path');
const assign = require('deep-assign');
const { dump: stringifyYaml, load: parseYaml } = require('js-yaml');

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

async function createOrReplaceFile(name) {
    return createFromTemplate(name);
}

async function mergeJSONFile(name) {
    const sourcePath = path.join(__dirname, 'templates', name);
    const destinationPath = path.join(process.cwd(), name);
    const sourceContents = await readFile(sourcePath, 'utf8');
    let destinationContents = '{}';
    if (await fileExists(name)) {
        destinationContents = await readFile(destinationPath, 'utf8');
    }
    const mergedContents = assign(
        {},
        JSON.parse(destinationContents || '{}'),
        JSON.parse(sourceContents)
    );
    return writeFile(destinationPath, JSON.stringify(mergedContents, null, 2));
}

async function mergeTextFile(name) {
    const sourcePath = path.join(__dirname, 'templates', name);
    const destinationPath = path.join(process.cwd(), name);
    const sourceContents = await readFile(sourcePath, 'utf8');
    let destinationContents = '';
    if (await fileExists(name)) {
        destinationContents = await readFile(destinationPath, 'utf8');
    }
    const resultingLines = new Map();
    const sourceLines = sourceContents.split('\n');
    const destinationLines = destinationContents.split('\n');
    for (const line of destinationLines) {
        resultingLines.set(line.trim(), line);
    }
    for (const line of sourceLines) {
        resultingLines.set(line.trim(), line);
    }
    const resultingFileContents = Array.from(resultingLines.values())
        .filter(Boolean)
        .join('\n');

    await writeFile(destinationPath, resultingFileContents);
}

async function mergeYAMLFile(name) {
    const sourcePath = path.join(__dirname, 'templates', name);
    const destinationPath = path.join(process.cwd(), name);
    const sourceContents = await readFile(sourcePath, 'utf8');
    let destinationContents = '';
    if (await fileExists(name)) {
        destinationContents = await readFile(destinationPath, 'utf8');
    }
    const mergedContents = assign(
        {},
        parseYaml(destinationContents),
        parseYaml(sourceContents)
    );
    const yaml = stringifyYaml(mergedContents);
    await writeFile(destinationPath, yaml);
}

async function mergeReadmeFile() {
    const sourcePath = path.join(__dirname, 'templates/README.md');
    const destinationPath = path.join(process.cwd(), 'README.md');
    const sourceContents = await readFile(sourcePath, 'utf8');
    let destinationContents = '';
    if (await fileExists('README.md')) {
        destinationContents = await readFile(destinationPath, 'utf8');
    }
    const titleRegex = /.+\n=+\n|#.+\n/g;
    const content = destinationContents
        .replace(titleRegex, '')
        .replace(/<!-- TITLE -->/g, '')
        .replace(/<!-- BADGES -->/g, '')
        .trim();
    await writeFile(
        destinationPath,
        sourceContents.replace('{{content}}', content)
    );
}

const installPackages = install;

module.exports = {
    fileExists,
    createFromTemplate,
    createIfNotExists,
    mergeJSONFile,
    mergeTextFile,
    mergeYAMLFile,
    mergeReadmeFile,
    installPackages,
    createOrReplaceFile,
};
