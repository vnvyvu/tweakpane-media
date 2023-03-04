'use strict';

import {renameSync, statSync} from 'fs';
import {sync} from 'glob';
import {basename, dirname, join} from 'path';

import {version} from '../package';

const PATTERN = 'dist/*';

const paths = sync(PATTERN);
paths.forEach((path) => {
	const fileName = basename(path);
	if (statSync(path).isDirectory()) {
		return;
	}

	const ext = fileName.match(/(\..+)$/)[1];
	const base = basename(fileName, ext);
	const versionedPath = join(dirname(path), `${base}-${version}${ext}`);
	renameSync(path, versionedPath);
});
