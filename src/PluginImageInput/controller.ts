import {Controller, Value, ViewProps} from '@tweakpane/core';

import {PluginImageInputParams} from './index';
import {PluginView} from './view';

interface Config {
	value: Value<string>;
	viewProps: ViewProps;
	params: PluginImageInputParams;
}

// Custom controller class should implement `Controller` interface
export class PluginController implements Controller<PluginView> {
	public readonly value: Value<string>;
	public readonly initialValue: {isNotSet: boolean; value: string} = {
		isNotSet: true,
		value: '',
	};
	public currentValue?: string;

	public readonly view: PluginView;
	public readonly viewProps: ViewProps;
	public readonly params: PluginImageInputParams;

	constructor(doc: Document, config: Config) {
		// Receive the bound value from the plugin
		this.value = config.value;

		this.currentValue = this.value.rawValue || undefined;

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
			this.initialValue = {isNotSet: false, value: this.view.image.src};
		}
	}

	private bindAll_(): void {
		this.inputHandler_ = this.inputHandler_.bind(this);
		this.checkboxHandler_ = this.checkboxHandler_.bind(this);
		this.buttonClearHandler_ = this.buttonClearHandler_.bind(this);
	}

	private setupEventListeners_(): void {
		this.view.inputImage.addEventListener('input', this.inputHandler_);
		this.view.checkbox.addEventListener('input', this.checkboxHandler_);
		this.view.buttonClear.addEventListener('click', this.buttonClearHandler_);
	}

	private removeEventListeners_(): void {
		this.view.inputImage.removeEventListener('input', this.inputHandler_);
		this.view.checkbox.removeEventListener('input', this.checkboxHandler_);
		this.view.buttonClear.removeEventListener(
			'click',
			this.buttonClearHandler_,
		);
	}

	private inputHandler_(
		e?: Event,
		options?: {
			saveCurrentValue?: boolean;
			useInitialValue?: boolean;
			clear?: boolean;
		},
	): void {
		if (options?.useInitialValue) {
			this.value.rawValue = this.initialValue.value;
		} else {
			const file = this.view.inputImage.files?.[0];
			if (file) this.value.rawValue = URL.createObjectURL(file);
		}

		if (options?.saveCurrentValue)
			this.currentValue = this.value.rawValue || undefined;

		if (options?.clear) this.value.rawValue = '';
	}

	private checkboxHandler_(e: Event): void {
		if (this.view.checkbox.checked) {
			this.inputHandler_(undefined, {saveCurrentValue: true});
			this.view.inputImage.disabled = false;
			this.view.element.style.opacity = '1';
		} else {
			this.inputHandler_(undefined, {useInitialValue: true});
			this.view.inputImage.disabled = true;
			this.view.element.style.opacity = '0.5';
		}

		this.view.checkbox.onchange?.(e);
	}

	private buttonClearHandler_(e: MouseEvent) {
		this.inputHandler_(undefined, {clear: true});
		this.view.checkbox.checked = true;

		this.view.buttonClear.onclick?.(e);
	}
}
