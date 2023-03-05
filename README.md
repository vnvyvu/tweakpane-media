# tweakpane-media

Add image, video for Tweakpane

## Features

- ✨Highly customizable
- ✨Easy to use
- ✨Small size
- ✨Better support for ThreeJS

## Usage

- Overview

```typescript
import {
	PluginVideoInputParams,
	PluginVideoInput,
	PluginImageInputParams,
	PluginImageInput,
} from 'tweakpane-media';

const pane = new Pane();
pane.registerPlugin({plugins: [PluginVideoInput, PluginImageInput]});

//OR
<script src="../path/to/tweakpane.js"></script>
<script src="../path/to/tweakpane-media.min.js"></script>
<script>
	const pane = new Tweakpane.Pane();
	pane.registerPlugin({
		plugins: [
			TweakpaneMediaPlugin.PluginImageInput,
			TweakpaneMediaPlugin.PluginVideoInput,
		],
	});
</script>

pane
	.addInput(PARAMS, 'image', {
		label: 'Image',
		view: 'image',

		containerProps: {},

		imgProps: {
			style: {
				width: '100px',
			},
		},
		inputImageProps: {},
		labelImageProps: {},

		containerCheckBoxProps: {},
		checkBoxProps: {},
		labelCheckBoxProps: {},

		buttonClearProps: {
			children: 'Clear',
		}
	} as PluginImageInputParams)
	.on('change', (ev) => {
		console.log(ev.value);
	});

pane
	.addInput(PARAMS, 'video', {
		label: 'Video',
		view: 'video',

		containerProps: {},

		videoProps: {
			loop: true,
			autoplay: true,
			muted: true,
			playsinline: true,
			width: 100,
			height: 90,
			style: {
				objectFit: 'cover',
			},
		}
		inputVideoProps: {},
		labelVideoProps: {},

		containerCheckBoxProps: {},
		checkBoxProps: {},
		labelCheckBoxProps: {},

		buttonClearProps: {
			children: 'Clear',
		}
	} as PluginVideoInputParams)
	.on('change', (ev) => {
		console.log(ev.value);
	});

```

- Custom checkbox similar Tweakpane core checkbox

```html
<script>
	pane
		.addInput(PARAMS, 'video', {
			label: 'Video',
			view: 'video',
			containerProps: {},
			videoProps: {
				loop: true,
				autoplay: true,
				muted: true,
				playsinline: true,
				width: 100,
				height: 90,
				style: {objectFit: 'cover'},
			},
			inputVideoProps: {},
			labelVideoProps: {},
			containerCheckBoxProps: {},
			checkBoxProps: {},
			labelCheckBoxProps: {},
			buttonClearProps: {children: 'Clear'},
			config: {templateCheckBox: 'tweakpane'},
		})
		.on('change', (ev) => {
			console.log(ev.value);
		});
</script>
```

- Custom checkbox similar Tweakpane core checkbox without config template

```html
<style>
	#cb-video:checked + label > svg {
		opacity: 1;
	}
	#cb-video:not(checked) + label > svg {
		opacity: 0;
	}
</style>

<script>
	//...
	pane
		.addInput(PARAMS, 'video', {
			label: 'Video',
			view: 'video',

			containerProps: {},

			videoProps: {
				loop: true,
				autoplay: true,
				muted: true,
				playsinline: true,
				width: 100,
				height: 90,
				style: {
					objectFit: 'cover',
				},
			},
			inputVideoProps: {},
			labelVideoProps: {},

			containerCheckBoxProps: {},
			checkBoxProps: {
				id: 'cb-video',
				style: {
					display: 'none',
				},
			},
			labelCheckBoxProps: {
				innerHTML:
					'<svg id="label-icon" style="bottom: 0;display: block;height: 16px;left: 0;margin: auto;position: absolute;right: 0;top: 0;width: 16px;"><path style="fill: none;stroke: var(--in-fg);stroke-width: 2;" d="M2 8l4 4l8 -8"></path></svg>',
				style: {
					backgroundColor: 'var(--in-bg)',
					borderRadius: 'var(--elm-br)',
					cursor: 'pointer',
					display: 'block',
					height: 'var(--bld-us)',
					position: 'relative',
					width: 'var(--bld-us)',
				},
			},

			buttonClearProps: {
				children: 'Clear',
			},
		})
		.on('change', (ev) => {
			console.log(ev.value);
		});
</script>
```

## Limitation

I don't know

## Other

[Buy me a ☕](https://paypal.me/99vyvu 'paypal')
