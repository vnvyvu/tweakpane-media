import {
	BaseInputParams,
	BindingTarget,
	InputBindingPlugin,
	ParamsParsers,
	parseParams,
} from '@tweakpane/core';

import {PluginController} from './controller';

export interface PluginVideoInputParams extends BaseInputParams {
	containerProps?: Partial<HTMLDivElement>;

	videoProps?: Partial<HTMLVideoElement>;
	inputVideoProps?: Partial<HTMLInputElement>;
	labelVideoProps?: Partial<HTMLLabelElement>;

	containerCheckBoxProps?: Partial<HTMLDivElement>;
	checkBoxProps?: Partial<HTMLInputElement>;
	labelCheckBoxProps?: Partial<HTMLLabelElement>;

	buttonClearProps?: Partial<HTMLSpanElement>;

	config?: {
		templateCheckBox?: 'tweakpane';
	};

	label: string;
	view: 'video';
}

// NOTE: You can see JSDoc comments of `InputBindingPlugin` for details about each property
//
// `InputBindingPlugin<In, Ex, P>` means...
// - The plugin receives the bound value as `Ex`,
// - converts `Ex` into `In` and holds it
// - P is the type of the parsed parameters
//
export const PluginVideoInput: InputBindingPlugin<
	string,
	string,
	PluginVideoInputParams
> = {
	id: 'video-input',

	type: 'input',

	css: '__css__',

	//Decides whether the plugin accepts provided value and parameters.
	accept(exValue: unknown, params: Record<string, unknown>) {
		// Return null if underfined
		if (typeof exValue !== 'string') return null;

		// Parse parameters object
		const result = parseParams<PluginVideoInputParams>(params, {
			// `view` option may be useful to provide a custom control for primitive values
			label: ParamsParsers.required.string,
			view: ParamsParsers.required.constant('video'),

			containerProps: ParamsParsers.optional.object({}),

			videoProps: ParamsParsers.optional.object({}),
			inputVideoProps: ParamsParsers.optional.object({}),
			labelVideoProps: ParamsParsers.optional.object({}),

			checkBoxProps: ParamsParsers.optional.object({}),
			labelCheckBoxProps: ParamsParsers.optional.object({}),
			containerCheckBoxProps: ParamsParsers.optional.object({}),

			buttonClearProps: ParamsParsers.optional.object({}),

			config: ParamsParsers.optional.object({}),
		});

		if (!result) {
			return null;
		}

		// Return a typed value and params to accept the user input
		return {
			initialValue: exValue,
			params: {...result, ...params},
		};
	},

	binding: {
		reader(_args) {
			return (exValue: unknown): string => {
				return typeof exValue === 'string' ? exValue : '';
			};
		},

		writer(_args) {
			return (target: BindingTarget, inValue) => {
				// Use `target.write()` to write the primitive value to the target,
				// or `target.writeProperty()` to write a property of the target
				target.write(inValue);
			};
		},
	},

	controller(args) {
		// Create a controller for the plugin
		return new PluginController(args.document, {
			value: args.value,
			viewProps: args.viewProps,
			params: args.params,
		});
	},
};
