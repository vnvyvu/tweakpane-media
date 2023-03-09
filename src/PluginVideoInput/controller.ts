import {Controller, Value, ViewProps} from '@tweakpane/core';

import {PluginVideoInputParams} from '.';
import {PluginView} from './view';

interface Config {
	value: Value<string>;
	viewProps: ViewProps;
	params: PluginVideoInputParams;
}

// Custom controller class should implement `Controller` interface
export class PluginController implements Controller<PluginView> {
	public readonly value: Value<string>;
	public readonly initialValue: {isNotSet: boolean; value: string} = {
		isNotSet: true,
		value: '',
	};
	public latestValue: string;

	public readonly view: PluginView;
	public readonly viewProps: ViewProps;
	public readonly params: PluginVideoInputParams;

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
			this.initialValue = {isNotSet: false, value: this.view.video.src};
		}
	}

	private bindAll_(): void {
		this.inputVideoHandler_ = this.inputVideoHandler_.bind(this);
		this.checkboxHandler_ = this.checkboxHandler_.bind(this);
		this.buttonClearHandler_ = this.buttonClearHandler_.bind(this);
	}

	private setupEventListeners_(): void {
		this.view.inputVideo.addEventListener('input', this.inputVideoHandler_);
		this.view.checkbox.addEventListener('input', this.checkboxHandler_);
		this.view.buttonClear.addEventListener('click', this.buttonClearHandler_);
	}

	private removeEventListeners_(): void {
		this.view.inputVideo.removeEventListener('input', this.inputVideoHandler_);
		this.view.checkbox.removeEventListener('input', this.checkboxHandler_);
		this.view.buttonClear.removeEventListener(
			'click',
			this.buttonClearHandler_,
		);
	}

	private inputVideoHandler_() {
		const file = this.view.inputVideo.files?.[0];
		if (file) {
			this.value.rawValue = URL.createObjectURL(file);
			this.latestValue = this.value.rawValue.toString();
		}
	}

	private checkboxHandler_(e: Event) {
		if (this.view.checkbox.checked) {
			this.value.rawValue = this.latestValue;

			this.view.inputVideo.disabled = false;
			this.view.element.style.opacity = '1';
		} else {
			this.value.rawValue = this.initialValue.value;

			this.view.inputVideo.disabled = true;
			this.view.element.style.opacity = '0.5';
		}

		this.view.checkbox.onchange?.(e);
	}

	private buttonClearHandler_(e: MouseEvent) {
		this.value.rawValue = '';

		this.view.checkbox.checked = true;

		this.view.buttonClear.onclick?.(e);
	}
}
