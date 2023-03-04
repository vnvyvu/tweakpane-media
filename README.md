# tweakpane-media

Add image, video to tweakpane

## Infomations

- ✨Highly customizable
- ✨Easy to use
- ✨Clean
- ✨Better support for ThreeJS

## Usage

```typescript
import {
	PluginVideoInputParams,
	PluginVideoInput,
	PluginImageInputParams,
	PluginImageInput,
} from 'tweakpane-media';

const pane = new Pane();
pane.registerPlugin({plugins: [PluginVideoInput, PluginImageInput]});

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

## Limitation

I don't know

## Other

[Buy me a ☕](https://paypal.me/99vyvu 'paypal')
