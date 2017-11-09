<!-- TITLE/ -->

<h1>boring</h1>

<!-- /TITLE -->


Takes all the fun out of repository setup.

## Install

Note yet published to npm so in order to use locally you can:

1. clone this repo, then cd into the directory.

2. Install deps
```bash
npm install
```

3. Globally link the project
```bash
npm link
```

## Usage

1. Move to a directory that needs an upgrade

2. Be sure all prior work is committed

3. Run the tool
```bash
boring
```

4. Final bit of cleanup to generate readme and license file changes
```bash
npm run readme
```

5. Review changes and omit or fix anything.

6. Commit changes (follow the prompts)
```bash
npm run cm
```
