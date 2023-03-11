import {Controller, Value, ViewProps} from '@tweakpane/core';

import {PluginImageInputData, PluginImageInputParams} from './index';
import {PluginView} from './view';

interface Config {
	value: Value<PluginImageInputData>;
	viewProps: ViewProps;
	params: PluginImageInputParams;
}

// Custom controller class should implement `Controller` interface
export class PluginController implements Controller<PluginView> {
	public readonly value: Value<PluginImageInputData>;
	public readonly initialValue: {
		isNotSet: boolean;
		value: PluginImageInputData;
	} = {
		isNotSet: true,
		value: {checked: true, src: ''},
	};
	public latestValue: PluginImageInputData;

	public readonly view: PluginView;
	public readonly viewProps: ViewProps;
	public readonly params: PluginImageInputParams;

	constructor(doc: Document, config: Config) {
		// Receive the bound value from the plugin
		this.value = config.value;

		this.latestValue = this.value.rawValue;

		this.params = config.params;

		// and also view props
		this.viewProps = config.viewProps;
		this.viewProps.handleDispose(() => {
			this.removeEventListeners_();
		});

		// Create a custom view
		this.view = new PluginView(doc, {
			value: this.value,
			viewProps: this.viewProps,
			params: this.params,
		});

		// Bind
		this.bindAll_();

		// Events
		this.setupEventListeners_();

		if (this.initialValue.isNotSet) {
			this.initialValue = {
				isNotSet: false,
				value: {src: this.view.image.src, checked: true},
			};
		}
	}

	private bindAll_(): void {
		this.inputImageHandler_ = this.inputImageHandler_.bind(this);
		this.checkboxHandler_ = this.checkboxHandler_.bind(this);
		this.buttonClearHandler_ = this.buttonClearHandler_.bind(this);
	}

	private setupEventListeners_(): void {
		this.view.inputImage.addEventListener('input', this.inputImageHandler_);
		this.view.checkbox.addEventListener('input', this.checkboxHandler_);
		this.view.buttonClear.addEventListener('click', this.buttonClearHandler_);
	}

	private removeEventListeners_(): void {
		this.view.inputImage.removeEventListener('input', this.inputImageHandler_);
		this.view.checkbox.removeEventListener('input', this.checkboxHandler_);
		this.view.buttonClear.removeEventListener(
			'click',
			this.buttonClearHandler_,
		);
	}

	private inputImageHandler_() {
		const file = this.view.inputImage.files?.[0];
		if (file) {
			this.value.rawValue = {
				...this.value.rawValue,
				src: URL.createObjectURL(file),
			};
			this.latestValue = this.value.rawValue;
		}
	}

	private checkboxHandler_(e: Event) {
		if (this.view.checkbox.checked) {
			this.value.rawValue = {
				...this.latestValue,
				checked: this.view.checkbox.checked,
			};

			this.view.inputImage.disabled = false;
			this.view.element.style.opacity = '1';
		} else {
			this.value.rawValue = {
				...this.initialValue.value,
				checked: this.view.checkbox.checked,
			};

			this.view.inputImage.disabled = true;
			this.view.element.style.opacity = '0.5';
		}

		this.view.checkbox.onchange?.(e);
	}

	private buttonClearHandler_(e: MouseEvent) {
		this.value.rawValue = {checked: true, src: ''};

		this.view.checkbox.checked = true;

		this.view.buttonClear.onclick?.(e);
	}
}
