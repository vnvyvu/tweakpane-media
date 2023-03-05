import Alias from '@rollup/plugin-alias';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import Replace from '@rollup/plugin-replace';
import Typescript from '@rollup/plugin-typescript';
import Autoprefixer from 'autoprefixer';
import Postcss from 'postcss';
import {obfuscator} from 'rollup-obfuscator';
import Cleanup from 'rollup-plugin-cleanup';
import {terser as Terser} from 'rollup-plugin-terser';
import Sass from 'sass';

import Package from './package.json' assert {type: 'json'};

async function compileCss() {
	const css = Sass.compile('src/sass/plugin.scss', {
		style: 'compressed',
	}).css;

	const result = await Postcss([Autoprefixer]).process(css, {
		from: undefined,
	});
	return result.css.replace(/'/g, "\\'").trim();
}

function getPlugins(css, shouldMinify) {
	const plugins = [
		// Use ES6 source files to avoid CommonJS transpiling
		Alias({
			entries: [
				{
					find: '@tweakpane/core',
					replacement: './node_modules/@tweakpane/core/dist/es6/index.js',
				},
			],
		}),
		Typescript({
			tsconfig: 'src/tsconfig.json',
		}),
		nodeResolve(),
		Replace({
			__css__: css,
			preventAssignment: false,
		}),
	];
	if (shouldMinify) {
		plugins.push(Terser());
	}
	return [
		...plugins,
		// https://github.com/microsoft/tslib/issues/47
		Cleanup({
			comments: 'none',
		}),
		obfuscator({
			ignoreImports: true,
			target: 'browser-no-eval',
			selfDefending: true,
			identifierNamesGenerator: 'mangled-shuffled',
			deadCodeInjection: false,
		}),
	];
}

function getDistName(packageName) {
	// `@tweakpane/plugin-foobar` -> `tweakpane-plugin-foobar`
	// `tweakpane-plugin-foobar`  -> `tweakpane-plugin-foobar`
	return packageName
		.split(/[@/-]/)
		.reduce((comps, comp) => (comp !== '' ? [...comps, comp] : comps), [])
		.join('-');
}

function getUmdName(packageName) {
	// `@tweakpane/plugin-foobar` -> `TweakpaneFoobarPlugin`
	// `tweakpane-plugin-foobar`  -> `TweakpaneFoobarPlugin`
	return (
		packageName
			.split(/[@/-]/)
			.map((comp) =>
				comp !== 'plugin' ? comp.charAt(0).toUpperCase() + comp.slice(1) : '',
			)
			.join('') + 'Plugin'
	);
}

export default async () => {
	// eslint-disable-next-line no-undef
	const production = process.env.BUILD === 'production';

	const distName = getDistName(Package.name);
	const css = await compileCss();
	return {
		input: 'src/index.ts',
		external: ['tweakpane'],
		output: {
			file: `dist/${distName}.min.js`,
			format: 'umd',
			globals: {
				tweakpane: 'Tweakpane',
			},
			name: getUmdName(Package.name),
		},
		plugins: getPlugins(css, production),

		// Suppress `Circular dependency` warning
		onwarn(warning, rollupWarn) {
			if (warning.code === 'CIRCULAR_DEPENDENCY') {
				return;
			}
			rollupWarn(warning);
		},
	};
};
