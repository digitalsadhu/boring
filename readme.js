import React from 'react';
import {
    Readme,
    Title,
    Badges,
    License,
    Description,
    Markdown,
    Install,
} from './components';

export default () => (
    <Readme>
        <Title titleCase humanize />
        <Description />
        <Badges travisci daviddm daviddmdev npmversion />
        <Install yarn npm />
        <Markdown file="./docs/USAGE.md" />
        <Markdown file="./docs/CONTRIBUTING.md" />
        <License />
    </Readme>
);
