import {
	BaseInputParams,
	BindingTarget,
	InputBindingPlugin,
	ParamsParsers,
	parseParams,
} from '@tweakpane/core';

import {PluginController} from './controller';

export class PluginImageInputData {
	src: string;
	checked: boolean;
}

export interface PluginImageInputParams extends BaseInputParams {
	containerProps?: Partial<HTMLDivElement>;

	imgProps?: Partial<HTMLImageElement>;
	inputImageProps?: Partial<HTMLInputElement>;
	labelImageProps?: Partial<HTMLLabelElement>;

	containerCheckBoxProps?: Partial<HTMLDivElement>;
	checkBoxProps?: Partial<HTMLInputElement>;
	labelCheckBoxProps?: Partial<HTMLLabelElement>;

	buttonClearProps?: Partial<HTMLSpanElement>;

	config?: {
		templateCheckBox?: 'tweakpane';
	};

	label: string;
	view: 'image';
}

// NOTE: You can see JSDoc comments of `InputBindingPlugin` for details about each property
//
// `InputBindingPlugin<In, Ex, P>` means...
// - The plugin receives the bound value as `Ex`,
// - converts `Ex` into `In` and holds it
// - P is the type of the parsed parameters
//
export const PluginImageInput: InputBindingPlugin<
	PluginImageInputData,
	PluginImageInputData | string,
	PluginImageInputParams
> = {
	id: 'image-input',

	type: 'input',

	css: '__css__',

	//Decides whether the plugin accepts provided value and parameters.
	accept(exValue: unknown, params: Partial<PluginImageInputParams>) {
		// Parse parameters object
		const result = parseParams<PluginImageInputParams>(params, {
			// `view` option may be useful to provide a custom control for primitive values
			label: ParamsParsers.required.string,
			view: ParamsParsers.required.constant('image'),

			containerProps: ParamsParsers.optional.object({}),

			imgProps: ParamsParsers.optional.object({}),
			inputImageProps: ParamsParsers.optional.object({}),
			labelImageProps: ParamsParsers.optional.object({}),

			checkBoxProps: ParamsParsers.optional.object({}),
			labelCheckBoxProps: ParamsParsers.optional.object({}),
			containerCheckBoxProps: ParamsParsers.optional.object({}),

			buttonClearProps: ParamsParsers.optional.object({}),

			config: ParamsParsers.optional.object({}),
		});

		if (!result) {
			return null;
		}

		if (typeof exValue === 'string')
			return {
				initialValue: {
					src: exValue,
					checked:
						typeof params.checkBoxProps?.defaultChecked === 'boolean'
							? params.checkBoxProps?.defaultChecked
							: true,
				},
				params: {...result, ...params},
			};

		if (typeof exValue !== 'object' || !exValue) return null;

		// Return a typed value and params to accept the user input
		return {
			initialValue: exValue as PluginImageInputData,
			params: {...result, ...params},
		};
	},

	binding: {
		reader(_args) {
			return (exValue: unknown) => {
				const checked =
					typeof _args.params.checkBoxProps?.defaultChecked === 'boolean'
						? _args.params.checkBoxProps?.defaultChecked
						: true;

				if (typeof exValue === 'string')
					return {
						src: exValue,
						checked,
					};

				if (typeof exValue === 'object' && exValue) {
					const exVal = exValue as PluginImageInputData;

					return {
						src: exVal?.src || '',
						checked:
							typeof exVal.checked === 'boolean' ? exVal.checked : checked,
					};
				}

				return {
					src: '',
					checked,
				};
			};
		},

		equals: (v1, v2) => v1.src === v2.src && v1.checked === v2.checked,

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
