import {ClassName, Value, View, ViewProps} from '@tweakpane/core';

import {mergeElement} from '../utils';
import {PluginVideoInputData, PluginVideoInputParams} from './index';

interface Config {
	value: Value<PluginVideoInputData>;
	viewProps: ViewProps;
	params: PluginVideoInputParams;
}

// Create a class name generator from the view name
// ClassName('tmp') will generate a CSS class name like `tp-tmpv`
const className = ClassName('vy');

// Custom view class should implement `View` interface
export class PluginView implements View {
	public readonly element: HTMLElement;

	public inputVideo: HTMLInputElement;
	private labelVideo_: HTMLLabelElement;
	public video: HTMLVideoElement;

	private containerCheckBox_: HTMLDivElement;
	public checkbox: HTMLInputElement;
	private labelCheckBox_: HTMLLabelElement;

	public buttonClear: HTMLSpanElement;

	private value_: Value<PluginVideoInputData>;
	private params_: PluginVideoInputParams;

	constructor(doc: Document, config: Config) {
		// Params
		this.params_ = config.params;

		// Receive the bound value from the controller
		this.value_ = config.value;

		// Create a root element for the plugin
		this.element = this.createRootElement_(doc);

		// Bind view props to the element
		config.viewProps.bindClassModifiers(this.element);

		// Container checkbox
		this.containerCheckBox_ = this.createContainerCheckBox_(doc);
		this.element.appendChild(this.containerCheckBox_);

		// Label checkbox
		this.labelCheckBox_ = this.createLabelCheckBox_(doc);
		this.containerCheckBox_.appendChild(this.labelCheckBox_);

		// Checkbox
		this.checkbox = this.createInputCheckbox_(doc);
		this.labelCheckBox_.prepend(this.checkbox);

		// Label video
		this.labelVideo_ = this.createLabelVideo_(doc);
		this.element.appendChild(this.labelVideo_);

		// Input video
		this.inputVideo = this.createInputVideo_(doc);
		this.labelVideo_.appendChild(this.inputVideo);

		// Video
		this.video = this.createVideo_();
		this.labelVideo_.appendChild(this.video);

		//Button clear
		this.buttonClear = this.createButtonClear_(doc);
		this.element.appendChild(this.buttonClear);

		// Bind
		this.bindAll_();

		// Events
		this.setupEventListeners_();

		// Apply the initial value
		this.refresh_();

		// Dispose
		config.viewProps.handleDispose(() => {
			this.removeEventListeners_();
		});

		// Init styles
		if (this.checkbox.checked) {
			this.inputVideo.disabled = false;
			this.element.style.opacity = '1';
		} else {
			this.inputVideo.disabled = true;
			this.element.style.opacity = '0.5';
		}
	}

	private refresh_(): void {
		this.video.setAttribute('src', this.value_.rawValue.src);

		if (this.value_.rawValue.checked !== this.checkbox.checked)
			this.checkbox.click();
	}

	private createRootElement_(doc: Document): HTMLDivElement {
		const element = mergeElement(
			doc.createElement('div'),
			this.params_.containerProps,
		);

		element.className = `${className()} ${
			this.params_.containerProps?.className || ''
		}`;

		return element;
	}

	private createInputVideo_(doc: Document): HTMLInputElement {
		const input = mergeElement(
			doc.createElement('input'),
			this.params_.inputVideoProps,
		);

		input.id = 'video';
		input.type = 'file';
		input.className = `${className('input-video')} ${
			this.params_.inputVideoProps?.className || ''
		}`;

		return input;
	}

	private createLabelVideo_(doc: Document): HTMLLabelElement {
		const label = mergeElement(
			doc.createElement('label'),
			this.params_.labelVideoProps,
		);

		label.htmlFor = 'video';
		label.className = `${className('label-video')} ${
			this.params_.labelVideoProps?.className || ''
		}`;

		return label;
	}

	private createContainerCheckBox_(doc: Document): HTMLDivElement {
		const container = mergeElement(
			doc.createElement('div'),
			this.params_.containerCheckBoxProps,
		);

		container.className = `${className('container-checkbox')} ${
			this.params_.containerCheckBoxProps?.className || ''
		}`;

		return container;
	}

	private createLabelCheckBox_(doc: Document): HTMLLabelElement {
		const label = mergeElement(
			doc.createElement('label'),
			this.params_.labelCheckBoxProps,
			this.params_.config?.templateCheckBox === 'tweakpane'
				? {
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
				  }
				: {},
		);

		label.className = `${className('label-checkbox')} ${
			this.params_.config?.templateCheckBox === 'tweakpane'
				? className('label-checkbox-tweakpane')
				: ''
		} ${this.params_.labelCheckBoxProps?.className || ''}`;

		return label;
	}

	private createInputCheckbox_(doc: Document): HTMLInputElement {
		const checkbox = mergeElement(
			doc.createElement('input'),
			this.params_.checkBoxProps,
			this.params_.config?.templateCheckBox === 'tweakpane'
				? {
						style: {
							display: 'none',
						},
				  }
				: {},
		);

		checkbox.type = 'checkbox';
		checkbox.defaultChecked = this.value_.rawValue.checked;
		checkbox.className = `${className('input-checkbox')} ${
			this.params_.config?.templateCheckBox === 'tweakpane'
				? className('input-checkbox-tweakpane')
				: ''
		} ${this.params_.checkBoxProps?.className || ''}`;

		return checkbox;
	}

	private createButtonClear_(doc: Document) {
		const button = mergeElement(
			doc.createElement('span'),
			this.params_.buttonClearProps,
		);

		button.className = `${className('button-clear')} ${
			this.params_.buttonClearProps?.className || ''
		}`;

		return button;
	}

	private createVideo_() {
		const video = mergeElement(
			document.createElement('video'),
			this.params_.videoProps,
		);
		video.className = `${className('video')} ${
			this.params_.videoProps?.className || ''
		}`;
		return video;
	}

	private bindAll_() {
		this.valueChangedHandler_ = this.valueChangedHandler_.bind(this);
		this.dragenterHandler_ = this.dragenterHandler_.bind(this);
		this.dragleaveHandler_ = this.dragleaveHandler_.bind(this);
		this.mouseenterHandler_ = this.mouseenterHandler_.bind(this);
		this.mouseleaveHandler_ = this.mouseleaveHandler_.bind(this);
	}

	private setupEventListeners_() {
		this.value_.emitter.on('change', this.valueChangedHandler_);
		this.inputVideo.addEventListener('dragenter', this.dragenterHandler_);
		this.inputVideo.addEventListener('dragleave', this.dragleaveHandler_);
		this.inputVideo.addEventListener('mouseenter', this.mouseenterHandler_);
		this.inputVideo.addEventListener('mouseleave', this.mouseleaveHandler_);
	}

	private removeEventListeners_() {
		this.value_.emitter.off('change', this.valueChangedHandler_.bind(this));
		this.inputVideo.removeEventListener('dragenter', this.dragenterHandler_);
		this.inputVideo.removeEventListener('dragleave', this.dragleaveHandler_);
		this.inputVideo.removeEventListener('mouseenter', this.mouseenterHandler_);
		this.inputVideo.removeEventListener('mouseleave', this.mouseleaveHandler_);
	}

	private valueChangedHandler_() {
		this.refresh_();
	}

	private dragenterHandler_(event: DragEvent) {
		if (
			event.dataTransfer &&
			event.dataTransfer.items[0] &&
			event.dataTransfer.items[0].type.includes('video')
		) {
			//
		}
	}

	private dragleaveHandler_() {
		if (this.value_.rawValue) {
			//
		}
	}

	private mouseenterHandler_() {}

	private mouseleaveHandler_() {}
}
